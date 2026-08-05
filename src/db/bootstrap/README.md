# Local database bootstrap

One-time setup per machine. Creates the `ilrespirodelborgo` database and the
`ilrespirodelborgo_app` role that owns it; the tables themselves come from the
committed migrations.

Requires PostgreSQL installed locally (developed against 17). Production uses
Supabase and never runs any of this.

## The path to use

```powershell
cd src
npm run db:bootstrap    # prompts for the `postgres` superuser password
```

Then add the connection string to `src/.env.local` and apply the migrations:

```
DATABASE_URL="postgresql://ilrespirodelborgo_app:ilrespirodelborgo_local_dev@127.0.0.1:5432/ilrespirodelborgo"
```

```powershell
npm run db:migrate
npm run db:studio       # optional — browse the tables
```

If `psql` is not where the script looks, point it there:

```powershell
$env:PSQL = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
npm run db:bootstrap
```

## The pgAdmin alternative

Equivalent, but nobody remembers in six months what they clicked — prefer the
script. If you do use it:

1. **Login/Group Roles → Create → Login/Group Role**
   - General → Name: `ilrespirodelborgo_app`
   - Definition → Password: `ilrespirodelborgo_local_dev`
   - Privileges → Can login: yes
2. **Databases → Create → Database**
   - Database: `ilrespirodelborgo`
   - Owner: `ilrespirodelborgo_app`
   - Encoding: `UTF8`

The owner matters. Since Postgres 15 the `public` schema no longer grants
`CREATE` to `PUBLIC`, so a role that merely has access to the database fails on
the first `CREATE TABLE` with *permission denied for schema public*. Owning the
database makes the role a member of `pg_database_owner` and avoids it.

## Starting over

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h 127.0.0.1 -c "DROP DATABASE IF EXISTS ilrespirodelborgo"
npm run db:bootstrap
npm run db:migrate
```

Local data only — there is nothing here worth keeping.
