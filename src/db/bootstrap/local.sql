-- Creates the local development database and its owning role.
--
-- Run once per machine as the `postgres` superuser against the `postgres`
-- database — `npm run db:bootstrap` does exactly that. Idempotent: re-running
-- it on an already-provisioned machine changes nothing.
--
-- This only creates the database. The tables come from the committed migrations
-- afterwards, via `npm run db:migrate`.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ilrespirodelborgo_app') THEN
    CREATE ROLE ilrespirodelborgo_app LOGIN PASSWORD 'ilrespirodelborgo_local_dev';
  END IF;
END
$$;

-- CREATE DATABASE cannot run inside a transaction or a DO block, so the
-- statement is produced as text and executed by psql's \gexec only when the
-- database is actually missing.
SELECT 'CREATE DATABASE ilrespirodelborgo OWNER ilrespirodelborgo_app ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ilrespirodelborgo')
\gexec

-- `OWNER ilrespirodelborgo_app` is not incidental. Since Postgres 15 the
-- `public` schema no longer grants CREATE to PUBLIC, so a role that merely has
-- access to the database gets "permission denied for schema public" on the very
-- first CREATE TABLE of migration 0000. Owning the database makes the role a
-- member of pg_database_owner, and the problem never arises.
--
-- Repeated here so a database that already existed under another owner is
-- corrected rather than left broken.
ALTER DATABASE ilrespirodelborgo OWNER TO ilrespirodelborgo_app;
