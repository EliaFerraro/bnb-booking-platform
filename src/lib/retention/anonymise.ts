import { and, isNotNull, isNull, lt, sql } from "drizzle-orm";
import {
  analyticsEvents,
  analyticsSalts,
  consentLog,
  enquiries,
  pageViews,
  retentionRuns,
} from "@/db/schema";
import { safeDb } from "@/db/safe";
import { RETENTION_MONTHS } from "@/configuration/privacy";
import {
  ANALYTICS_VISITOR_RETENTION_DAYS,
  SALT_RETENTION_DAYS,
} from "@/configuration/analytics";

/**
 * Enforces every retention period the privacy notice promises.
 *
 * Anonymisation rather than deletion throughout, which is what lets the
 * property keep useful figures without keeping anyone's personal data. Once the
 * identifying columns are cleared, what remains cannot be traced back to a
 * person and so is no longer personal data at all (GDPR recital 26). Deleting
 * the rows outright would throw away the only record of how a season went, for
 * no gain in privacy.
 *
 * Idempotent by construction: every statement is filtered so that a row already
 * handled cannot match again, and a second run the same day does nothing.
 */

export interface RetentionResult {
  enquiriesAnonymized: number;
  consentsAnonymized: number;
  viewsAnonymized: number;
  eventsAnonymized: number;
  saltsDropped: number;
  durationMs: number;
}

/**
 * Cutoffs are computed by Postgres, never by JavaScript. The database clock is
 * the single source of truth, and `interval` does calendar-correct month
 * arithmetic for free; a JS equivalent would depend on the server's timezone
 * and on how month lengths were handled, and would eventually fire a day early
 * or late.
 */
const enquiryCutoff = sql`now() - ${`${RETENTION_MONTHS} months`}::interval`;
const visitorCutoff = sql`now() - ${`${ANALYTICS_VISITOR_RETENTION_DAYS} days`}::interval`;
// Every cutoff is written as an interval bound to a text parameter, including
// this one. Passing the number of days as a bare parameter instead —
// `current_date - $1` — leaves Postgres with no type to infer and the
// comparison fails at runtime with "operator does not exist: date < integer".
const saltCutoff = sql`(current_date - ${`${SALT_RETENTION_DAYS} days`}::interval)::date`;

export async function runAnonymisation(): Promise<RetentionResult | null> {
  const startedAt = Date.now();

  return safeDb("retention run", async (db) =>
    // One transaction, so a partial failure cannot leave half-anonymised rows
    // or an audit entry that overstates what happened.
    db.transaction(async (tx) => {
      const anonymisedEnquiries = await tx
        .update(enquiries)
        .set({
          firstName: null,
          lastName: null,
          email: null,
          phone: null,
          message: null,
          ipHash: null,
          userAgent: null,
          anonymizedAt: sql`now()`,
        })
        .where(
          and(lt(enquiries.createdAt, enquiryCutoff), isNull(enquiries.anonymizedAt))
        )
        .returning({ id: enquiries.id });

      // The consent log keeps its evidentiary columns — what was chosen, when,
      // against which policy version — and loses only the two that could point
      // at a person.
      const anonymisedConsents = await tx
        .update(consentLog)
        .set({ ipHash: null, userAgent: null, anonymizedAt: sql`now()` })
        .where(
          and(
            lt(consentLog.createdAt, enquiryCutoff),
            isNull(consentLog.anonymizedAt)
          )
        )
        .returning({ id: consentLog.id });

      // Analytics runs on a far shorter clock, and only the linking column is
      // cleared. The rows themselves — path, country, language, duration, date
      // — identify nobody and are the entire reason for collecting them, so
      // they stay. This is what makes indefinite trend data lawful.
      const anonymisedViews = await tx
        .update(pageViews)
        .set({ visitorHash: null })
        .where(
          and(
            lt(pageViews.createdAt, visitorCutoff),
            isNotNull(pageViews.visitorHash)
          )
        )
        .returning({ id: pageViews.id });

      const anonymisedEvents = await tx
        .update(analyticsEvents)
        .set({ visitorHash: null })
        .where(
          and(
            lt(analyticsEvents.createdAt, visitorCutoff),
            isNotNull(analyticsEvents.visitorHash)
          )
        )
        .returning({ id: analyticsEvents.id });

      // The most consequential statement here. Deleting the salt is what turns
      // the day's visitor hashes from pseudonymous into permanently inert: once
      // it is gone, nobody — including us, holding the database and every
      // secret — can match a hash back to an address.
      const droppedSalts = await tx
        .delete(analyticsSalts)
        .where(lt(analyticsSalts.day, saltCutoff))
        .returning({ day: analyticsSalts.day });

      const result: RetentionResult = {
        enquiriesAnonymized: anonymisedEnquiries.length,
        consentsAnonymized: anonymisedConsents.length,
        viewsAnonymized: anonymisedViews.length,
        eventsAnonymized: anonymisedEvents.length,
        saltsDropped: droppedSalts.length,
        durationMs: Date.now() - startedAt,
      };

      // Accountability under art. 5(2) is about being able to *demonstrate*
      // that the policy is enforced, not just to state it. This row is that
      // evidence, and it is also the only way to notice the job stopped firing
      // — silence otherwise looks exactly like "nothing to do".
      await tx.insert(retentionRuns).values({
        enquiriesAnonymized: result.enquiriesAnonymized,
        consentsAnonymized: result.consentsAnonymized,
        viewsAnonymized: result.viewsAnonymized,
        eventsAnonymized: result.eventsAnonymized,
        saltsDropped: result.saltsDropped,
        durationMs: result.durationMs,
        ok: true,
      });

      return result;
    })
  );
}
