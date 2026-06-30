# Nuxt Static Site + Wasmer

This example shows how to build a **Nuxt** static site and host the generated output on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `nuxt.config.ts` enables compatibility settings for the Nuxt app.
* `npm run build` runs `nuxt generate` and writes static assets into `.output/public/`.
* Wasmer Edge serves the generated files from `.output/public/` directly.

## Running Locally

```bash
npm install
npm run build
npx serve .output/public
```

Open `http://127.0.0.1:3000/` to preview the generated static site.

## Deploying to Wasmer (Overview)

1. Build the site: `npm run build` (creates `.output/public/`).
2. Configure Wasmer Edge to publish the `.output/public/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
