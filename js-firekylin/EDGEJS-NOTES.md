# Firekylin framework-test example — EdgeJS notes

This directory is the upstream **Firekylin 1.7.3 release package**
(<https://github.com/firekylin/firekylin/releases/tag/1.7.3>,
`firekylin_1.7.3.tar.gz`) — the prebuilt distribution (compiled `src/`,
built admin frontend under `www/static`) that upstream deploys with
`node production.js`.

The harness provisions an ephemeral MySQL per run and injects the `FK_DB_*`
env vars through the `database` block in `routes.json` (Firekylin reads them
in `src/common/config/adapter/model.js`). Firekylin normally requires a web
install wizard on first run; `edgejs-install.js` (run as a `database.setup`
command on host Node) replaces it deterministically, mirroring the upstream
installer (`src/home/service/install.js`): it imports `firekylin.sql`, seeds
the options the installer sets (site title "Firekylin on EdgeJS", theme,
password salt, navigation), creates the `admin` user (phpass hash of
`md5(salt + password)`, password `framework-test-password`), and writes the
`.installed` marker. Asserted routes: `/` (seeded title), `/archives/`,
`/admin`.

Note: Firekylin's DB driver chain (`think-model-mysql` → `think-mysql` →
legacy `mysql` 2.x) cannot use MySQL 8's default `caching_sha2_password`;
the harness creates its user with `mysql_native_password` (and pins MySQL
8.0.x) for exactly this class of app.

**WASIX**: skipped (edgejs Makefile `FRAMEWORK_TEST_EDGE_SKIP`). ThinkJS
always serves through `cluster.fork()`, and the cluster IPC channel is not
functional under WASIX today (`process.send` in the worker fails with EPIPE —
extra fds are not passed through wasmer's process spawn), so the worker can
never receive its listen handle and the master respawns it forever. Tracked
as a WASIX runtime capability gap; green on Node baseline and QuickJS native.

## Deviations from the upstream release package

- added `edgejs-install.js` (non-interactive installer), `routes.json`,
  `.gitignore` (runtime artifacts: `.installed`, `runtime/`, `logs/`), and
  this file.
- dropped `pnpm-lock.yaml` (the harness installs with `--no-lockfile`) and
  the empty `logs/` directory.
