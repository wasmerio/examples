# js-umami — EdgeJS framework-test notes

Umami v3.2.0 (https://github.com/umami-software/umami), a self-hosted web
analytics server: Next.js 16 (app router, `output: standalone`) + Prisma 7
with the **client engine**, whose query compiler is a wasm-bindgen WASM
module. This app is the ECO-355/ECO-394 acceptance test for `externref`-table
support in EdgeJS's WebAssembly implementation: every query the app makes runs
through `query_compiler_fast_bg.postgresql.wasm`, which roots JS values in an
exported `externref` table (`__wbindgen_externrefs`).

## What is vendored (and why it deviates from other examples)

Unlike most examples, this directory does **not** contain umami's source
tree. It contains the FINAL build artifact only:

- `.next/standalone/` — the output of `next build` (standalone output file
  tracing), including its pruned `node_modules`, with `.next/static` and
  `public/` copied in the way a standalone deployment requires. Built on host
  Node 24 from the upstream `v3.2.0` tag with
  `pnpm run build-db && pnpm exec prisma generate && pnpm run build-app`
  against a scratch Postgres (`next build` requires a reachable database) and
  network access for the GeoIP download.
- `geo/` — GeoLite2-City.mmdb, moved to the project root because umami
  resolves it via `process.cwd()/geo` and the harness starts the app with the
  project root as cwd. `/api/send` hard-fails without it (maxmind.open throws).
- `prisma/` + `prisma.config.ts` — schema and migrations, so the harness's
  `database.setup` can run `prisma migrate deploy` (host Node) against the
  provisioned Postgres. The `prisma` CLI is the only pnpm dependency.
- `seed/website.sql` — inserts one website row so the `send-event` route can
  record a pageview (`/api/send` 404s unknown website ids).

Rationale: umami's real `pnpm install` + `next build` needs a live
`DATABASE_URL` at build time, network access, and ~10 minutes — none of which
the harness build step provides. The framework tests exercise the *runtime*
(EdgeJS runs final built artifacts); the standalone output is that artifact.
The `build` script is therefore a no-op.

## What the routes exercise

- `heartbeat`, `login-page`, `homepage`, `static-chunk` — Next server + static
  serving.
- `login-api` — bcrypt + JWT + a Prisma user lookup through the wasm query
  compiler (default credentials `admin` / `umami` from umami's 01_init
  migration).
- `send-event` — the full analytics ingest path: bot check, GeoIP lookup,
  session create/update and event insert, all compiled by the Prisma wasm
  module per request. Requires a browser-like User-Agent (isbot) and the
  seeded website id.

## Runtime requirements

- Wasmer with the WARP-70 Part A C-API reference surface (externref tables)
  plus the `wasm_c_api_v0` bridge fixes for WASIX (guest-callback shadow
  sync, non-destructive `wasm_memory_data`). Until a wasmer release ships
  these, run locally with a dev build:
  `WASMER_BIN=~/repos/wasmer/wasmer/target/release/wasmer` (branch
  `warp-70-capi-externref`).
- EdgeJS with the ECO-394 externref wiring in `src/webassembly/edge_wasm.cc`
  and the Intl `DateTimeFormat`-callable-without-`new` fix (umami's timezone
  validation).

## Known limitations

- Next's own `next start` path is NOT used: loading `next.config.ts` via
  Next's legacy TS-config transpile depends on `@next/swc-wasm-nodejs`
  behavior that drops `module.type`/import attributes (reproduced identically
  on host Node when forced onto the wasm SWC; upstream quirk). The standalone
  server inlines the config at build time and avoids it.
- Every JS value passed into the wasm query compiler pins memory until the
  store dies (WARP-70 Part A has no reference lifetime management; Part B
  adds it). Fine for tests; not production-grade yet.
