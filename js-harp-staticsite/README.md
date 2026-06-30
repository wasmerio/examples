# Harp Static Site + Wasmer

This example shows how to build a **Harp** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `src/index.ejs` contains the Harp page template.
* `npm run build` compiles `src/` into `www/`.
* Wasmer Edge serves the generated files from `www/` directly.

## Running Locally

```bash
npm install
npm run build
npx serve www
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run build` (creates `www/`).
2. Configure Wasmer Edge to publish the `www/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
