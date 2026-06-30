# VitePress Static Site + Wasmer

This example shows how to build a **VitePress** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `docs/index.md` is the documentation homepage.
* `npm run docs:build` writes the static documentation site into `docs/.vitepress/dist/`.
* Wasmer Edge serves the generated files from `docs/.vitepress/dist/` directly.

## Running Locally

```bash
npm install
npm run docs:build
npx serve docs/.vitepress/dist
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run docs:build` (creates `docs/.vitepress/dist/`).
2. Configure Wasmer Edge to publish the `docs/.vitepress/dist/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
