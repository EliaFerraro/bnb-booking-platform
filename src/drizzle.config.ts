import type { Config } from "drizzle-kit";

/**
 * Read by every `npm run db:*` script. The connection string comes from
 * `.env.local`, which the scripts load with node's --env-file-if-exists so that
 * no dotenv dependency is needed.
 *
 * DIRECT_DATABASE_URL takes precedence because migrations must not run through
 * a transaction pooler: DDL and the __drizzle_migrations bookkeeping span
 * multiple statements and cannot survive a connection being handed to another
 * client in between. On Supabase that means the session-mode URL (port 5432)
 * here and the transaction-mode one (port 6543) at runtime. Locally there is a
 * single server, so DATABASE_URL answers both and only one variable is set.
 */
export default {
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "",
  },
  strict: true,
  verbose: true,
} satisfies Config;
