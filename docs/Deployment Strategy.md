# Deployment Strategy

This document outlines the deployment pipeline, infrastructure, and environment management for the B&B Booking Platform. The goal is a reliable, reproducible flow from local development to production.

The npm project root is **`src/`**, not the repository root. Every command below is run from there, and the hosting provider's Root Directory must be set to `src` for the same reason.

## 1. Environment Strategy

| Environment | Purpose | Infrastructure | Database |
| :--- | :--- | :--- | :--- |
| **Development** | Feature development and local testing. | Localhost | Local PostgreSQL 17 (`ilrespirodelborgo`) |
| **Staging/Preview** | PR previews. | Vercel Preview deployments | Supabase (same project as production, until a second is warranted) |
| **Production** | Live site. | Vercel Production | Supabase |

**Vercel, not Netlify.** Earlier revisions of this document listed both, and `Tech Stack & Tools.md` listed neither. The code has been committed to Vercel for some time: `src/configuration/site.ts` resolves the site origin from `VERCEL_ENV`, `VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_URL`, and `src/vercel.json` declares the retention cron.

**Local development uses a local database, not a cloud one.** This is a deliberate change from the previous "cloud-first for all stages" position: it keeps development free, offline-capable and destructible. Parity is preserved by using the same engine on both sides and applying the same migration files.

### 1.1 Running without a database

`DATABASE_URL` being unset is a **supported state**, not a broken one. The site runs, the enquiry form validates and both emails are sent; the enquiry is simply not stored. Every query goes through `safeDb()`, which returns `null` rather than throwing.

This exists so that a fresh clone works with no setup, `next build` never fails for want of a connection string, and a database outage in production degrades to the behaviour the site had before persistence existed rather than taking the contact form down.

## 2. Database Strategy

### 2.1 Schema migrations — Drizzle Kit

The schema is defined in `src/db/schema.ts` and migrations are generated from it. **There is no Supabase CLI in this project and no `/supabase/migrations` folder**; earlier revisions of this document described that arrangement, and it was never built.

```bash
npm run db:generate     # schema.ts -> a new timestamped .sql in db/migrations/ (commit it)
npm run db:migrate      # apply pending migrations
npm run db:studio       # browse the data
npm run check:migrations # offline consistency check, part of `npm run verify`
```

`db:push` also exists. It diffs `schema.ts` straight into a live database with no migration file, which is useful while iterating locally and is how you end up with a production database whose shape no file describes. **Local only. Never point it at `DIRECT_DATABASE_URL`.**

Migration files are committed and are the unit of review. No schema change is ever made by hand in the Supabase dashboard.

### 2.2 Two connection strings on Supabase

| Variable | Used by | Supabase mode | Port |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | the running app | transaction pooler | 6543 |
| `DIRECT_DATABASE_URL` | migrations only | session pooler | 5432 |

Migrations must not go through the transaction pooler. DDL, multi-statement transactions and the `__drizzle_migrations` bookkeeping cannot survive a connection being handed to another client between statements.

`drizzle.config.ts` falls back `DIRECT_DATABASE_URL ?? DATABASE_URL`, so **locally only `DATABASE_URL` is ever set** and both paths use it.

Two things to expect when provisioning Supabase:

- The runtime client sets `prepare: false`, because the transaction pooler cannot carry named prepared statements across pooled connections. Harmless against a plain local server.
- The true direct host (`db.<ref>.supabase.co:5432`) is IPv6-only on the free tier. On an IPv4-only connection this fails in a way that looks like bad credentials. The IPv4-reachable path is the **session pooler**. Copy both strings from the dashboard's Connect modal rather than assembling them by hand.

### 2.3 Applying migrations to production

**Manually, from a developer machine, as a deliberate step before promoting a deploy:**

```bash
DIRECT_DATABASE_URL="postgresql://..." npm run db:migrate
```

Not as a build step. `"build": "drizzle-kit migrate && next build"` is superficially attractive and wrong here:

1. Preview deploys run the build too, so every pull request would migrate production.
2. Migrations would run before the deploy is promoted; if promotion fails or is rolled back, the schema has moved and the code has not.
3. It puts the most privileged credential in the build environment, where it is least needed.

At this project's rate of change this is a handful of commands a year, and every migration file has already been reviewed. Supabase's SQL editor is the break-glass fallback: paste the `.sql`, then insert the corresponding row into `drizzle.__drizzle_migrations` so Drizzle does not re-apply it.

### 2.4 Row Level Security — mandatory before the first production insert

Tables created by a Drizzle migration have RLS **off** by default on Supabase, and Supabase exposes the whole `public` schema over PostgREST with an anon key that ships to the browser. `db/schema.ts` therefore calls `.enableRLS()` on every table holding personal data. See [Data Architecture §1.5](./Data%20Architecture.md).

Verify after the first production migration: with the anon key, `GET /rest/v1/enquiries?select=*` must return an empty set or an error, never rows.

### 2.5 Local first-time setup

```powershell
cd src
npm install
npm run db:bootstrap    # creates role + database; prompts for the postgres superuser password
# add the printed DATABASE_URL to src/.env.local
npm run db:migrate
```

`db/bootstrap/local.sql` is idempotent and safe to re-run; `db/bootstrap/README.md` documents the pgAdmin equivalent and how to start over.

### 2.6 Asset storage

Images are static files under `src/public/img/`, served by `next/image`. There is no object storage and no Supabase Storage bucket. Earlier revisions described a `development`/`production` bucket split; it was never built and is not currently needed. Revisit if and when the host CMS (FR-15) lands and photos become user-uploaded.

## 3. Quality Gates

**There is no CI. There is no `.github/` directory.** Earlier revisions of this document described GitHub Actions running Vitest and Playwright; none of that exists, and no test framework is installed. What actually guards the repository is a local git hook.

`.githooks/pre-commit`, enabled automatically by the `prepare` script on `npm install`:

0. Refuses any staged `.env*` file containing a filled-in credential — either a `*PASSWORD|SECRET|TOKEN|CREDENTIAL` variable, or a connection string with an inline password (`scheme://user:pass@host`). The second pattern exists because `DATABASE_URL` carries the database password in plain text and matches none of those keywords.
1. `lint-staged` — ESLint with `--fix` on staged `.ts`/`.tsx`.
2. `check:locales` — the five message files must share an identical key set.
3. `check:palette`, `check:email-logo` — generated artefacts must match their sources.
4. `check:migrations` — migration journal consistency.
5. `typecheck` — project-wide, because type errors span unstaged files.

`npm run verify` runs the same chain manually.

**Hard rule: nothing that needs a database connection may enter `verify` or the hook.** Both must work on a fresh clone with the Postgres service stopped. `check:migrations` qualifies because it reads the journal and snapshots offline; `db:migrate` and `db:push` never belong there.

Adding CI is worthwhile once tests exist. At that point migrate-on-merge-to-`main` with a `DIRECT_DATABASE_URL` secret also becomes reasonable, and §2.3 can be revisited.

## 4. Scheduled Jobs

One cron, declared in `src/vercel.json`:

```json
{ "crons": [{ "path": "/api/cron/anonymise", "schedule": "0 3 * * *" }] }
```

`src/vercel.json`, **not** the repository root — Vercel reads it relative to the configured Root Directory. A file at the repo root is silently ignored and the job simply never runs, with no error reported anywhere. Confirm after the first production deploy that the cron appears in the Vercel dashboard.

The Hobby plan allows two cron jobs on daily schedules only, triggered at some point within the scheduled hour and only on production deployments. A 24-month retention window is entirely insensitive to a few hours of jitter. This uses one of the two slots.

Authentication: Vercel attaches `Authorization: Bearer $CRON_SECRET` automatically when that variable is set on the project. The route compares it in constant time, returns a bare `401` on mismatch, and **returns `503` if `CRON_SECRET` is unset** rather than running unguarded — a fail-open auth check on a data-destroying endpoint is how a database gets wiped by a crawler.

## 5. Environment Variables

| Variable | Required | Notes |
| :--- | :--- | :--- |
| `SMTP_USER` | yes | Gmail account that sends enquiry mail. |
| `SMTP_APP_PASSWORD` | yes | Google App Password; a normal password will not work. |
| `ENQUIRY_TO` | no | Defaults to `SMTP_USER`. |
| `STRUCTURE_NAME` | no | Falls back to the property name in code. |
| `NEXT_PUBLIC_SITE_URL` | no | Unset on Vercel; set once a custom domain exists. |
| `DATABASE_URL` | no | Unset means no persistence — see §1.1. |
| `DIRECT_DATABASE_URL` | Supabase only | Migrations; falls back to `DATABASE_URL`. |
| `IP_HASH_SECRET` | no | Unset means no IP hash is stored at all. |
| `CRON_SECRET` | production | Unset means the retention endpoint refuses to run. |

`src/.env.example` documents all of them with empty values, which the pre-commit credential check permits.

## 6. Observability & Maintenance

- **Logging** — Vercel's platform logs. Application logs deliberately carry no personal data: a failed enquiry insert logs the error, locale and source path, never the enquiry itself, because Vercel's log store has a retention schedule this project does not control and is outside the anonymisation it promises.
- **Retention audit** — the `retention_runs` table records every execution of the anonymisation job. It is also how a silently-stopped cron becomes visible.
- **Backups** — whatever the Supabase plan provides. Note that the database is a *second* copy: the host's mailbox is the system of record for an enquiry, so a database loss is recoverable in a way a mailbox loss would not be.
- **Free-tier pause** — Supabase free projects pause after roughly a week of inactivity. Inserts then fail gracefully through `safeDb()` and the cron returns 500. The daily cron is itself enough traffic to prevent it; `retention_runs` is where that would show up if it stopped.

## 7. White-Label Rebranding Scalability

- **Environment variables** — brand-specific configuration (`STRUCTURE_NAME`, site URL, mail credentials) is already environment-driven.
- **Multi-tenant potential** — the infrastructure can be cloned into a new Vercel/Supabase project pairing for a different property with minimal configuration change. Content lives in `src/messages/*.json` and `src/configuration/*.ts`, both of which are per-property rather than per-guest.
