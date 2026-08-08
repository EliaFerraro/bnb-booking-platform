-- Creates the local development database and its owning role.
--
-- Run once per machine as the `postgres` superuser against the `postgres`
-- database — `npm run db:bootstrap` does exactly that. Idempotent: re-running
-- it on an already-provisioned machine changes nothing.
--
-- This only creates the database. The tables come from the committed migrations
-- afterwards, via `npm run db:migrate`.
--
-- `__SLUG__` is not valid SQL and this file is not meant to be run directly:
-- `scripts/db-bootstrap.mjs` replaces every occurrence with the property slug
-- from `configuration/property.mjs` before handing the result to psql. psql's
-- own `-v` variables cannot do this, because it does not interpolate inside the
-- dollar-quoted DO block or the quoted CREATE DATABASE string below.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '__SLUG___app') THEN
    CREATE ROLE __SLUG___app LOGIN PASSWORD '__SLUG___local_dev';
  END IF;
END
$$;

-- CREATE DATABASE cannot run inside a transaction or a DO block, so the
-- statement is produced as text and executed by psql's \gexec only when the
-- database is actually missing.
SELECT 'CREATE DATABASE __SLUG__ OWNER __SLUG___app ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '__SLUG__')
\gexec

-- `OWNER __SLUG___app` is not incidental. Since Postgres 15 the `public` schema
-- no longer grants CREATE to PUBLIC, so a role that merely has access to the
-- database gets "permission denied for schema public" on the very first
-- CREATE TABLE of migration 0000. Owning the database makes the role a member
-- of pg_database_owner, and the problem never arises.
--
-- Repeated here so a database that already existed under another owner is
-- corrected rather than left broken.
ALTER DATABASE __SLUG__ OWNER TO __SLUG___app;
