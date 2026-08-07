# Uptime Kuma framework-test example — EdgeJS notes

This directory is the upstream **Uptime Kuma 2.4.0** source
(<https://github.com/louislam/uptime-kuma/releases/tag/2.4.0>) plus the
**official prebuilt frontend** for that release (`dist/`, fetched with the
upstream `npm run download-dist` — the same artifact the project's own
non-Docker install path uses).

The harness provisions an ephemeral MySQL per run and injects the
`UPTIME_KUMA_DB_*` env vars through the `database` block in `routes.json`
(Kuma's `mariadb` mode; knex + the pure-JS `mysql2` driver — the native
`@louislam/sqlite3` addon is only require()d in sqlite mode and never loads
here). Kuma applies its knex migrations automatically at boot, so no setup
commands are needed. With a fresh database there is no admin user yet, so the
asserted routes are the unauthenticated surface: `/api/entry-page` (JSON),
`/setup`, and `/` (redirects into the SPA shell).

## Deviations from upstream

- added the prebuilt `dist/` (official 2.4.0 release artifact; upstream
  gitignores it — re-included via this directory's `.gitignore`).
- `package.json`: removed the `build` script (the committed `dist` is the
  release artifact; no rebuild wanted at test time), and flattened `start`
  from `npm run start-server` to `node server/server.js` — the nested npm
  invocation cannot resolve inside the WASIX guest (host npm path is not
  mounted).
- dropped `package-lock.json` (the harness installs with pnpm).
- added `routes.json` and this file.
