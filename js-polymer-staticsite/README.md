# Polymer Static Site + Wasmer

This example shows how to build a **Polymer** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `polymer.json` describes the Polymer project layout.
* `scripts/build-static.mjs` emits the static output used by this compact example.
* Wasmer Edge serves the generated files from `build/default/` directly.

## Running Locally

```bash
npm install
npm run build
npx serve build/default
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run build` (creates `build/default/`).
2. Configure Wasmer Edge to publish the `build/default/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
