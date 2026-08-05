import {
  CONSENT_CATEGORIES,
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_POLICY_VERSION,
} from "@/configuration/privacy";
import {
  consentCookieSchema,
  type ConsentChoices,
  type ConsentCookieValue,
} from "./schema";

/**
 * Reading and writing the consent cookie. No DOM and no node APIs at the top
 * level, so the parsing half is usable from either side.
 */

export const NECESSARY_ONLY: ConsentChoices = Object.fromEntries(
  CONSENT_CATEGORIES.map((category) => [category, category === "necessary"])
) as ConsentChoices;

export const ALL_GRANTED: ConsentChoices = Object.fromEntries(
  CONSENT_CATEGORIES.map((category) => [category, true])
) as ConsentChoices;

/**
 * Returns null for anything that is not a decision made against the *current*
 * policy: absent, malformed, or recorded against an older version. Treating a
 * stale version as "no consent" is the point of versioning — consent is given
 * to a specific set of disclosures, and it cannot outlive them.
 */
export function parseConsentCookie(raw: string | undefined): ConsentCookieValue | null {
  if (!raw) return null;

  try {
    const parsed = consentCookieSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    if (!parsed.success) return null;
    if (parsed.data.v !== CONSENT_POLICY_VERSION) return null;
    return parsed.data;
  } catch {
    // A truncated or hand-edited cookie is indistinguishable from no cookie.
    return null;
  }
}

/** Pulls the consent cookie out of a `document.cookie`-style string. */
export function readConsentCookie(cookieString: string): ConsentCookieValue | null {
  const match = cookieString
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`));

  return parseConsentCookie(match?.slice(CONSENT_COOKIE.length + 1));
}

export function serialiseConsentCookie(value: ConsentCookieValue): string {
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  const attributes = [
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}`,
    "path=/",
    `max-age=${maxAge}`,
    "SameSite=Lax",
  ];

  // Set only over HTTPS: on localhost the flag would stop the cookie being
  // stored at all, and the banner would reappear on every page.
  if (typeof location !== "undefined" && location.protocol === "https:") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function buildConsentCookie(choices: ConsentChoices, id: string): ConsentCookieValue {
  return {
    v: CONSENT_POLICY_VERSION,
    i: id,
    c: choices,
    t: Date.now(),
  };
}
