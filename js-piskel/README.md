# Piskel + Wasmer

Host [Piskel](https://github.com/piskelapp/piskel), a desktop browser editor for pixel art, animated sprites, and GIF/PNG export, on Wasmer Edge. Drawing, preview, and local export need no account, database, API key, or persistent server storage.

## Demo

Deploy this example and open its root URL in a desktop browser. For an example animation, download `/sample.piskel`, open the upstream **Import** panel, select **Browse .piskel files**, and import the downloaded file. The included original 16 × 16 star has two frames at 4 FPS. It is also available directly in this template folder for local import.

Piskel [does not support mobile or tablets](https://github.com/piskelapp/piskel/blob/745caa20ebebbe3991247064ccc5b51ee9a5490d/README.md#mobiletablets). This template preserves the upstream desktop layout. Use a current desktop Chrome, Firefox, or Edge browser; Brave requires canvas fingerprinting protection to be disabled for this app.

## How it Works

- `UPSTREAM.json` pins Piskel's `0.15.2-SNAPSHOT` source to commit [`745caa2`](https://github.com/piskelapp/piskel/tree/745caa20ebebbe3991247064ccc5b51ee9a5490d) and a verified SHA-256 archive checksum. Node.js 24+, npm, `tar`, and build-time GitHub/npm registry access are required.
- The build extracts fresh verified source, runs `npm ci --include=dev --ignore-scripts`, and builds the original icon sprites, scripts, styles, and editor with the upstream production command. Every lockfile dependency must come from the npm registry; hosted Git/URL dependency restrictions stay enabled.
- Upstream puts the current timestamp in generated asset filenames. Two asserted build-tool changes freeze that metadata to the pinned source commit's UTC timestamp, keeping rebuild filenames stable. Application code, HTML templates, controls, styles, and icons remain unchanged.
- The whole upstream `dest/prod/` is copied to `site/`, alongside the sample, provenance, Apache license, and upstream/dependency notices. The unminified upstream bundle and source maps are retained.
- Anybuild builds with Node.js 24 and serves `site/` using Wasmer's static web server. No JavaScript server, account service, or cloud gallery is deployed.

## Running Locally

```bash
npm ci --ignore-scripts
npm run build
python3 -m http.server 18124 --bind 127.0.0.1 --directory site
```

Open [the editor](http://127.0.0.1:18124/) and import `sample.piskel` for the two-frame animation. Verify all packaged assets and notices while the server runs:

```bash
npm run check -- http://127.0.0.1:18124
```

Save or export your work locally. Browser storage belongs to the current browser and origin, and is not shared across devices or retained after site data is cleared.

## Deploying to Wasmer

Install [Anybuild](https://www.anybuild.run/docs/installation/) and the [Wasmer CLI](https://docs.wasmer.io/runtime/get-started/), then run `wasmer login`.

```bash
anybuild build . --wasmer
anybuild deploy .
```

For a GitHub import, select `js-piskel` as the application root. Keep this example's `Anybuild` and the repository-root `Anybuild.js-piskel` loader for Anybuild 0.26.4 monorepo builds. From the repository root:

```bash
anybuild plan . --subdir js-piskel --wasmer
```

## License and Upstream

Piskel is copyright 2017 Julian Descottes, under the [Apache 2.0 license](https://github.com/piskelapp/piskel/blob/745caa20ebebbe3991247064ccc5b51ee9a5490d/LICENSE). This recipe and original sample also use Apache 2.0. The build preserves the upstream license, source maps, original unminified bundle, and dependency notices. Piskel's `src/index.html`, `src/templates/`, `src/css/`, and generated production editor are the canonical interface references; no Wasmer UI is added.
