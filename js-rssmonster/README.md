# RSSMonster on Wasmer Edge

[RSSMonster](https://github.com/pietheinstrengholt/rssmonster) — a self-hosted
RSS aggregator (Google Reader-style) — running on
[Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

Upstream sources are **not** committed here — and no upstream files are
modified. `setup.mjs` downloads the pinned RSSMonster source into the
gitignored `app/` directory (laid out per upstream's production Dockerfile:
the Express server at the root with the Vue client source under `client/`)
and copies in the files from `overlay/`. Building (with Node.js) produces the
static client in `app/dist/`; the server runs directly on EdgeJS with its
production `node_modules` shipped inside the package.

## ⚠️ Database required

RSSMonster needs a **MySQL** database, configured through the `DB_*`
environment variables (see `app.yaml`). RSSMonster does not run migrations at
boot — run them once against your database with local Node.js:

```bash
cd app
export DB_HOSTNAME=... DB_PORT=3306 DB_DATABASE=... DB_USERNAME=... DB_PASSWORD=...
node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all   # creates the default `rssmonster` user + demo feed
```

## Setup & build

```bash
node setup.mjs
cd app
CI=true pnpm install --prod   # server dependencies
node build-client.mjs         # builds the Vue client (client/, npm ci) into dist/
cd ..
```

`overlay/pnpm-workspace.yaml` pins `nodeLinker: hoisted` so `node_modules`
contains real files (it is shipped inside the Wasmer package).

## Run locally with Wasmer

```bash
wasmer run . --net \
  --env PORT=3000 \
  --env DB_HOSTNAME=127.0.0.1 --env DB_PORT=3306 \
  --env DB_DATABASE=rssmonster --env DB_USERNAME=rssmonster --env DB_PASSWORD=secret
```

Then open [http://localhost:3000](http://localhost:3000) (default login:
`rssmonster` / `password`).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, fill in the `DB_*` values in `app.yaml`, then:

```bash
wasmer deploy
```

## Overlay

- `overlay/build-client.mjs` — builds the Vue client with its own npm
  lockfile and copies the output to `dist/`.
- `overlay/pnpm-workspace.yaml`, `overlay/pnpm-lock.yaml` — hoisted linker
  configuration and the server dependency lockfile.
