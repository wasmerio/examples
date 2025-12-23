# Remix Static Site + Wasmer

This example shows how to export a **Remix** project as static HTML and serve it on **Wasmer Edge**.

## Demo

https://remix-wasmer-starter.wasmer.app/

## How it Works

The project uses Remix’s static generation capabilities:

* `app/routes/_index.tsx` renders the home page and exports `getStaticPaths()` so Remix knows to generate `/` at build time.
* `remix.config.js` points `serverBuildTarget` to `"wasmer"` and sets up the output directory Wasmer will serve.
* `npm run build` emits static assets in `build/client` which Wasmer Edge can treat as a static site.

Add additional routes or loaders as needed—just ensure they can be prerendered when targeting static output.

## Running Locally

```bash
npm install
npm run dev
```

Visit `http://127.0.0.1:3000/` for live development. To test the static export that Wasmer serves:

```bash
npm run build
npm run preview
```

## Deploying to Wasmer (Overview)

1. Build the project: `npm run build` (or `pnpm build`, etc.).
2. Point Wasmer Edge at the generated static assets (e.g., `build/client`).
3. Deploy and open `https://<your-subdomain>.wasmer.app/`.
