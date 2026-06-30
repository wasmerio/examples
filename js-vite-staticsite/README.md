# Vite Static Site + Wasmer

This example shows how to build a **Vite** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `package.json` includes Vite and Vue dependencies.
* `scripts/build-static.mjs` emits the static output used by this compact example.
* Wasmer Edge serves the generated files from `dist/` directly.

## Running Locally

```bash
npm install
npm run build
npx serve dist
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run build` (creates `dist/`).
2. Configure Wasmer Edge to publish the `dist/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
