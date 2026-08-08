/**
 * The numbers the privacy notice promises and the code has to honour.
 *
 * They live together because every one of them appears in two places — a
 * sentence a guest reads and a branch the server takes — and a policy that says
 * something the code does not do is worse than no policy at all.
 *
 * Imported by both client and server code, like the rest of configuration/, so
 * nothing secret belongs here.
 */

import { PROPERTY } from "./property.mjs";

/**
 * Bumping this invalidates every stored choice: the banner reappears and the
 * next decision is logged against the new version. Do that when a third-party
 * service is added or removed, a purpose changes, or the retention period
 * changes — not for typos or new translations. Needless re-prompting teaches
 * people to click "accept everything" without reading, which makes the consent
 * less meaningful rather than more.
 *
 * A date rather than a counter, so consent_log.policy_version answers "which
 * text did this visitor actually read" without a lookup table.
 */
export const CONSENT_POLICY_VERSION = "2026-08-04";

/**
 * The "last updated" date on the legal pages. Deliberately *not* the same
 * constant as the consent version, though they may hold the same value.
 *
 * The notices change more often than consent needs re-asking. Analytics is the
 * worked example: it added a processing purpose that had to be disclosed, but
 * it relies on no consent at all, so re-prompting would have asked visitors
 * again about the map for no reason — friction that teaches people to dismiss
 * banners without reading them.
 */
export const LEGAL_UPDATED_AT = "2026-08-05";

/**
 * Namespaced by the property slug so a cookie inspector shows whose site set
 * it. Renaming the slug in `configuration/property.mjs` therefore makes every
 * stored choice unreadable and re-shows the banner — worth knowing, and only
 * ever acceptable when the site changes hands.
 */
export const CONSENT_COOKIE = `${PROPERTY.brand.slug}_consent`;

/**
 * Six months. The Italian Garante's cookie guidelines expect a declined banner
 * not to be re-proposed for at least that long, so the same lifetime is used
 * for an acceptance: both choices deserve equal respect.
 */
export const CONSENT_MAX_AGE_DAYS = 180;

/**
 * Categories the banner offers. "necessary" is always on and cannot be
 * declined — it covers the language and consent cookies, which exist only to
 * carry out something the visitor asked for. "maps" gates the Google Maps
 * embed, which is the only third party this site loads.
 */
export const CONSENT_CATEGORIES = ["necessary", "maps"] as const;
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

/** Categories a visitor can actually decide about. */
export const OPTIONAL_CONSENT_CATEGORIES = ["maps"] as const satisfies readonly ConsentCategory[];

/**
 * After this, an enquiry is anonymised rather than deleted: name, email, phone,
 * message and IP hash are cleared, while dates, party size and locale remain as
 * statistics that no longer identify anyone. Stated in the privacy notice and
 * enforced by lib/retention/anonymise.ts — change one and you must change both.
 */
export const RETENTION_MONTHS = 24;

/** Anti-abuse limit on the enquiry form, applied both in memory and in the database. */
export const RATE_LIMIT_MAX = 3;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
