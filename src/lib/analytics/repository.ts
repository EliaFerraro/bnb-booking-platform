import { and, eq, isNull } from "drizzle-orm";
import { analyticsEvents, pageViews } from "@/db/schema";
import { safeDb } from "@/db/safe";
import type {
  DurationPayload,
  EventPayload,
  PageViewPayload,
} from "./schema";

/**
 * Writes for the analytics tables. Like every other repository here, nothing
 * throws: a measurement that fails to record is an acceptable loss, and must
 * never be visible to the person being measured.
 */

interface RequestContext {
  visitorHash: string | null;
  country: string | null;
}

export async function recordPageView(
  payload: PageViewPayload,
  context: RequestContext
): Promise<void> {
  await safeDb(
    "insert page view",
    (db) =>
      db
        .insert(pageViews)
        .values({
          id: payload.id,
          visitorHash: context.visitorHash,
          path: payload.path,
          locale: payload.locale,
          country: context.country,
          referrerHost: payload.referrerHost ?? null,
          device: payload.device ?? null,
        })
        // The browser retries beacons in some conditions, and a duplicate view
        // would inflate every figure derived from this table.
        .onConflictDoNothing(),
    { path: payload.path }
  );
}

/**
 * Closes a page view with how long it was open.
 *
 * Only fills a duration that is still null, so a retried beacon cannot overwrite
 * a recorded time — and only for a view that already exists, so a closing
 * beacon that outran its opening one writes nothing rather than creating a
 * half-formed row.
 */
export async function recordDuration(
  payload: DurationPayload
): Promise<void> {
  await safeDb(
    "record view duration",
    (db) =>
      db
        .update(pageViews)
        .set({ durationMs: payload.ms })
        .where(and(eq(pageViews.id, payload.id), isNull(pageViews.durationMs))),
    { id: payload.id }
  );
}

export async function recordEvent(
  payload: EventPayload,
  context: RequestContext
): Promise<void> {
  await safeDb(
    "insert analytics event",
    (db) =>
      db.insert(analyticsEvents).values({
        visitorHash: context.visitorHash,
        name: payload.name,
        path: payload.path,
        locale: payload.locale,
        country: context.country,
        value: payload.value ?? null,
      }),
    { name: payload.name }
  );
}
