# DuckDB CSV Explorer

Run `SELECT * FROM campaigns;` in the SQL shell. Use `.files add` to load a local CSV. The browser session holds the database.

## Run locally

Run `npm ci`, then `npm run dev`.

## Deploy to Wasmer

Run `anybuild . --wasmer-deploy` from this directory. The catalog source points to this directory so a generated project contains the app and its own `Anybuild` file at the repository root.

Check a deployed starter with `node smoke.mjs https://YOUR-APP.wasmer.app`.
