import { getDb, isDbConfigured } from "./client";

/**
 * Runs a query, returning null instead of throwing.
 *
 * The database is deliberately non-critical. The host's inbox is the system of
 * record for an enquiry, so an unreachable database — unset URL, stopped local
 * service, paused Supabase project — must degrade to exactly the behaviour the
 * site had before persistence existed: the guest still succeeds, the host still
 * receives the email. Every caller therefore treats `null` as "no answer" and
 * carries on rather than surfacing an error.
 *
 * `context` is for diagnostics only and must never carry personal data. Logging
 * a failed insert's payload is a tempting way to "not lose it", but it would
 * write guests' names and messages into the hosting provider's log store: an
 * undisclosed processing operation, on a retention schedule outside our
 * control, and outside the anonymisation this codebase promises.
 */
export async function safeDb<T>(
  label: string,
  run: (db: ReturnType<typeof getDb>) => Promise<T>,
  context?: Record<string, string | number | boolean | undefined>
): Promise<T | null> {
  if (!isDbConfigured()) return null;

  try {
    return await run(getDb());
  } catch (error) {
    console.error(`[db] ${label} failed`, { ...context, error });
    return null;
  }
}
