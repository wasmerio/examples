# Eleventy Static Site + Wasmer

This example shows how to build a **Eleventy** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `.eleventy.js` reads content from `src/` and writes output to `_site/`.
* `src/index.md` is the source page for the generated site.
* Wasmer Edge serves the generated files from `_site/` directly.

## Running Locally

```bash
npm install
npm run build
npx serve _site
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run build` (creates `_site/`).
2. Configure Wasmer Edge to publish the `_site/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
