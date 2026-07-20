# Etherpad on Wasmer Edge

[Etherpad](https://etherpad.org/) 3.3 — a real-time collaborative editor —
running on [Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

Upstream sources are **not** committed here. `setup.mjs` downloads a pinned
Etherpad snapshot (3.3.2 + upstream fixes) into the gitignored `app/`
directory, applies the patches in `patches/`, and copies in the files from
`overlay/`. The app is then **built with Node.js** and only final artifacts
run on EdgeJS:

- `build-backend.mjs` transpiles the TypeScript backend to plain CommonJS in
  place (upstream runs `.ts` via `tsx` at runtime, which EdgeJS does not do);
- `build-frontend.mjs` pre-bundles the client entrypoints (upstream bundles
  them lazily with esbuild inside the running server);
- `build-installed-plugins.mjs` pre-generates `var/installed_plugins.json`
  (normally written on first boot; when missing, Etherpad tries to spawn
  `pnpm` at runtime, which is not available on EdgeJS).

## ⚠️ Database required (for real use)

Out of the box this template uses Etherpad's **DirtyDB** file database
(`app/var/dirty.db`), which needs no external server — but on Wasmer Edge the
package filesystem is **not persistent**, so pads will not survive an
instance restart. For a real deployment, point Etherpad at a
PostgreSQL/MySQL database by editing `dbType`/`dbSettings` in
`overlay/settings.json` (see `app/settings.json.template`), re-run the
overlay copy (or edit `app/settings.json` directly), and redeploy.

## Setup & build

```bash
node setup.mjs
cd app
CI=true pnpm install --no-frozen-lockfile   # full install (the build needs devDependencies)
pnpm build
```

Then prune `node_modules` to what the server needs at runtime (it is shipped
inside the Wasmer package):

```bash
CI=true pnpm install --prod --no-frozen-lockfile
node prune-edge-deps.mjs
cd ..
```

## Run locally with Wasmer

```bash
wasmer run . --net --env PORT=9001
```

Then open [http://localhost:9001](http://localhost:9001).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, then:

```bash
wasmer deploy
```

## Patches & overlay

- `patches/0001-serve-prebuilt-frontend-bundles.patch` — teaches
  `specialpages.ts` to serve the client bundles from the manifest that
  `build-frontend.mjs` emits instead of invoking esbuild inside the running
  server (it still falls back to upstream's on-startup esbuild path when no
  manifest is present).
- `patches/0002-edgejs-build-script.patch` — adds the ahead-of-time `build`
  script and a plain-`node` `start` script.
- `overlay/pnpm-workspace.yaml` — `nodeLinker: hoisted` (real-file
  `node_modules`, required for shipping), build-script allowlist, and
  overrides that stub the ueberdb2 database drivers this deployment does not
  use (Elasticsearch, MSSQL, MongoDB, Redis, CouchDB, RethinkDB, Cassandra —
  remove the relevant override and reinstall if you switch `dbType` to one).
- `overlay/settings.json` — server config (bind `0.0.0.0`, `${PORT}`,
  DirtyDB). Upstream gitignores `settings.json`, so it must be provided.
- `overlay/prune-edge-deps.mjs` — removes build-time-only leftovers
  (typescript) after the production install.
