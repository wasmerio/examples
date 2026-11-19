# BentoPDF

Open Merge PDF, select two local PDF files, and download the combined document. Processing runs in the browser. The build uses the upstream Simple release and publishes its license and matching source link.

## Run locally

Run `npm run build` (requires `curl` and `unzip`), then serve `dist/` with the Wasmer static web server using the included Anybuild recipe.

## Deploy to Wasmer

Run `anybuild . --wasmer-deploy` from this directory. The catalog source points to this directory so a generated project contains the app and its own `Anybuild` file at the repository root.

Check a deployed starter with `node smoke.mjs https://YOUR-APP.wasmer.app`.
