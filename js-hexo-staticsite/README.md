# Hexo Static Site + Wasmer

This example shows how to build a **Hexo** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `_config.yml` configures the Hexo site and output directory.
* `source/` contains the Markdown content for the generated site.
* Wasmer Edge serves the generated files from `public/` directly.

## Running Locally

```bash
npm install
npm run generate
npx serve public
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run generate` (creates `public/`).
2. Configure Wasmer Edge to publish the `public/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
