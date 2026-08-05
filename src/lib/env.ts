/**
 * Server-side environment access.
 *
 * Every accessor reads `process.env` at call time rather than at module
 * evaluation. A top-level `envSchema.parse(process.env)` would throw while the
 * module is being evaluated, which takes down `next build` on any clone without
 * a filled-in `.env.local` — and it would misrepresent the design, because
 * several of these variables are legitimately optional: without DATABASE_URL
 * the site still runs and still emails enquiries, it simply stores nothing.
 *
 * Nothing here may be imported from a client component: every variable below is
 * secret and resolves to `undefined` in the browser.
 */

/** Throws on a missing value. For variables the feature genuinely cannot run without. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Empty strings count as absent, so a placeholder line in .env.local reads as unset. */
export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : undefined;
}

/**
 * Runtime connection. On Supabase this is the *transaction* pooler (port 6543);
 * locally it is the plain server. Undefined is a supported state — see db/safe.ts.
 */
export function databaseUrl(): string | undefined {
  return optionalEnv("DATABASE_URL");
}

/**
 * Migrations only. DDL and the migration bookkeeping cannot run through a
 * transaction pooler that may hand the connection to someone else between
 * statements, so Supabase needs the session-mode URL (port 5432) here. Locally
 * there is only one server, so DATABASE_URL is the answer to both questions.
 */
export function migrationUrl(): string | undefined {
  return optionalEnv("DIRECT_DATABASE_URL") ?? databaseUrl();
}

/**
 * Salts the visitor-IP hash. Absent means no IP hash is stored at all, which is
 * a safe degradation: the DB-backed rate limit simply stops matching.
 */
export function ipHashSecret(): string | undefined {
  return optionalEnv("IP_HASH_SECRET");
}

/** Bearer token Vercel attaches to scheduled invocations of the retention job. */
export function cronSecret(): string | undefined {
  return optionalEnv("CRON_SECRET");
}
