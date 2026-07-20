# HedgeDoc on Wasmer Edge

[HedgeDoc](https://hedgedoc.org/) 1.11 — a collaborative markdown editor —
running on [Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

Upstream sources are **not** committed here. `setup.mjs` downloads the
official HedgeDoc 1.11.0 **release tarball** (which ships the frontend
prebuilt under `public/build/`) into the gitignored `app/` directory, applies
the patch in `patches/`, and copies in the files from `overlay/`. There is no
build step; the server (`app.js`) runs directly on EdgeJS with its production
`node_modules` shipped inside the package.

## ⚠️ Database required

HedgeDoc needs a **PostgreSQL** database. Set `CMD_DB_URL` (see `app.yaml`)
to a database reachable from Wasmer Edge. HedgeDoc applies its migrations
automatically on first startup, so no manual seeding is needed.

Also set `CMD_SESSION_SECRET` to a long random string.

## Setup & install

```bash
node setup.mjs
cd app
CI=true pnpm install --prod
cd ..
```

`overlay/pnpm-workspace.yaml` pins `nodeLinker: hoisted` so `node_modules`
contains real files (it is shipped inside the Wasmer package). Native
optional dependencies like `sqlite3` are intentionally not built — native
addons are not supported on EdgeJS, and HedgeDoc does not need them when
using Postgres.

## Run locally with Wasmer

```bash
wasmer run . --net \
  --env CMD_PORT=3000 \
  --env CMD_DB_URL=postgres://user:password@127.0.0.1:5432/hedgedoc \
  --env CMD_SESSION_SECRET=dev-secret \
  --env CMD_ALLOW_ANONYMOUS=true
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, fill in the `env` values in `app.yaml`, then:

```bash
wasmer deploy
```

## Patches & overlay

- `patches/0001-pnpm-conversion.patch` — the release tarball is set up for
  yarn 4; this drops the `packageManager` pin and yarn-only scripts, converts
  `#commit=<sha>` git pins to pnpm-compatible `#<sha>`, removes the
  browser-only `Idle.Js` git dependency (already bundled into the prebuilt
  frontend; its package name is not installable with pnpm), and replaces the
  yarn `patch:` protocol reference for passport with a plain version.
- `overlay/pnpm-workspace.yaml` — hoisted linker, build-script allowlist,
  pnpm `patchedDependencies` for passport (same patch content as upstream's
  yarn patch), and overrides that stub the S3/Azure/MinIO image-upload SDKs
  (>100 MB, only loaded when the corresponding `CMD_IMAGE_UPLOAD_TYPE` is
  configured — remove the override and reinstall if you need one).
- `overlay/patches/passport@0.7.0.patch` — upstream's own passport patch,
  taken verbatim from `.yarn/patches/`.
- `overlay/pnpm-lock.yaml` — lockfile matching the converted manifest.
- `CMD_TOOBUSY_LAG` is raised in `wasmer.toml` — HedgeDoc's default 70ms
  event-loop-lag guard trips on the QuickJS interpreter right after boot and
  would return 503s.
