# PostgreSQL on Wasmer

This starter provisions a managed PostgreSQL database with Wasmer's existing
app database capability. The app's JSON endpoint reports whether Wasmer supplied
the five database settings. It does not query the database or print credentials.

## Deploy

Open the PostgreSQL template in the Wasmer catalog and follow the Deploy wizard.
For a GitHub import of the examples repository, use `js-postgresql` as the root
directory. To deploy the same source from your terminal, run
`anybuild . --wasmer-deploy` from this directory.

## Connect

Open **Databases** in your app dashboard for connection details and use a
PostgreSQL client with TLS enabled (`sslmode=require` as documented for
Wasmer's private certificate authority). Wasmer also supplies `DB_HOST`, `DB_PORT`,
`DB_NAME`, `DB_USERNAME` and `DB_PASSWORD` privately to app workloads. See the
[Wasmer Databases guide](https://docs.wasmer.io/edge/learn/databases/).

## Verify

Run `npm test` locally to exercise the status endpoint. On Wasmer, confirm
PostgreSQL appears in Databases and run `SELECT 1;` with your database client.
