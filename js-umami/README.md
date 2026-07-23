# Umami on Wasmer Edge

[Umami](https://umami.is/) 3.2 — self-hosted, privacy-focused web analytics —
running on [Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

Upstream sources are **not** committed here — and no upstream files are
modified. `setup.mjs` downloads the pinned Umami v3.2.0 source into the
gitignored `app/` directory and copies in the files from `overlay/`. The app
is **built with Node.js** (Next.js 16 `output: "standalone"` + Prisma 7
client engine), and only the assembled `.next/standalone/` artifact runs on
EdgeJS.

## ⚠️ Database required — including at build time

Umami needs a **PostgreSQL** database (set `DATABASE_URL` in `app.yaml`).
Note that upstream's build itself requires a **reachable database** (Prisma
generates the client against it and applies migrations via `check-db`), and
network access for the GeoLite2 GeoIP download.

Also set `APP_SECRET` to a long random string.

## Setup & build

```bash
node setup.mjs
cd app
CI=true pnpm install
DATABASE_URL=postgres://umami:secret@127.0.0.1:5432/umami DISABLE_TELEMETRY=1 pnpm build
node build-standalone.mjs     # assembles static/public/geo into .next/standalone
cd ..
```

Optionally seed a first website row so `/api/send` accepts events before you
configure one through the UI:

```bash
psql "$DATABASE_URL" -f overlay/seed/website.sql
```

## Run locally with Wasmer

```bash
wasmer run . --net \
  --env PORT=3000 \
  --env DATABASE_URL=postgres://umami:secret@127.0.0.1:5432/umami \
  --env APP_SECRET=dev-secret
```

Then open [http://localhost:3000](http://localhost:3000) (default login:
`admin` / `umami`).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, fill in the `env` values in `app.yaml`, then:

```bash
wasmer deploy
```

## Overlay

- `overlay/build-standalone.mjs` — copies `.next/static`, `public/` and
  `geo/` (the GeoLite2 database, resolved relative to the working directory
  at runtime) into `.next/standalone/`, mirroring upstream's Dockerfile
  deployment steps. `wasmer.toml` ships `.next/standalone/` as the package
  filesystem and sets the working directory to it.
- `overlay/seed/website.sql` — optional first website row for `/api/send`.
