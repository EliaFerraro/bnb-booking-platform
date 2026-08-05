/**
 * Site usage measurement (FR-22).
 *
 * The design constraint that shapes everything here: the figures have to be
 * usable, and they are only usable if they cover every visitor. Anything that
 * requires consent is declined by most people, which leaves numbers that are
 * both incomplete and biased — worse than none, because they look authoritative.
 *
 * So this is built to fall inside the analytics exemption in the Garante's 2021
 * cookie guidelines rather than behind the banner:
 *
 * - first party only; nothing reaches a third party;
 * - **nothing is stored on the visitor's device** — no cookie, no localStorage,
 *   no sessionStorage. Under ePrivacy art. 5(3) the consent question is about
 *   storing or reading information on terminal equipment, and this does
 *   neither, so the question does not arise;
 * - visitors are distinguished by a hash of IP and user agent salted with a
 *   secret that is regenerated daily and destroyed, making the identifier
 *   unlinkable across days and unrecoverable afterwards;
 * - the IP itself is never written down; country comes from the platform's geo
 *   header instead;
 * - reporting is about the site, never about a person.
 */

/**
 * Two page views from the same visitor closer together than this belong to the
 * same visit. Thirty minutes is the long-standing convention, which matters
 * only for comparability — nothing depends on the exact figure.
 *
 * Sessions are reconstructed at query time from this gap, not stored. Writing a
 * session id onto each row would create exactly the persistent linkage the
 * design is trying not to have.
 */
export const SESSION_GAP_MINUTES = 30;

/**
 * How long the daily salts are kept. Two days rather than one so that a request
 * arriving either side of midnight still resolves. Once a salt is deleted, the
 * hashes computed with it can never be matched to an address again, even with
 * the database and the environment in hand.
 */
export const SALT_RETENTION_DAYS = 2;

/**
 * When the visitor hash is cleared from the analytics rows.
 *
 * The hash is already unlinkable to a person once its salt is destroyed, so
 * this is a second line rather than the main one — it removes the last trace of
 * linkage *between rows*. The rows themselves survive: path, country, language,
 * duration and date identify nobody and are the whole point of collecting them.
 */
export const ANALYTICS_VISITOR_RETENTION_DAYS = 30;

/** Sanity bound. A "page view" lasting longer than this is a forgotten tab. */
export const MAX_VIEW_DURATION_MS = 30 * 60 * 1_000;

/**
 * Viewport buckets. Deliberately coarse and taken from the reported width
 * rather than by parsing a user-agent string: three buckets answer "does the
 * mobile layout matter" without contributing to a fingerprint.
 */
export const DEVICE_BREAKPOINTS = { mobile: 768, tablet: 1024 } as const;
export const DEVICE_TYPES = ["mobile", "tablet", "desktop"] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

/**
 * Named events. A closed list rather than free-form strings: it keeps the
 * cardinality low, makes the data self-documenting, and stops a stray call site
 * quietly inventing a metric nobody knows the meaning of.
 */
export const ANALYTICS_EVENTS = [
  "enquiry_form_start",
  "enquiry_form_submit",
  "enquiry_form_error",
  "enquiry_form_success",
  "cta_enquiry",
  "contact_whatsapp",
  "contact_phone",
  "contact_email",
  "map_loaded",
  "language_changed",
] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];
