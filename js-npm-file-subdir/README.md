# npm File Dependency Subdir + Wasmer

This example shows how to run an **Astro** app from a subdirectory while consuming a local npm `file:` dependency.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `apps/dashboard` is the deployable Astro app.
* `packages/ui` is imported through an npm `file:` dependency from the app package.
* Wasmer Edge runs the Node.js process and forwards HTTP traffic to the configured port.

## Running Locally

Install from the repository root, then build and start the dashboard app:

```bash
npm --prefix apps/dashboard install
npm --prefix apps/dashboard run build
npm --prefix apps/dashboard start
```

Open `http://127.0.0.1:4321/` (or the port printed by Astro) to view the app.

## Deploying to Wasmer (Overview)

1. Install dependencies and confirm the app starts locally.
2. Deploy from this example directory with `wasmer deploy`.
3. Visit `https://<your-subdomain>.wasmer.app/` once the deployment is live.
