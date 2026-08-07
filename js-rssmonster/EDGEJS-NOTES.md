# RSSMonster framework-test example — EdgeJS notes

This directory mirrors the upstream RSSMonster production layout (see its
Dockerfile): the contents of `server/` at the root, with the Vue client built
and placed at `./dist`, which the Express app serves via
`express.static("dist")`. Source: <https://github.com/pietheinstrengholt/rssmonster>
at commit `bbca402` (2026-07-04).

The harness provisions an ephemeral MySQL per run (embedded binaries, no
Docker) and injects the `DB_*` env vars through the `database` block in
`routes.json`. RSSMonster does not run migrations at boot, so the block's
`setup` commands run `sequelize db:migrate` and `db:seed:all` (host Node)
before the server starts; the seeds create the default `rssmonster` user and
demo category/feed. Asserted routes: `/api/health` (unauthenticated JSON) and
`/` (the built client shell).

## Deviations from upstream

- Repo layout flattened per the production Dockerfile: `server/*` at the
  root plus prebuilt `client/dist` → `./dist` (client source not vendored;
  the top-level `README.md`/`LICENSE.md` are copied from the repo root).
- `.gitignore`: un-ignored `dist/` — the prebuilt client is committed here on
  purpose.
- dropped `package-lock.json` (the harness installs with pnpm).
- added `routes.json` and this file.
