# Univer Sheets

Edit the sample campaign budget, inspect the formula total, and reload to verify browser-local saving.

## Run locally

Run `npm ci`, then `npm run dev`.

## Deploy to Wasmer

Run `anybuild . --wasmer-deploy` from this directory. The catalog source points to this directory so a generated project contains the app and its own `Anybuild` file at the repository root.

Check a deployed starter with `node smoke.mjs https://YOUR-APP.wasmer.app`.
