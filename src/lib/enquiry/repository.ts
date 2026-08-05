import { and, count, eq, gt, sql } from "drizzle-orm";
import { enquiries, type EmailStatus } from "@/db/schema";
import { safeDb } from "@/db/safe";
import { RATE_LIMIT_WINDOW_MS } from "@/configuration/privacy";
import type { EnquiryInput } from "./schema";

/**
 * Database access for enquiries. Every function here returns rather than
 * throws: the host's inbox is the system of record, so a database that is
 * unreachable must never turn a successful enquiry into a failed one.
 */

export interface EnquiryContext {
  ipHash: string | null;
  userAgent: string | null;
  /** Milliseconds between the form mounting and being submitted, when known. */
  fillDurationMs: number | null;
}

/**
 * Returns the new row's id, or null if the insert did not happen — because the
 * database is unconfigured, unreachable, or rejected the row.
 *
 * `EnquiryInput` maps onto the table one field at a time by design: the schema
 * was written to be this row long before the table existed.
 */
export async function insertEnquiry(
  enquiry: EnquiryInput,
  context: EnquiryContext
): Promise<string | null> {
  const rows = await safeDb(
    "insert enquiry",
    (db) =>
      db
        .insert(enquiries)
        .values({
          firstName: enquiry.firstName,
          lastName: enquiry.lastName,
          email: enquiry.email,
          phone: enquiry.phone ?? null,
          message: enquiry.message,
          arrival: enquiry.arrival ?? null,
          departure: enquiry.departure ?? null,
          guests: enquiry.guests ?? null,
          locale: enquiry.locale,
          sourcePath: enquiry.sourcePath ?? null,
          ipHash: context.ipHash,
          userAgent: context.userAgent,
          fillDurationMs: context.fillDurationMs,
        })
        .returning({ id: enquiries.id }),
    // Diagnostics only. Never log the enquiry itself: that would write the
    // guest's name and message into the hosting provider's log store, which is
    // undisclosed processing on a retention schedule we do not control.
    { locale: enquiry.locale, sourcePath: enquiry.sourcePath }
  );

  return rows?.[0]?.id ?? null;
}

/**
 * Records how the two emails actually went. Called after the response has been
 * flushed, so it never delays the guest.
 */
export async function markEmailOutcome(
  id: string,
  host: EmailStatus,
  guest: EmailStatus
): Promise<void> {
  await safeDb(
    "update enquiry email status",
    (db) =>
      db
        .update(enquiries)
        .set({ emailHostStatus: host, emailGuestStatus: guest })
        .where(eq(enquiries.id, id)),
    { id, host, guest }
  );
}

/**
 * How many enquiries this IP has already had accepted inside the window.
 *
 * Counts from `enquiries` itself rather than a dedicated table: successful
 * submissions are exactly what should count against the limit, and a rejected
 * attempt should not extend its own window.
 *
 * Returns null when the database cannot answer — and the caller must read that
 * as "allow". A rate limiter that fails closed turns a momentary database blip
 * into a total outage of the only way a guest can reach the property, which is
 * a far worse outcome than a few extra spam emails.
 */
export async function countRecentByIp(ipHash: string): Promise<number | null> {
  const rows = await safeDb(
    "count recent enquiries",
    (db) =>
      db
        .select({ total: count() })
        .from(enquiries)
        .where(
          and(
            eq(enquiries.ipHash, ipHash),
            gt(
              enquiries.createdAt,
              sql`now() - ${`${RATE_LIMIT_WINDOW_MS} milliseconds`}::interval`
            )
          )
        ),
    { ipHash }
  );

  return rows?.[0]?.total ?? null;
}
