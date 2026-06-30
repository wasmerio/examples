# VuePress Static Site + Wasmer

This example shows how to build a **VuePress** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `docs/README.md` is the documentation homepage.
* `npm run docs:build` writes the static documentation site into `docs/.vuepress/dist/`.
* Wasmer Edge serves the generated files from `docs/.vuepress/dist/` directly.

## Running Locally

```bash
npm install
npm run docs:build
npx serve docs/.vuepress/dist
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run docs:build` (creates `docs/.vuepress/dist/`).
2. Configure Wasmer Edge to publish the `docs/.vuepress/dist/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
