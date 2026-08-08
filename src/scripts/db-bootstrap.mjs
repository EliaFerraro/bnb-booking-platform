#!/usr/bin/env node
/**
 * Creates the local development database by running db/bootstrap/local.sql
 * through psql as the `postgres` superuser. Run once per machine:
 *
 *     npm run db:bootstrap
 *
 * psql prompts for the superuser password, so stdio is inherited rather than
 * captured. The installer does not put psql on PATH on Windows, hence the
 * lookup below; override it with PSQL=... if it lives somewhere else.
 *
 * The equivalent clicking in pgAdmin is documented in db/bootstrap/README.md,
 * but this script is the path to prefer: it is reproducible on the next machine
 * and it records what was done.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PROPERTY } from "../configuration/property.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SQL_FILE = join(ROOT, "db", "bootstrap", "local.sql");

const SLUG = PROPERTY.brand.slug;
const DB = SLUG;
const ROLE = `${SLUG}_app`;
const PASSWORD = `${SLUG}_local_dev`;

/**
 * The names come from the property slug, so a fork of this site gets its own
 * database rather than colliding with this one on a shared machine. A slug that
 * is not a bare identifier would produce SQL that either fails or, worse, quotes
 * wrongly — so it is rejected here rather than interpolated blindly.
 */
if (!/^[a-z][a-z0-9_]*$/.test(SLUG)) {
  console.error(
    `✖ PROPERTY.brand.slug ("${SLUG}") is not usable as a Postgres identifier.\n` +
      `  It must start with a lowercase letter and contain only [a-z0-9_].`
  );
  process.exit(1);
}

/**
 * psql interpolates neither inside the dollar-quoted DO block nor inside the
 * quoted CREATE DATABASE string, so `-v` variables are not an option: the
 * placeholder is substituted here and the result written somewhere psql can
 * read it with `-f`. It has to be a file rather than stdin because psql prompts
 * for the superuser password, and piping stdin would swallow that prompt.
 */
const sql = readFileSync(SQL_FILE, "utf8").replaceAll("__SLUG__", SLUG);
const RESOLVED_SQL_FILE = join(tmpdir(), `${SLUG}-bootstrap.sql`);
writeFileSync(RESOLVED_SQL_FILE, sql, "utf8");

const CANDIDATES = [
  process.env.PSQL,
  "C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe",
  "C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe",
  "/usr/bin/psql",
  "/usr/local/bin/psql",
].filter(Boolean);

const psql = CANDIDATES.find((candidate) => existsSync(candidate)) ?? "psql";

const result = spawnSync(
  psql,
  [
    "-U",
    "postgres",
    // 127.0.0.1 rather than localhost: on Windows localhost resolves to ::1
    // first, and the default pg_hba.conf IPv6 line is a common source of
    // spurious "password authentication failed".
    "-h",
    "127.0.0.1",
    "-p",
    process.env.PGPORT ?? "5432",
    "-d",
    "postgres",
    "-v",
    "ON_ERROR_STOP=1",
    "-f",
    RESOLVED_SQL_FILE,
  ],
  { stdio: "inherit" }
);

if (result.error?.code === "ENOENT") {
  console.error(
    `✖ psql not found. Looked for:\n    ${CANDIDATES.join("\n    ")}\n` +
      `  Set PSQL to its full path, or create the database with pgAdmin — see db/bootstrap/README.md.`
  );
  process.exit(1);
}

if (result.status !== 0) {
  console.error("\n✖ Bootstrap failed. Nothing was changed if the error came from the first statement.");
  process.exit(result.status ?? 1);
}

const port = process.env.PGPORT ?? "5432";

console.log(
  `\n✓ Database \`${DB}\` and role \`${ROLE}\` are ready.\n` +
    "  Put this in .env.local, then run `npm run db:migrate`:\n\n" +
    `    DATABASE_URL="postgresql://${ROLE}:${PASSWORD}@127.0.0.1:${port}/${DB}"\n`
);
