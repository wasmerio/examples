# pnpm Workspace Subdir + Wasmer

This example shows how to run an **Astro** app from a pnpm workspace subdirectory with a shared local package.

## Demo

`https://<your-subdomain>.wasmer.app/` (deploy to get a live URL)

## How it Works

* `pnpm-workspace.yaml` links the dashboard app and shared UI package.
* `apps/dashboard` imports `packages/ui` through a workspace dependency.
* Wasmer Edge runs the Node.js process and forwards HTTP traffic to the configured port.

## Running Locally

Install from the repository root, then build and start the dashboard app:

```bash
pnpm install
pnpm --filter @wasmer-example/dashboard run build
pnpm --filter @wasmer-example/dashboard start
```

Open `http://127.0.0.1:4321/` (or the port printed by Astro) to view the app.

## Deploying to Wasmer (Overview)

1. Install dependencies and confirm the app starts locally.
2. Deploy from this example directory with `wasmer deploy`.
3. Visit `https://<your-subdomain>.wasmer.app/` once the deployment is live.
