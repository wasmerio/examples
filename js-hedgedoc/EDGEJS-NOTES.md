# HedgeDoc framework-test example — EdgeJS notes

This directory is the upstream **HedgeDoc 1.11.0 release tarball**
(<https://github.com/hedgedoc/hedgedoc/releases/tag/1.11.0>), which ships the
frontend prebuilt under `public/build/`, plus a `routes.json` for the EdgeJS
framework-test harness.

The harness provisions an ephemeral PostgreSQL (embedded binaries, no Docker)
per run and injects the connection info through the `database` block in
`routes.json` (`CMD_DB_URL`). HedgeDoc applies its migrations automatically on
startup, so no seed step is needed; the asserted routes (`/_health`, `/status`,
`/`) are all unauthenticated.

## Deviations from the upstream tarball

All deviations are packaging-level (install/config), not code changes:

- `package.json`:
  - dropped the `packageManager` field (upstream pins yarn 4; the harness
    installs with pnpm),
  - `passport` uses pnpm `patchedDependencies` (`patches/passport@0.7.0.patch`)
    instead of yarn's `patch:` protocol — same patch content, taken from
    upstream `.yarn/patches/`,
  - git dependencies use `#<sha>` instead of yarn's `#commit=<sha>` (pnpm
    cannot resolve the latter),
  - removed `Idle.Js` (browser-only dependency, already bundled into the
    prebuilt frontend; its git pin is not installable with pnpm),
  - removed the `build`/`dev` webpack scripts (the release tarball ships the
    built frontend; the webpack 4 dev tooling is not part of the runtime
    contract).
- removed `.yarn/`, `.yarnrc.yml`, and `yarn.lock` (yarn-specific).
- `.gitignore`: un-ignored `public/build` / `public/views/build` — the release
  tarball's prebuilt assets are committed here on purpose.
- added `routes.json`, `patches/`, and this file.
