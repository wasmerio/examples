# Development, checks and CI

The commands and checks behind a starglow site. [Getting started](./01-getting-started.md) has the short version.

## Docker

`./dev.sh` runs the container as your host user and keeps `node_modules/` in the repository directory, so no files end up owned by root.

| Command                          | What it does                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `./dev.sh`                       | Same as `./dev.sh dev`: dev server on port 4321, drafts are visible                             |
| `./dev.sh build`                 | Installs from the lockfile, runs `astro check`, builds `dist/` and ends with the marker check   |
| `./dev.sh check`                 | Installs from the lockfile and runs `astro check` only                                          |
| `./dev.sh preview`               | Serves the existing `dist/` on port 4321 (run `./dev.sh build` first)                           |
| `./dev.sh ci`                    | The pull-request check set: format, lint, `astro check`, build, offline link check, dist checks |
| `./dev.sh links`                 | Offline link and anchor check over an existing `dist/` (lychee)                                 |
| `./dev.sh workflows`             | Audits `.github/` with actionlint and zizmor                                                    |
| `./dev.sh new <type> <slug>`     | Scaffolds a draft post, note or project, see [The content model](./03-content-model.md)         |
| `./dev.sh pnpm verify`           | Runs the assertions over an existing `dist/` (`pnpm verify`)                                    |
| `./dev.sh pnpm markers`          | Lists unfilled `[[TODO: …]]` markers (`pnpm markers`)                                           |
| `./dev.sh pnpm markers --strict` | The same list, failing while any marker remains (what the deploy runs; needs a built `dist/`)   |
| `./dev.sh shell`                 | Opens a bash shell in the dev container                                                         |
| `./dev.sh pnpm <...>`            | Runs any pnpm command in the container, for example `./dev.sh pnpm add <package>`               |

`./dev.sh new` is the only command that runs on the host without Docker. It needs GNU `date` (GNU coreutils: standard on Linux, `brew install coreutils` and its `gnubin` first in `PATH` on macOS) and the system time zone database (`tzdata`).

### Testing on a phone over the LAN

The dev server listens on all interfaces. Open `http://<your-computer-ip>:4321/` on the phone, using the IP address of the computer (for example from `ip addr`). Host names other than `localhost` are rejected by the Vite host check, so use the IP address.

Do not run the dev server on an untrusted network, such as public Wi-Fi: it binds to `0.0.0.0` and everyone on the network can reach it, drafts included.

## Native

Install an official Node.js 22 build of version 22.23.4 or newer (from nodejs.org or through fnm, nvm or mise) and enable corepack. A distribution package that is older than 22.23.4 fails Astro's engine check and cannot run the TypeScript scripts in `scripts/`. The version used by the Docker image is in `.node-version`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm exec astro check
pnpm run build:site   # astro build, draft-asset prune, Pagefind index
pnpm run verify       # assertions over dist/
pnpm run markers      # list unfilled [[TODO: …]] markers
pnpm build            # astro check + build:site + markers, the full local build
```

corepack provides the pnpm version pinned in `packageManager` in `package.json`. Locally, lychee, actionlint and zizmor run only as pinned containers, through `./dev.sh links` and `./dev.sh workflows`; in CI lychee comes from the SHA-pinned lychee-action.

If you switch between the Docker and the native install, remove `node_modules` first (`rm -rf node_modules`), because native packages are installed per platform and per Node version.

## Checks and CI

`.github/workflows/checks.yml` runs on pull requests to `main` and on pushes to every other branch (except Dependabot's). It calls one shared action, `.github/actions/site-checks`, which runs in this order:

1. Install from the lockfile
2. Prettier format check
3. ESLint
4. `astro check`
5. Build (`pnpm run build:site`)
6. Offline link and anchor check over `dist/` (lychee)
7. `pnpm verify`: assertions over `dist/` (routes, canonical URLs, no drafts or demo content, search index, structured data), ending with `verify-dist: all {n} checks passed.`
8. The marker check, which only warns

`.github/workflows/deploy.yml` runs on a push to `main` and on manual dispatch. Both of its jobs are skipped unless the ref is `main`, so a dispatch from another branch publishes nothing. It runs the same set with the strict marker check, so the deploy fails while any `[[TODO: …]]` marker remains, and only then uploads `dist/` and publishes it with the official GitHub Pages actions.

`./dev.sh ci` runs the same steps locally, in the same order. `./dev.sh pnpm markers --strict` reproduces the deploy's marker gate, and `./dev.sh workflows` audits the workflow files.

## Maintenance

Dependabot proposes updates weekly for npm and for GitHub Actions, in grouped pull requests with a seven-day cooldown. TypeScript major versions are ignored, because `astro check` does not support TypeScript 7 yet.

The container image digests are not covered by Dependabot: the `node:22-slim` digest in the `Dockerfile` and the lychee, actionlint and zizmor digests in `dev.sh`. To refresh one:

```sh
docker pull node:22-slim
docker inspect --format '{{index .RepoDigests 0}}' node:22-slim
```

Replace the old `tag@sha256:…` reference with the printed one. Keep the lychee image at the same version as the lychee that CI installs: `LYCHEE_IMAGE` in `dev.sh` and `lycheeVersion` in `.github/actions/site-checks/action.yml` must name the same version (`0.24.2` and `v0.24.2` today). A lychee-action bump does not change the CI version, because it is passed explicitly.

## Environment variables

`SITE_URL`, `PUBLIC_GOOGLE_SITE_VERIFICATION` and `MARKERS_STRICT` are listed in [Configuring starglow](./02-configuration.md#environment-variables).
