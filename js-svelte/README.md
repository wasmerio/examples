# Svelte + Vite Static Site + Wasmer

This example shows how to build a **Svelte** app with **Vite** and deploy the static output to **Wasmer Edge**.

## Demo

https://svelte-starter-template.wasmer.app/

## How it Works

* `src/routes/+page.svelte` (or the starter components) define the UI.
* Vite handles bundling; `npm run build` emits a production-ready site into `build/`.
* Wasmer Edge serves the static files directly—no server-side rendering required.

## Running Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/` to see the live reloading dev server. When you’re ready for a production preview:

```bash
npm run build
npm run preview
```

## Deploying to Wasmer (Overview)

1. Build the project: `npm run build` (outputs to `build/`).
2. Tell Wasmer Edge to publish the `build/` directory.
3. Deploy and visit `https://<your-subdomain>.wasmer.app/`.
