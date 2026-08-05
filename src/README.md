# Il Respiro del Borgo — web app

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, next-intl, Drizzle + PostgreSQL.

**This directory is the npm project root.** The git root is one level up and holds only `docs/`, `.githooks/` and the top-level README. Every command below runs from here.

## Setup

```powershell
npm install
```

`npm install` also points git at `.githooks/`, which enables the pre-commit checks.

Copy the environment template and fill it in:

```powershell
Copy-Item .env.example .env.local
```

`SMTP_USER` and `SMTP_APP_PASSWORD` are the only variables the site genuinely needs — the second is a Google **App Password**, not the account password. Everything else is optional; `.env.example` documents each one.

### Database (optional)

Leaving `DATABASE_URL` unset is a supported state: the site runs, the enquiry form works and both emails are sent, the enquiry is simply not stored. To enable persistence locally you need PostgreSQL 17 installed, then:

```powershell
npm run db:bootstrap    # creates role + database; prompts for the postgres superuser password
# paste the DATABASE_URL it prints into .env.local
npm run db:migrate
```

If `psql` is not on `PATH`, set `$env:PSQL` to its full path first. `db/bootstrap/README.md` covers the pgAdmin equivalent and how to start over.

```powershell
npm run dev
```

## Commands

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Development server |
| `npm run build` / `start` | Production build and serve |
| `npm run verify` | Everything the pre-commit hook runs, in one go |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit`, project-wide |
| `npm run check:locales` | The five message files must share an identical key set |
| `npm run db:generate` | Turn a `db/schema.ts` edit into a migration file — **commit it** |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Browse the data |
| `npm run db:push` | Push `schema.ts` straight to the database with no migration file. **Local scratch work only** — it is how you end up with a database whose shape no file describes |
| `npm run check:migrations` | Offline migration-journal consistency |
| `npm run gen:palette` / `gen:email-logo` / `gen:og-image` | Regenerate a committed artefact after changing its source |

The `gen:*` scripts have `--check` counterparts (`check:palette`, etc.) that fail if a generated file has drifted from its source. Those run in the hook, which is why editing `style/palette.mjs` or `public/img/brand/logo.png` without regenerating will block a commit.

## Layout

```
app/[locale]/          pages; _components/ holds page-composition pieces
app/api/               route handlers (consent log, retention cron)
configuration/         non-secret constants: contact, language, site, privacy
db/                    schema.ts, client.ts, safe.ts, migrations/, bootstrap/
lib/                   domain logic — enquiry/, email/, consent/, privacy/, retention/
messages/              it.json is the reference locale; the other four must match its keys
scripts/               node scripts behind the gen:*/check:* commands
ui/components/         custom/ = shared chrome, shadcn/ = primitives, form/ = inputs
```

Path alias: `@/*` → this directory.

## Things worth knowing before changing something

- **Adding a page** means four edits, not one: the route under `app/[locale]/`, the `MetaPage` union *and* the `PATHS` record in `lib/metadata.ts` (these drive canonical and hreflang), and the `meta.*` / `pages.*` keys in **all five** message files.
- **Message keys must match across all five locales.** `check:locales` compares key sets and blocks the commit otherwise. Avoid modelling prose as arrays — the checker descends into them, so a translator splitting one sentence changes the count and breaks the build.
- **The middleware is `proxy.ts`**, not `middleware.ts`. Next 16 renamed it. It resolves the locale and redirects unprefixed paths.
- **The database is never on the critical path.** Everything goes through `safeDb()`, which returns `null` instead of throwing. If you add a query, decide explicitly what `null` means for the caller — for the rate limit, for instance, it has to mean *allow*.
- **Never log an enquiry's contents.** Diagnostics carry the error, the locale and the source path only; the rest would land in the hosting provider's log store, which is undisclosed processing outside the retention this project promises.
- **Changing what is collected, why, where it goes, or for how long** is also a change to the privacy pages in all five locales and to `docs/Privacy & Data Processing.md`. If third parties or purposes change, bump `CONSENT_POLICY_VERSION` in `configuration/privacy.ts` so stored consent is re-asked.
- **No third-party resource may load before consent** — and the gate must be on the element, not its visibility. A hidden `<iframe>` still fetches. `app/[locale]/_components/Map.tsx` is the worked example.
- **No tests exist.** `npm run verify` is the whole safety net. The pure modules (`lib/enquiry/schema.ts`, `lib/consent/cookie.ts`, `lib/privacy/ip.ts`) are the obvious place to start if you add a runner.

## Deploying

Vercel, with the project's **Root Directory set to `src`** — `vercel.json` and its retention cron are read relative to it, and a misplaced file means the job silently never runs. Migrations are applied manually against `DIRECT_DATABASE_URL` before promoting a deploy, never as a build step. Full detail in [`docs/Deployment Strategy.md`](../docs/Deployment%20Strategy.md).
