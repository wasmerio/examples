# Dashy on Wasmer Edge

[Dashy](https://dashy.to/) — a self-hosted personal dashboard — running on
[Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

Upstream sources are **not** committed here. `setup.mjs` downloads the pinned
Dashy release (4.3.11) into the gitignored `app/` directory, applies the
patches in `patches/`, and copies in the files from `overlay/`. The app is
then **built with Node.js**, and only the resulting `app/edge-build/`
artifact (esbuild-bundled Express server + built frontend) runs on EdgeJS.

## Setup & build

```bash
node setup.mjs
cd app
pnpm install
pnpm build      # vite build + assembles the EdgeJS artifact in edge-build/
cd ..
```

## Run locally with Wasmer

```bash
wasmer run . --net --env PORT=4000
```

Then open [http://localhost:4000](http://localhost:4000).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, then:

```bash
wasmer deploy
```

## Configuration & persistence

Dashy needs no database. The dashboard is configured through
`app/user-data/conf.yml`, which is baked into the deployed package.

> **Note:** on Wasmer Edge the package filesystem is not persistent, so
> configuration changes saved through Dashy's web UI will not survive an
> instance restart. Treat `conf.yml` as the source of truth: edit it locally,
> rebuild, and redeploy.

## Patches & overlay

- `patches/0001-bundle-server-for-edgejs.patch` — extends the `build` script
  to also assemble the EdgeJS artifact, and adds `esbuild` (used by the
  bundling step) and `workbox-window` (yarn hoists it transitively; pnpm's
  strict layout does not) to `devDependencies`.
- `overlay/scripts/bundle-edge.cjs` — bundles the Express server with esbuild
  so `node_modules` (~275 MB) does not need to be shipped, and assembles
  `edge-build/` (bundled server + `dist/` + `public/` + `user-data/`).
- `overlay/pnpm-workspace.yaml`, `overlay/pnpm-lock.yaml` — pnpm build-script
  allowlist and the lockfile matching the patched manifest.
