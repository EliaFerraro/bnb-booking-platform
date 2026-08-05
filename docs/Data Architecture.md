# Data Architecture

This document defines the data models, database schema, and entity relationships for the platform.

It is split in two. **Section 1 is what exists** — tables that are created by committed migrations and written to by running code. **Section 2 is the design for the booking engine**, which is not built: no table in it exists, and nothing in the codebase reads or writes one. Keeping the two apart matters, because for a long time this document described only Section 2 and read as though it were current.

The architecture is relational, ensuring transactional integrity (ACID) and scalability for future "White-Label" implementations.

- **Engine:** PostgreSQL. Local development runs against a PostgreSQL 17 instance; production against Supabase.
- **Access:** Drizzle ORM, with `db/schema.ts` as the single source of truth and versioned SQL migrations in `src/db/migrations/`. See [Deployment Strategy](./Deployment%20Strategy.md) §2.
- **Optional by design:** with `DATABASE_URL` unset the site still runs and still emails enquiries. Every query goes through `safeDb()`, which returns `null` instead of throwing.

---

## 1 Implemented schema

### 1.1 Enquiries

One row per submission of the contact form. Backs FR-20.

```sql
ENQUIRIES (
    UUID id PRIMARY KEY DEFAULT gen_random_uuid(),
    Timestamptz created_at NOT NULL DEFAULT now(),

    Text first_name,            -- cleared on anonymisation
    Text last_name,             -- cleared on anonymisation
    Text email,                 -- cleared on anonymisation
    Text phone,                 -- cleared on anonymisation
    Text message,               -- cleared on anonymisation

    Date arrival,               -- retained indefinitely
    Date departure,             -- retained indefinitely
    Smallint guests,            -- retained indefinitely, CHECK BETWEEN 1 AND 20
    Text locale NOT NULL,       -- retained indefinitely, CHECK length 2..5
    Text source_path,           -- retained indefinitely

    Text ip_hash,               -- salted SHA-256, cleared on anonymisation
    Text user_agent,            -- cleared on anonymisation

    Text status NOT NULL DEFAULT 'new',
        -- ['new','read','replied','booked','archived','spam']
    Text email_host_status NOT NULL DEFAULT 'pending',   -- ['pending','sent','failed']
    Text email_guest_status NOT NULL DEFAULT 'pending',  -- ['pending','sent','failed']

    Timestamptz anonymized_at   -- NULL while the row is still identifiable
)
```

**Why the table exists at all.** The host's inbox remains the system of record. What the table adds is recovery: before it, a failed `notifyHost()` meant the enquiry was lost with no trace, and the guest was told only that something went wrong. Now the row survives with `email_host_status = 'failed'`.

**The identity invariant.** The identifying columns cannot be `NOT NULL`, because retention clears them. Dropping the constraint entirely would let a buggy insert write a nameless row, so it is expressed conditionally instead:

```sql
CHECK (
  anonymized_at IS NOT NULL
  OR (first_name IS NOT NULL AND last_name IS NOT NULL
      AND email IS NOT NULL AND message IS NOT NULL)
)
```

While a row is live its identity is complete; once anonymised it may be absent. This also puts the retention policy in the schema itself, which is worth something for GDPR art. 5(2) accountability.

**Type choices worth recording.**

- `uuid` rather than a sequence: these ids will reach host-facing URLs, and a sequential integer leaks total enquiry volume to anyone who sees one. `gen_random_uuid()` is core since PG13, so no extension is needed on either side.
- `date` rather than `timestamptz` for `arrival`/`departure`: a check-in date is a calendar fact with no instant, and a timestamp would shift it across a DST boundary.
- `timestamptz` for every audit column: local development runs in Europe/Rome while Vercel and Supabase run in UTC.
- `text` with a `CHECK` rather than `pgEnum` for the three status columns: `ALTER TYPE ... ADD VALUE` has transaction semantics that collide with drizzle-kit wrapping each migration in a transaction. Drizzle's `text({ enum: [...] })` still yields the full TypeScript union.

**Indexes.**

```sql
CREATE INDEX enquiries_created_at_idx ON enquiries (created_at DESC);
CREATE INDEX enquiries_pending_anonymisation_idx
  ON enquiries (created_at) WHERE anonymized_at IS NULL;
CREATE INDEX enquiries_ip_hash_recent_idx
  ON enquiries (ip_hash, created_at DESC) WHERE ip_hash IS NOT NULL;
```

The second is scanned by the retention job and shrinks as the job runs, since anonymised rows leave it. The third serves the rate limit.

**Naming.** `enquiries`, not `bookings`. §2 reserves `BOOKINGS` for a reservation with a price and a payment; an enquiry is a distinct, pre-contractual thing. When the booking engine lands, this table gains a nullable `booking_id UUID REFERENCES bookings(id)` and the model stays honest.

### 1.2 Consent log

Append-only evidence of cookie decisions. Backs NFR-10c.

```sql
CONSENT_LOG (
    UUID id PRIMARY KEY DEFAULT gen_random_uuid(),
    Timestamptz created_at NOT NULL DEFAULT now(),
    UUID consent_id NOT NULL,       -- from the visitor's cookie; NOT unique
    Text action NOT NULL,           -- ['accept_all','reject_all','custom','withdraw']
    JSONB categories NOT NULL,      -- what was offered and what was chosen
    Text policy_version NOT NULL,   -- e.g. '2026-08-04'
    Text locale NOT NULL,           -- which language it was read in
    Text ip_hash,                   -- cleared on anonymisation
    Text user_agent,                -- cleared on anonymisation
    Timestamptz anonymized_at
)
```

This table is the reason a self-built banner is defensible without a commercial consent platform: GDPR art. 7(1) requires being able to *demonstrate* consent, and this is that demonstration. Free tiers of hosted CMPs typically omit or cap exactly this.

- `consent_id` is **not unique**: accept, then withdraw, then accept again is three legitimate rows.
- `categories` is `jsonb` rather than one boolean column per category, because a record of consent must say what was *offered* at that moment. A column added when a new category appears would read as absent for every historic row and silently rewrite what those visitors were asked.
- **Never `UPDATE`** except for the anonymisation nulling. A withdrawal is a new row. Rewriting history is what would stop it being evidence.
- `locale` is recorded because consent must be *informed*, and that is language-dependent.

### 1.3 Retention runs

```sql
RETENTION_RUNS (
    UUID id PRIMARY KEY DEFAULT gen_random_uuid(),
    Timestamptz ran_at NOT NULL DEFAULT now(),
    Integer enquiries_anonymized NOT NULL DEFAULT 0,
    Integer consents_anonymized NOT NULL DEFAULT 0,
    Integer duration_ms NOT NULL DEFAULT 0,
    Boolean ok NOT NULL DEFAULT true,
    Text error
)
```

Three columns and one insert a day, and they buy two things: proof that the stated retention policy is actually enforced, and a way to notice the scheduled job stopped firing — otherwise silence is indistinguishable from "nothing to do". Contains no personal data and is never anonymised.

### 1.4 Retention: anonymisation, not deletion

Implemented in `src/lib/retention/anonymise.ts`, driven daily by `/api/cron/anonymise`.

At **24 months** (`RETENTION_MONTHS` in `src/configuration/privacy.ts`) an enquiry's identifying columns are set to `NULL` and `anonymized_at` is stamped. What remains — requested dates, party size, locale, source page, month of enquiry — cannot be traced to a person and so is no longer personal data (GDPR recital 26), which is what makes it lawful to keep indefinitely.

This is deliberate and not merely convenient. Deleting the rows would discard the only record of how a season went, for no privacy gain. It is also the answer to "how do large companies keep business figures forever" — they do not keep personal data forever, they keep different categories on different clocks and anonymise the rest.

Properties the implementation relies on:

- **Idempotent by construction** — every statement filters on `anonymized_at IS NULL`, so a second run the same day matches nothing.
- **One transaction** for both updates and the audit insert, so a partial failure cannot leave half-anonymised rows or an overstated audit row.
- **The cutoff is computed in SQL** (`now() - '24 months'::interval`), never in JavaScript. The database clock is the single source of truth and `interval` does calendar-correct month arithmetic for free.

Note the separate clock on the *email* copy: it stays in the host's mailbox as long as the enquiry and any resulting stay require, and if a stay goes ahead the resulting tax records are kept ten years under Italian law (art. 2220 Codice Civile). Those are different obligations on different bases and are described in [Privacy & Data Processing](./Privacy%20&%20Data%20Processing.md).

### 1.5 Row Level Security — a deployment-critical detail

Every table holding personal data is created with `ENABLE ROW LEVEL SECURITY`, emitted from `.enableRLS()` in `db/schema.ts`.

This is not decoration on Supabase. Supabase serves the whole `public` schema over PostgREST using the **publishable anon key, which ships to the browser**, and tables created by a migration rather than through the dashboard have RLS **off** by default. Without it, `GET /rest/v1/enquiries?select=*` would return every guest's name, email, phone and message to anyone who viewed the page source.

With RLS on and no policies defined, `anon` gets nothing. The application connects as the table owner, and owners bypass RLS unless `FORCE ROW LEVEL SECURITY` is set, so the app is unaffected. The statement is valid on plain PostgreSQL too, which is why it can live in a migration that runs identically on both sides.

Do **not** add `REVOKE ... FROM anon` to a migration — those roles do not exist locally and the migration would fail there. Run that belt-and-braces revoke once by hand in the Supabase SQL editor.

---

## 2 Planned schema — the booking engine

**None of the following exists.** It is the design for FR-03 through FR-19 and is recorded here so the shipped tables can be extended toward it rather than redesigned. Treat every statement in this section as intent, not fact.

### 2.1 Identity Module

```sql
USERS (
    UUID id PRIMARY KEY,
    String first_name,
    String last_name,
    String email UNIQUE,
    Enum role, -- ['guest', 'host', 'admin']
    Timestamp created_at,
    Timestamp last_access_at
)
```

### 2.2 Inventory & CMS Module

```sql
ROOMS (
    UUID id PRIMARY KEY,
    String name,
    Text description,
    Decimal base_price,
    Integer max_guests,
    JSONB amenities,
    Timestamp updated_at
)

AMENITIES (
    UUID id PRIMARY KEY,
    String name,       -- e.g. "WiFi", "Parking", "Breakfast"
    String icon_slug   -- e.g. "wifi-icon", for the frontend
)

ROOM_IMAGES (              -- FR-02, categorized media gallery
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    String url,
    Enum category,     -- ['bedroom', 'bathroom', 'common', 'outdoor']
    Boolean is_primary,
    Integer display_order
)
```

### 2.3 Booking & Transactional Module

```sql
BOOKINGS (
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    UUID user_id FK -> USERS(id),
    UUID enquiry_id FK -> ENQUIRIES(id),  -- nullable: not every booking starts as an enquiry
    Date check_in,
    Date check_out,
    Decimal total_price,
    Enum status,          -- ['pending_payment', 'confirmed', 'cancelled', 'completed']
    Timestamp expires_at, -- mutex: 10 minutes while status is 'pending_payment'
    Text guest_notes,
    Timestamp created_at
)

PAYMENTS (                 -- FR-05, via Stripe
    UUID id PRIMARY KEY,
    UUID booking_id FK -> BOOKINGS(id),
    String stripe_payment_intent_id,
    Decimal amount,
    String currency,
    Enum status,          -- ['succeeded', 'failed', 'processing', 'refunded']
    Timestamp created_at
)
```

### 2.4 Availability & Sync Module

```sql
AVAILABILITY_OVERRIDES (   -- FR-11, iCal sync
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    Date date,
    Enum source,          -- ['manual_host', 'ical_airbnb', 'ical_booking', 'maintenance']
    String notes,
    Timestamp created_at
)

PRICING_RULES (            -- FR-12, FR-13
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    Date start_date,
    Date end_date,
    Decimal price_modifier,
    Integer min_stay,
    String label
)
```

### 2.5 Communication Module

```sql
CONVERSATIONS (            -- FR-17
    UUID id PRIMARY KEY,
    UUID guest_id FK -> USERS(id),
    UUID host_id FK -> USERS(id),
    Timestamp created_at,
    Timestamp last_message_at
)

MESSAGES (
    UUID id PRIMARY KEY,
    UUID conversation_id FK -> CONVERSATIONS(id),
    UUID sender_id FK -> USERS(id),
    Text content,
    Timestamp sent_at,
    Boolean is_read
)
```

### 2.6 Entity relationships

- **Users to Bookings (1:N)** — a guest can have multiple reservations.
- **Rooms to Bookings (1:N)** — a room can be booked many times, but never on overlapping dates.
- **Rooms to Amenities (N:M)** — a room can have many amenities and an amenity can belong to many rooms.
- **Rooms to Room_Images (1:N)** — supports the categorized gallery.
- **Bookings to Payments (1:N)** — typically one successful payment, but possibly several failed attempts.
- **Bookings to Messages (1:N)** — communication is contextualised within a booking.
- **Enquiries to Bookings (1:0..1)** — an enquiry may eventually become a booking; most never will.

### 2.7 Business logic

**Concurrency Guard (Mutex, FR-19).** When a guest enters the checkout flow, a `BOOKINGS` record is created with status `pending_payment`. Any availability query must exclude dates where a booking is `confirmed`, or `pending_payment` with `expires_at` in the future.

**iCal Integration (FR-11).** The synchronisation worker updates `AVAILABILITY_OVERRIDES`. A date blocked in the override table is removed from the availability search engine.

**Retention when this lands.** A booking that actually happened is not an enquiry and cannot follow the 24-month clock: the invoices it produces are subject to a ten-year statutory retention. Expect at least two retention regimes, keyed on whether an enquiry converted.

---

## 3 Implemented: analytics

Backs FR-22. First-party, cookieless, in this same database.

The governing constraint is that the figures must cover **every** visitor. Anything placed behind the consent banner is declined by most people, leaving numbers that are both incomplete and systematically biased — worse than none, because they look authoritative. So the design targets the analytics exemption in the Garante's 2021 cookie guidelines rather than the banner.

### 3.1 The daily salt

```sql
ANALYTICS_SALTS (
    Date day PRIMARY KEY,
    Text salt NOT NULL,          -- 32 random bytes, hex
    Timestamptz created_at NOT NULL DEFAULT now()
)
```

The whole design rests on this table. Visitors are told apart by `sha256(salt + ip + user_agent)`, and the salt is **random, shared for one day, then deleted**.

A salt *derived* from a long-lived secret and the date would have been simpler and is the wrong answer: it stays reproducible forever, so yesterday's hashes could always be re-matched against a guessed address by anyone holding the secret. A random salt that is destroyed cannot be reconstructed by anybody, including us. Two days after collection the hashes are permanently inert — that is the difference between data that is merely obscured and data that is genuinely anonymous, and it is what keeps this outside the consent requirement.

Claimed with `INSERT ... ON CONFLICT DO NOTHING` followed by a read, so instances racing on the first request of the day converge on one salt; otherwise the same person would be counted once per instance. Cached in module memory, so this costs one query per instance per day.

**RLS matters more here than anywhere else in the schema.** A readable salt would let anyone recompute the day's visitor hashes from a guessed IP and user agent.

### 3.2 Page views

```sql
PAGE_VIEWS (
    UUID id PRIMARY KEY,          -- generated in the browser, not by the database
    Timestamptz created_at NOT NULL DEFAULT now(),
    Text visitor_hash,            -- cleared after 30 days
    Text path NOT NULL,
    Text locale NOT NULL,
    Text country,                 -- from the platform geo header; the IP is never stored
    Text referrer_host,           -- host only, never a full URL
    Text device,                  -- ['mobile','tablet','desktop'], from viewport width
    Integer duration_ms           -- filled by the closing beacon; null means unknown
)
```

**Sessions are not stored.** "How long was this visit" is answered at query time by grouping a visitor's rows on a 30-minute gap:

```sql
WITH marked AS (
  SELECT visitor_hash, created_at, duration_ms,
         CASE WHEN created_at - lag(created_at) OVER w > interval '30 minutes'
                   OR lag(created_at) OVER w IS NULL THEN 1 ELSE 0 END AS is_new
  FROM page_views WHERE visitor_hash IS NOT NULL
  WINDOW w AS (PARTITION BY visitor_hash ORDER BY created_at)
)
SELECT visitor_hash,
       sum(is_new) OVER (PARTITION BY visitor_hash ORDER BY created_at) AS session_n,
       duration_ms
FROM marked;
```

Writing a session id onto each row would have been easier to query and would manufacture exactly the durable linkage the design is trying not to create. The cost is paid once by whoever reads the numbers rather than by every visitor.

The id is generated in the browser because two beacons — arrival and departure — must name the same view, and the closing one uses `sendBeacon`, which cannot read a response. It lives in a variable for the life of the page and is never written to the device.

`duration_ms` is null for a page still being read and for any view whose closing beacon was lost. **Treat null as unknown, never as zero**, or every average computed from this column will be wrong.

### 3.3 Events

```sql
ANALYTICS_EVENTS (
    UUID id PRIMARY KEY DEFAULT gen_random_uuid(),
    Timestamptz created_at NOT NULL DEFAULT now(),
    Text visitor_hash,            -- cleared after 30 days
    Text name NOT NULL,           -- closed list, see configuration/analytics.ts
    Text path NOT NULL,
    Text locale NOT NULL,
    Text country,
    Integer value                 -- one number where one is meaningful
)
```

`name` is a closed list rather than a free string: it keeps cardinality low, makes the table self-documenting, and stops a stray call site quietly inventing a metric nobody can interpret. `value` is a single integer rather than a JSON payload, so this table cannot become a place where arbitrary details about a visitor accumulate because it was convenient.

The enquiry funnel is `enquiry_form_start` → `enquiry_form_submit` (carrying the fill duration) → `enquiry_form_success` / `enquiry_form_error`. The gap between the first two counts is the abandonment rate.

`enquiries.fill_duration_ms` records the same duration on the row itself, where it survives anonymisation. It costs nothing to collect: the anti-bot timing check already needs that timestamp.

### 3.4 Analytics retention

| Data | Clock | What happens |
| :--- | :--- | :--- |
| `analytics_salts` | 2 days | **Deleted.** The hashes computed with it become permanently unmatchable. |
| `visitor_hash` on views and events | 30 days | Set to `NULL` |
| Everything else on those rows | indefinite | Retained — path, country, locale, duration, device, date identify nobody |

Two days rather than one for the salt so a request arriving either side of midnight still resolves. The 30-day clearing is a second line rather than the main one: the hash is already inert once its salt is gone, and this removes the last trace of linkage *between rows*.
