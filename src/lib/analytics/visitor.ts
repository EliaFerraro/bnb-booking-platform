import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { analyticsSalts } from "@/db/schema";
import { safeDb } from "@/db/safe";
import { clientIp, userAgent } from "@/lib/privacy/ip";

/**
 * Who a visitor is, for the length of one day and no longer.
 *
 * Distinguishing one visitor from another is the minimum needed to answer
 * "how many people" and "how long did a visit last". Doing it without following
 * anyone is the whole design problem, and the answer is a salt that is random,
 * shared for a day, and then destroyed.
 *
 * Why the salt is stored rather than derived: a salt computed from a long-lived
 * secret and the date would be reproducible forever by anyone holding that
 * secret, so yesterday's hashes could always be re-matched against a guessed
 * address. A random salt that is *deleted* cannot be reconstructed by anybody,
 * including us — after two days the hashes are permanently inert. That is the
 * difference between data that is obscured and data that is genuinely
 * anonymous, and it is what keeps this outside the consent requirement.
 */

/** UTC, so every instance agrees regardless of where it runs. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// One database round trip per instance per day. The salt is not secret from
// us — it is secret from the future, once deleted — so caching it in memory
// costs nothing.
let cached: { day: string; salt: string } | null = null;

async function dailySalt(): Promise<string | null> {
  const day = today();
  if (cached?.day === day) return cached.salt;

  const candidate = randomBytes(32).toString("hex");

  // Insert-or-read in one statement. Several instances racing on the first
  // request of the day must end up with the same salt, or the same person
  // would be counted once per instance.
  const rows = await safeDb("claim daily analytics salt", async (db) => {
    await db
      .insert(analyticsSalts)
      .values({ day, salt: candidate })
      .onConflictDoNothing();

    return db
      .select({ salt: analyticsSalts.salt })
      .from(analyticsSalts)
      .where(eq(analyticsSalts.day, day));
  });

  const salt = rows?.[0]?.salt;
  if (!salt) return null;

  cached = { day, salt };
  return salt;
}

/**
 * Returns null when there is no salt to be had — an unconfigured or unreachable
 * database — in which case the caller records the view with no visitor at all.
 * A page view with no visitor still counts as a page view; it simply cannot be
 * grouped into a session. Losing that is much better than inventing a weaker
 * identifier as a fallback.
 */
export async function visitorHash(): Promise<string | null> {
  const [ip, agent, salt] = await Promise.all([
    clientIp(),
    userAgent(),
    dailySalt(),
  ]);

  if (!salt || !ip) return null;

  return createHash("sha256")
    .update(`${salt}:${ip}:${agent ?? ""}`)
    .digest("hex");
}

/**
 * Two-letter country code from the platform's geo header. Vercel sets this at
 * the edge, so the country is known without the application ever seeing — let
 * alone storing — the address it was derived from.
 *
 * Absent locally, which is correct: there is no country to report for
 * 127.0.0.1.
 */
export async function visitorCountry(): Promise<string | null> {
  const headerList = await headers();
  const country =
    headerList.get("x-vercel-ip-country") ?? headerList.get("cf-ipcountry");

  // "XX" is Vercel's placeholder when the address cannot be located.
  if (!country || country === "XX") return null;
  return country.slice(0, 2).toUpperCase();
}
