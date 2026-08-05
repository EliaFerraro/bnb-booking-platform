import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { ANALYTICS_EVENTS, DEVICE_TYPES } from "@/configuration/analytics";

/**
 * The single source of truth for the database shape. `npm run db:generate`
 * turns any edit here into a versioned SQL file under db/migrations, which is
 * what actually runs against local Postgres and against Supabase — the same
 * files on both sides.
 *
 * Conventions used throughout:
 *
 * - `timestamptz` (drizzle's `withTimezone: true`) for every instant. Local dev
 *   runs in Europe/Rome while Vercel and Supabase run in UTC; a plain
 *   `timestamp` stores a wall-clock reading with no anchor and is the usual
 *   reason a retention job fires a day early.
 * - `text` rather than `varchar(n)`. In Postgres they are the same type with
 *   the same performance, and the length limits are already enforced by
 *   `enquirySchema` with a translatable error message.
 * - `text` with an enum type argument rather than `pgEnum`. Drizzle gives the
 *   full TypeScript union with no runtime object, and it avoids
 *   `ALTER TYPE ... ADD VALUE`, whose transaction semantics collide with
 *   drizzle-kit wrapping each migration in a transaction.
 * - `.enableRLS()` on every table holding personal data. See the note on
 *   `enquiries` — on Supabase this is a hard security requirement, not a
 *   formality.
 */

export const ENQUIRY_STATUSES = [
  "new",
  "read",
  "replied",
  "booked",
  "archived",
  "spam",
] as const;

export const EMAIL_STATUSES = ["pending", "sent", "failed"] as const;

/**
 * One row per enquiry submitted through the contact form.
 *
 * The host's inbox remains the system of record: this table is a second copy,
 * so an insert failure never fails the submission. Its real value is the
 * opposite case — an enquiry whose email failed to send is preserved here
 * instead of being lost, which it was before persistence existed.
 *
 * Identifying columns are nullable because retention is implemented as
 * anonymisation rather than deletion (see lib/retention/anonymise.ts): at 24
 * months they are set to NULL and `anonymized_at` is stamped, leaving the
 * non-identifying columns — dates, party size, locale — as permanent,
 * non-personal statistics. The invariant that a *live* row always carries a
 * full identity is enforced by `enquiries_identity_present` below, so a buggy
 * insert still fails loudly.
 */
export const enquiries = pgTable(
  "enquiries",
  {
    // uuid, not a sequence: these ids end up in host-facing URLs, and a
    // sequential integer would leak the property's total enquiry volume to
    // anyone who saw one. gen_random_uuid() is core since Postgres 13, so no
    // extension is needed on either local PG17 or Supabase.
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    message: text("message"),

    // A check-in date is a calendar fact with no instant and no timezone.
    // Stored as `date` and read back as a "YYYY-MM-DD" string so the type maps
    // 1:1 onto EnquiryInput; `mode: "date"` would introduce a lossy Date
    // conversion at both ends and could shift the day across a DST boundary.
    arrival: date("arrival", { mode: "string" }),
    departure: date("departure", { mode: "string" }),
    guests: smallint("guests"),

    locale: text("locale").notNull(),
    /** Which page the guest submitted from. Non-identifying, kept forever. */
    sourcePath: text("source_path"),

    // Salted SHA-256 of the visitor IP, never the address itself: the only
    // purpose is equality comparison for abuse prevention, which a hash serves
    // exactly as well. See lib/privacy/ip.ts.
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),

    /**
     * How long the guest spent filling the form, in milliseconds. Derived from
     * the timestamp the bot trap already stamps on mount, so it costs nothing
     * to collect. Non-identifying, and therefore survives anonymisation: it is
     * how you find out whether the form is too long.
     */
    fillDurationMs: integer("fill_duration_ms"),

    status: text("status", { enum: ENQUIRY_STATUSES }).notNull().default("new"),
    emailHostStatus: text("email_host_status", { enum: EMAIL_STATUSES })
      .notNull()
      .default("pending"),
    emailGuestStatus: text("email_guest_status", { enum: EMAIL_STATUSES })
      .notNull()
      .default("pending"),

    /** Null while the row is still identifiable. */
    anonymizedAt: timestamp("anonymized_at", { withTimezone: true }),
  },
  (table) => [
    // The columns cannot be NOT NULL (anonymisation has to empty them), so the
    // invariant is expressed conditionally instead: while a row is live its
    // identity is complete; once anonymised it may be absent. This also puts
    // the retention policy in the schema itself, which is worth something for
    // GDPR art. 5(2) accountability.
    check(
      "enquiries_identity_present",
      sql`${table.anonymizedAt} IS NOT NULL OR (
        ${table.firstName} IS NOT NULL AND
        ${table.lastName} IS NOT NULL AND
        ${table.email} IS NOT NULL AND
        ${table.message} IS NOT NULL
      )`
    ),
    check(
      "enquiries_guests_range",
      sql`${table.guests} IS NULL OR (${table.guests} BETWEEN 1 AND 20)`
    ),
    check(
      "enquiries_locale_length",
      sql`char_length(${table.locale}) BETWEEN 2 AND 5`
    ),

    index("enquiries_created_at_idx").on(table.createdAt.desc()),
    // The index the retention job scans. Because it excludes rows already
    // anonymised, it shrinks as the job runs and stays permanently small.
    index("enquiries_pending_anonymisation_idx")
      .on(table.createdAt)
      .where(sql`${table.anonymizedAt} IS NULL`),
    // Serves the DB-backed rate limit: "how many enquiries from this IP in the
    // last ten minutes".
    index("enquiries_ip_hash_recent_idx")
      .on(table.ipHash, table.createdAt.desc())
      .where(sql`${table.ipHash} IS NOT NULL`),
  ]
  // Supabase serves the entire `public` schema over PostgREST using the
  // publishable anon key, which ships to the browser. Tables created by a
  // migration (rather than through the dashboard) have RLS off by default, so
  // without this line GET /rest/v1/enquiries would return every guest's name,
  // email, phone and message to anyone. With RLS on and no policies defined,
  // `anon` gets nothing; the app connects as the table owner, and owners bypass
  // RLS, so the application is unaffected. Valid on plain Postgres too.
).enableRLS();

export const CONSENT_ACTIONS = [
  "accept_all",
  "reject_all",
  "custom",
  "withdraw",
] as const;

/**
 * Append-only evidence that a given visitor was shown a specific version of the
 * cookie notice and made a specific choice — the GDPR art. 7(1) "be able to
 * demonstrate consent" record. This is the thing a paid consent-management
 * platform would sell you, and the reason building the banner in-house does not
 * mean giving up the proof.
 *
 * Never UPDATE this table except for the anonymisation nulling. A withdrawal is
 * a new row with action = 'withdraw', not a mutation of the row that granted
 * consent — rewriting history is exactly what would make it worthless as
 * evidence.
 */
export const consentLog = pgTable(
  "consent_log",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    // The id carried in the visitor's consent cookie. Deliberately NOT unique:
    // accept, then withdraw, then accept again is three legitimate rows.
    // Client-generated and therefore forgeable, which is fine — this records a
    // choice, it does not authenticate anyone.
    consentId: uuid("consent_id").notNull(),

    action: text("action", { enum: CONSENT_ACTIONS }).notNull(),

    // jsonb rather than one boolean column per category. A consent record has
    // to say what was *offered* and what was *chosen* at that moment; a column
    // added when a new category appears would read as absent for every historic
    // row and silently rewrite what those visitors were asked.
    categories: jsonb("categories").notNull(),

    /** Which revision of the notice the visitor actually read, e.g. "2026-08-04". */
    policyVersion: text("policy_version").notNull(),
    /** Which language it was read in — relevant to whether consent was informed. */
    locale: text("locale").notNull(),

    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),

    anonymizedAt: timestamp("anonymized_at", { withTimezone: true }),
  },
  (table) => [
    index("consent_log_consent_id_idx").on(
      table.consentId,
      table.createdAt.desc()
    ),
    index("consent_log_pending_anonymisation_idx")
      .on(table.createdAt)
      .where(sql`${table.anonymizedAt} IS NULL`),
  ]
).enableRLS();

/**
 * One row per execution of the retention job.
 *
 * GDPR art. 5(2) requires being able to *demonstrate* that the stated retention
 * policy is enforced, not merely to assert it in a privacy notice. It is also
 * the only way to notice that a scheduled job stopped firing — a silence that
 * otherwise looks identical to "there was nothing to anonymise".
 *
 * Contains no personal data and is therefore never anonymised itself.
 */
export const retentionRuns = pgTable("retention_runs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  ranAt: timestamp("ran_at", { withTimezone: true }).notNull().defaultNow(),
  enquiriesAnonymized: integer("enquiries_anonymized").notNull().default(0),
  consentsAnonymized: integer("consents_anonymized").notNull().default(0),
  viewsAnonymized: integer("views_anonymized").notNull().default(0),
  eventsAnonymized: integer("events_anonymized").notNull().default(0),
  saltsDropped: integer("salts_dropped").notNull().default(0),
  durationMs: integer("duration_ms").notNull().default(0),
  ok: boolean("ok").notNull().default(true),
  error: text("error"),
  // No personal data here, but the counts describe traffic volume and the
  // health of the retention job — not something to serve to the public.
}).enableRLS();

/**
 * The daily secret that salts the visitor hash.
 *
 * This table is the reason the analytics identifier is genuinely temporary
 * rather than merely obscured. A salt derived from a long-lived secret and the
 * date would be reproducible forever by anyone holding that secret; a random
 * salt that is *deleted* after two days cannot be reconstructed by anybody,
 * including us. After deletion, yesterday's hashes are permanently unmatchable
 * to any address.
 *
 * Rows are written once, read many times, and dropped by the retention job.
 */
export const analyticsSalts = pgTable("analytics_salts", {
  /** The UTC day the salt applies to. */
  day: date("day", { mode: "string" }).primaryKey(),
  salt: text("salt").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  // The most important .enableRLS() in this file. A readable salt would let
  // anyone recompute today's visitor hashes from a guessed IP and user agent,
  // which is precisely what this table exists to prevent.
}).enableRLS();

/**
 * One row per page view.
 *
 * Sessions are deliberately *not* stored. "How long was this visit" is answered
 * at query time by grouping a visitor's rows on a 30-minute gap; writing a
 * session id onto each row would manufacture exactly the durable linkage this
 * design avoids. The cost is a slightly more interesting query, paid once by
 * whoever reads the numbers rather than by every visitor.
 */
export const pageViews = pgTable(
  "page_views",
  {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    // sha256(daily salt + IP + user agent). Distinguishes visitors within a
    // day and cannot follow anyone across days, because the salt is destroyed.
    // Cleared entirely after 30 days.
    visitorHash: text("visitor_hash"),

    path: text("path").notNull(),
    locale: text("locale").notNull(),
    /** Two-letter code from the platform's geo header. The IP is never stored. */
    country: text("country"),
    /** Host only, never the full URL — the path of a referring page can be revealing. */
    referrerHost: text("referrer_host"),
    device: text("device", { enum: DEVICE_TYPES }),

    /**
     * Filled in by a second beacon when the visitor leaves the page, so it is
     * null for the page someone is still reading and for any view whose
     * closing beacon was lost. Treat null as "unknown", never as zero.
     */
    durationMs: integer("duration_ms"),
  },
  (table) => [
    index("page_views_created_at_idx").on(table.createdAt.desc()),
    index("page_views_path_idx").on(table.path, table.createdAt.desc()),
    // Serves both the session reconstruction and the retention sweep.
    index("page_views_visitor_idx")
      .on(table.visitorHash, table.createdAt)
      .where(sql`${table.visitorHash} IS NOT NULL`),
  ]
).enableRLS();

/**
 * Named interactions: which calls to action are used, how far people get
 * through the enquiry form, whether anyone loads the map.
 *
 * `value` carries a single number where one is meaningful — how long the form
 * took, for instance — rather than a free-form payload, so the table cannot
 * quietly become a place where arbitrary details about a visitor accumulate.
 */
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    visitorHash: text("visitor_hash"),
    name: text("name", { enum: ANALYTICS_EVENTS }).notNull(),
    path: text("path").notNull(),
    locale: text("locale").notNull(),
    country: text("country"),
    value: integer("value"),
  },
  (table) => [
    index("analytics_events_name_idx").on(table.name, table.createdAt.desc()),
    index("analytics_events_visitor_idx")
      .on(table.visitorHash, table.createdAt)
      .where(sql`${table.visitorHash} IS NOT NULL`),
  ]
).enableRLS();

export type EnquiryRow = typeof enquiries.$inferSelect;
export type NewEnquiryRow = typeof enquiries.$inferInsert;
export type ConsentLogRow = typeof consentLog.$inferSelect;
export type NewConsentLogRow = typeof consentLog.$inferInsert;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export type EmailStatus = (typeof EMAIL_STATUSES)[number];
export type ConsentAction = (typeof CONSENT_ACTIONS)[number];
export type PageViewRow = typeof pageViews.$inferSelect;
export type AnalyticsEventRow = typeof analyticsEvents.$inferSelect;
