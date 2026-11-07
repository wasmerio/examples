# IT-Tools on Wasmer

Deploy [IT-Tools](https://github.com/CorentinTh/it-tools), a collection of browser-based developer utilities, as a reusable Wasmer static app. The original Vue interface, controls, styles and attribution are preserved.

## Demo

Deploy your own copy and try **Hash text**, **Base64 string encoder/decoder** or **JSON to YAML converter**. No account, database, API key or persistent server storage is needed.

## How it works

- `upstream.json` pins commit `d505845f918e946ec300af7b36efc107e2f66e9e` and the source archive's SHA-256 checksum.
- `npm run build` verifies the archive, installs the upstream frozen pnpm lock with pnpm 9.11.0, and builds its unmodified production UI.
- Git and remote tarball dependency specifications remain disabled. Package installation uses registry packages; no hosted dependency-policy override is enabled.
- Direct tool routes and old route aliases receive exact copies of upstream `index.html`. The original application handles navigation and tool behavior, without relying on an optional server fallback feature.
- `Anybuild` selects Node 24.16.0 for compilation and serves only the generated static files. The repository-root `Anybuild.js-it-tools` supports monorepo imports with `js-it-tools` selected as root directory.

Tools process inputs in the browser. Some upstream utilities use browser capabilities, such as camera access; those capabilities and permissions depend on the visitor's browser. Optional upstream analytics are not configured.

## Running locally

Requirements: Node.js 24.16.0 or newer, npm, `tar`, and network access to GitHub and the npm registry. Upstream's production build allows a 4 GB Node heap.

```bash
cd js-it-tools
npm ci
npm run build
npm run preview
```

Open <http://localhost:18126>. Set `PORT` to use another local port. Direct tool links such as `/hash-text/` work without a running application server.

## Deploying to Wasmer

Import this repository and select `js-it-tools` as the root directory, or upload that directory as a folder. Keep the checked-in `Anybuild` file; the static output is `dist/`.

```bash
anybuild plan . --wasmer
anybuild . --wasmer-deploy
```

From the repository root, inspect the monorepo plan with `anybuild plan . --subdir js-it-tools --wasmer`. Anybuild 0.26.4 maps the configured `static-web-server` version to `wasmer/static-web-server@1.1.0`; this template's direct-route files do not require its optional fallback feature.

## Source, license and updates

IT-Tools is created by Corentin Thomasset and contributors and is distributed under **GPLv3**. The full upstream [LICENSE](LICENSE), original source archive, and this template's build recipe are included in every deployment. Open `/source/README.txt` for source download information and `/LICENSE` for the license.

Keep original notices and provide corresponding source when distributing the app under its license. To update the template, review an upstream commit, update its commit/checksum in `upstream.json`, and verify the production build, direct routes and browser workflows again. A mismatched source archive is rejected.
