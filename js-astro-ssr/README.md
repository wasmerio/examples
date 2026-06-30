# Astro SSR + Wasmer

This example shows how to run a server-rendered **Astro** app on **Wasmer Edge**.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `astro.config.mjs` enables Astro server output with the Node adapter.
* `npm run build` writes the standalone server bundle into `dist/`.
* Wasmer Edge runs the Node.js process and forwards HTTP traffic to the configured port.

## Running Locally

```bash
npm install
npm run build
npm start
```

Open `http://127.0.0.1:4321/` (or the port printed by the framework) to view the running server.

## Deploying to Wasmer (Overview)

1. Install dependencies and confirm the app starts locally.
2. Deploy from this example directory with `wasmer deploy`.
3. Visit `https://<your-subdomain>.wasmer.app/` once the deployment is live.
