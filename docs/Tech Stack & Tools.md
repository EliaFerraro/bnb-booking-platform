# Tech stack & Tools

This file lists the frameworks, languages and tools adopted for the **B&B Booking Platform**, together with the reasons they were chosen over competitors. The stack is selected for performance, type safety, and a modular architecture that supports "White-Label" rebranding.

Entries are marked **shipped** (installed and in use) or **planned** (chosen for a module that does not exist yet). That distinction was previously absent, and several rows described tools that had been superseded in code or never installed at all.

## 💻 Core Development Stack — shipped

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router) | Best-in-class SEO, server rendering for fast listings, optimized image handling. |
| **Language** | TypeScript, `strict` | Strict typing to prevent runtime errors in complex booking logic. Also `noUnusedLocals`, `verbatimModuleSyntax`. |
| **UI** | React 19 | Server Components and Server Actions; the enquiry form is a Server Action with real progressive enhancement. |
| **Styling** | Tailwind CSS v4 | Utility-first, with the brand palette generated into `style/palette.css` and drift-checked in CI. |
| **Components** | shadcn / Radix UI | Unstyled, accessible primitives (dialog, dropdown, button) styled to the brand rather than fought against. |
| **i18n** | next-intl | Path-based `/[locale]` routing across five locales; messages in `src/messages/*.json`, key parity enforced by `check:locales`. |
| **Validation** | Zod 4 | One schema shared by the client's live validation and the server action, so both surface identical messages. |
| **State** | `useActionState` + React context | No server-state library: the site fetches nothing client-side. A consent context is the only global state. |

**On state management.** Earlier revisions named TanStack Query. It is not installed and is not needed while there is no client-side data fetching. It becomes relevant with the availability search engine (FR-03), not before.

## 🗄️ Backend & Data — shipped

* **Database:** PostgreSQL — relational integrity and atomic transactions. Local development runs PostgreSQL 17; production runs Supabase.
* **ORM & migrations:** Drizzle ORM + Drizzle Kit — a TypeScript schema as the single source of truth, generating versioned SQL migrations that are committed and reviewed. Chosen over Prisma for a much smaller serverless footprint and no code-generation step, and over hand-written SQL for compile-time safety against the schema.
* **Driver:** `postgres` (postgres.js) — chosen over `node-postgres` because Supabase's transaction pooler needs prepared statements disabled, which postgres.js exposes as a single documented option; because TLS is decided by `sslmode` in the connection string, so the same code serves local and production unchanged; and because it is pure JavaScript, with no native build step.
* **Email:** Nodemailer over Gmail SMTP — the pragmatic choice while there is no custom domain. Isolated to `src/lib/email/transport.ts` by design.
* **Data validation:** Zod — schema validation for end-to-end type safety at runtime.

**On email.** Earlier revisions named Resend. The code has always used Nodemailer with a Gmail App Password, because Resend requires a verified domain and none exists yet. Resend remains the intended destination; `transport.ts` is the only file that would change.

**On Supabase.** It is used as managed PostgreSQL, nothing more. Supabase Auth and Supabase Storage were previously listed and are **not** used: there is no authentication anywhere in the product, and images are static files under `src/public/img/`.

## 🔄 Integrations & Services

* **Maps — shipped:** Google Maps embed, gated behind explicit consent. Earlier revisions named Leaflet; the code has always used a Google embed. This is precisely the third party that made a consent banner necessary, and the frame is not rendered at all until the visitor allows it.
* **iCal Synchronization — planned:** `node-ical`, for syncing external calendar feeds from OTAs (Airbnb, Booking.com). Not installed.
* **Payments — planned:** Stripe API, for FR-05. Not installed.
* **Authentication — planned:** OAuth 2.0 for FR-07. Not installed, and deliberately not required to send an enquiry.
* **Analytics — shipped:** first-party and cookieless, stored in this project's own database. No library and no vendor: a beacon in the browser, one route handler, three tables. Visitors are distinguished by a hash salted with a random secret destroyed after two days, and nothing is written to the device, so it needs no consent and no banner category. Explicitly *not* Google Analytics: it would require consent, and the Italian Garante has ruled against its use over transfers to the United States.

## 🛠️ Dev Tools & DevOps

* **Version Control — shipped:** Git & GitHub.
* **Deployment — shipped:** Vercel. Earlier revisions listed "Netlify or SelfHosting or Cloudflare (still TBD)"; the code reads `VERCEL_*` environment variables and ships a `vercel.json` cron, so the decision is long since made.
* **Quality gates — shipped:** ESLint, `tsc --noEmit`, and four generated-artefact/consistency checks, run by `npm run verify` and by a `.githooks/pre-commit` hook. **There is no CI**: no `.github/` directory exists.
* **Testing — planned:** Vitest, Playwright and axe. **Nothing is installed and no test exists.** `Testing Strategy.md` describes an intended approach, not a current one. The pure modules (`lib/enquiry/schema.ts`, `lib/consent/cookie.ts`, `lib/privacy/ip.ts`) are the natural first targets.

## 🎨 Design & Prototyping

* **Figma** — UI/UX wireframing and design-system tokens (colours, typography), generated into `style/palette.css`.
