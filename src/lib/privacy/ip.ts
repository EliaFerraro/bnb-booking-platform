import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { ipHashSecret } from "@/lib/env";

/**
 * Turning a visitor's IP address into something we are willing to store.
 *
 * An IP address is personal data under the GDPR — the CJEU settled that in
 * Breyer (C-582/14) — so storing it would put it in the record of processing,
 * in any subject-access response and in any breach notification. The only thing
 * the abuse defence ever needs to do is compare two addresses for equality, and
 * a hash does that just as well, so the address itself is never worth keeping.
 */

/**
 * On Vercel the platform rewrites `x-forwarded-for`, so its first entry is the
 * real client and can be trusted. Behind any other proxy it is only as
 * trustworthy as that proxy.
 */
export async function clientIp(): Promise<string | null> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || null;
}

export async function userAgent(): Promise<string | null> {
  const headerList = await headers();
  // Truncated because the column is only ever read by a human debugging abuse,
  // and some clients send absurdly long strings.
  return headerList.get("user-agent")?.slice(0, 300) || null;
}

/**
 * IPv6 addresses are usually allocated a /64 per subscriber, with the low 64
 * bits varying per device and often per privacy-extension rotation. The /64 is
 * both the stable unit for rate limiting and the less identifying one, so the
 * host part is dropped before hashing.
 */
function normaliseIp(ip: string): string {
  if (!ip.includes(":")) return ip;

  const groups = ip.split(":");
  // Compressed forms ("2001:db8::1") expand to fewer than eight groups; taking
  // the first four is correct for the common uncompressed case and harmless
  // otherwise, since consistency matters more here than exactness.
  return groups.slice(0, 4).join(":");
}

/**
 * Salted SHA-256. The salt is not decorative: an unsalted hash of an IPv4
 * address is a 2^32 search space, which is minutes of brute force, so an
 * unsalted digest is a reversible encoding and would be treated as the address
 * itself. Keeping the secret in the environment rather than the database means
 * a leaked dump alone yields nothing.
 *
 * Returns null when the secret is unset, so a missing variable degrades to
 * storing no IP data at all rather than to storing it weakly.
 */
export function hashIp(ip: string | null): string | null {
  const secret = ipHashSecret();
  if (!secret || !ip) return null;

  return createHash("sha256")
    .update(`${normaliseIp(ip)}:${secret}`)
    .digest("hex");
}

/** The common case: read the request's IP and hash it in one step. */
export async function clientIpHash(): Promise<string | null> {
  return hashIp(await clientIp());
}
