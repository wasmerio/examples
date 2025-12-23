# Gatsby Static Site + Wasmer

This example shows how to build and deploy a **Gatsby** static site on **Wasmer Edge**.

## Demo

https://wasmer-edge-gatsby-sample.wasmer.app/

## How it Works

Gatsby compiles React pages to static HTML during `gatsby build`:

* `gatsby-config.js` configures site metadata and plugins.
* Components under `src/pages/` become routes (e.g., `src/pages/index.tsx` renders `/`).
* `gatsby build` outputs assets under `public/`, which Wasmer Edge serves directly.

Add more pages or data sources and rebuild to update the generated site.

## Running Locally

```bash
npm install
npm run dev
```

View the dev server at `http://127.0.0.1:8000/`. When you’re ready to test the production build:

```bash
npm run build
npm run serve
```

## Deploying to Wasmer (Overview)

1. Build the static site with `npm run build` (or your preferred package manager).
2. Configure Wasmer Edge to publish the `public/` directory.
3. Deploy and browse `https://<your-subdomain>.wasmer.app/`.
