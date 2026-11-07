# Excalidraw + Wasmer

Host [Excalidraw](https://github.com/excalidraw/excalidraw), the hand-drawn whiteboard, as a **single-user** static app on Wasmer Edge. Drawing, local scene files, browser autosave, and PNG/SVG export need no account, database, API key, or persistent server storage.

## Demo

Deploy this example and open its root URL. Draw on the canvas, save an `.excalidraw` scene, or export an image using the upstream menu. Browser autosave belongs to that browser and origin; save a local file before clearing site data or changing domains.

## How it Works

- `UPSTREAM.json` pins the upstream 0.18.0 source snapshot to commit [`701b901`](https://github.com/excalidraw/excalidraw/tree/701b901a0f1ba3d0b390d9cdf63d112e25abac4b) and a verified SHA-256 archive checksum. Node.js 24+, npm, `tar`, and build-time GitHub/npm registry access are required.
- The recipe extracts fresh verified source, uses pinned Yarn 1.22.22 with the upstream frozen lockfile and install scripts disabled, then runs the upstream Vite build. It rejects non-registry dependency URLs; hosted builder restrictions stay enabled.
- The original upstream app and `packages/excalidraw` components supply every visible control and style. Asserted build-time changes disable collaboration through the existing `isCollabDisabled` guard, set the supported `aiEnabled` option to false, remove the AI plugin/trigger, and unset backend/Excalidraw+ export callbacks. Missing patch anchors fail the build.
- Collaboration, public sharing links, Firebase, and AI backends are **not configured**. Their endpoints are blanked, tracking and Sentry are disabled, and the upstream analytics script is omitted. Local file import/export remains available. Upstream links to Excalidraw+, social pages, and the optional external library catalog remain links to those services.
- The font loader uses the same upstream font files from this deployment, including four Assistant UI fonts copied to their expected URLs (the upstream plugin normally expects its CDN). No custom controls, CSS, typography, or branding are introduced. Upstream MIT and font/dependency license notices ship under `LICENSE` and `notices/`.
- The final static folder is `site/`. Anybuild uses Node.js 24 to build it and Wasmer's static web server to serve it; no Node process runs in production.

## Running Locally

```bash
npm ci --ignore-scripts
npm run build
python3 -m http.server 18125 --bind 127.0.0.1 --directory site
```

Open [the editor](http://127.0.0.1:18125/). In another terminal, verify the packaged assets and notices:

```bash
npm run check -- http://127.0.0.1:18125
```

## Deploying to Wasmer

Install [Anybuild](https://www.anybuild.run/docs/installation/) and the [Wasmer CLI](https://docs.wasmer.io/runtime/get-started/), then run `wasmer login`.

```bash
anybuild build . --wasmer
anybuild deploy .
```

For a GitHub import, select `js-excalidraw` as the application root. Keep the example's `Anybuild` file and the repository-root `Anybuild.js-excalidraw` loader for Anybuild 0.26.4 monorepo builds. From the repository root, check it with:

```bash
anybuild plan . --subdir js-excalidraw --wasmer
```

## License and Upstream

Excalidraw is copyright 2020 Excalidraw, under the [MIT license](https://github.com/excalidraw/excalidraw/blob/701b901a0f1ba3d0b390d9cdf63d112e25abac4b/LICENSE). This template recipe uses the same license. The source archive stays pinned rather than vendored, and installed dependency/font notices are copied into the output. The upstream app, its toolbar, menus, export dialog, and `packages/excalidraw/css` are the canonical design references; rendered review must use this exact build.
