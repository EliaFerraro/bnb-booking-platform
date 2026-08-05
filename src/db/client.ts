import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseUrl } from "@/lib/env";
import * as schema from "./schema";

/**
 * The database connection, created on first use and never at module load.
 *
 * Nothing here may throw during module evaluation. `DATABASE_URL` being unset
 * is a supported state — the site runs, enquiries are still emailed, they are
 * simply not stored — and an eager `postgres(process.env.DATABASE_URL!)` would
 * break `next build` on any clone without a filled-in .env.local. Callers go
 * through `safeDb()` rather than touching `getDb()` directly.
 */

type Sql = ReturnType<typeof postgres>;
type Db = ReturnType<typeof drizzle<typeof schema>>;

// Next's dev server re-evaluates modules on every edit. A plain module-level
// const would open a fresh pool per save until Postgres refuses connections, so
// the handle is parked on globalThis, which survives hot reloads.
const globalForDb = globalThis as unknown as {
  __borgoSql?: Sql;
  __borgoDb?: Db;
};

function createClient(url: string): Sql {
  return postgres(url, {
    // Supabase's transaction-mode pooler hands a connection to a different
    // client between statements, so a named prepared statement created on one
    // request may not exist on the next. Harmless against a plain local server.
    prepare: false,
    // A serverless instance handles one request at a time, and concurrency
    // comes from more instances rather than a deeper pool — so `max` multiplies
    // by the instance count at the pooler. One is the right number in
    // production; locally a few connections make `db:studio` and the dev server
    // coexist comfortably.
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    // TLS is decided by `sslmode` in the connection string: absent locally,
    // `require` on Supabase. That is what lets the same code serve both.
  });
}

export function isDbConfigured(): boolean {
  return databaseUrl() !== undefined;
}

export function getDb(): Db {
  if (!globalForDb.__borgoDb) {
    const url = databaseUrl();
    if (!url) {
      throw new Error("DATABASE_URL is not set — call isDbConfigured() first.");
    }
    globalForDb.__borgoSql = createClient(url);
    globalForDb.__borgoDb = drizzle(globalForDb.__borgoSql, { schema });
  }
  return globalForDb.__borgoDb;
}
