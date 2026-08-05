import { consentLog } from "@/db/schema";
import { safeDb } from "@/db/safe";
import type { ConsentPayload } from "./schema";

/**
 * Writes one row per decision. Never updates: a withdrawal is a new row with
 * action "withdraw", not a change to the row that granted consent. Rewriting
 * the record is precisely what would stop it being evidence.
 */
export async function recordConsent(
  payload: ConsentPayload,
  context: { ipHash: string | null; userAgent: string | null }
): Promise<void> {
  await safeDb(
    "insert consent",
    (db) =>
      db.insert(consentLog).values({
        consentId: payload.consentId,
        action: payload.action,
        categories: payload.categories,
        policyVersion: payload.policyVersion,
        locale: payload.locale,
        ipHash: context.ipHash,
        userAgent: context.userAgent,
      }),
    { action: payload.action, locale: payload.locale }
  );
}
