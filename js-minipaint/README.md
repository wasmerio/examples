# miniPaint + Wasmer

Host [miniPaint](https://github.com/viliusle/miniPaint), a browser image editor with layers, drawing tools, filters, and PNG/JPEG/WebP export, on Wasmer Edge. Local image editing and export need no account, database, server-side storage, or API key.

## Demo

Deploy this example to get a live URL. Open `/?image=/sample.svg` to edit the included sample artwork, or use **File → Open** to choose an image from your device.

## How it Works

- `UPSTREAM.json` pins miniPaint 4.14.3 to commit [`a79733e`](https://github.com/viliusle/miniPaint/tree/a79733eb803fc97084ef0ee4faa96b031e69e1c0) and a SHA-256 archive checksum.
- `npm run build` verifies and extracts that archive, installs its locked dependencies with `npm ci --include=dev --ignore-scripts`, and runs the upstream production build. Node.js 22 or newer, npm, `tar`, and network access to GitHub/npm are required at build time.
- The deployable `site/` contains the original root `index.html`, `dist/`, `images/`, the GIF export worker at its original URL, the MIT license, and the sample artwork. Serving `dist/` alone does not include the editor page or icons.
- The `Anybuild` file builds with Node.js 24 and serves `site/` as static files. No JavaScript server runs in production.
- The upstream interface, controls, styles, and notices are preserved. The MIT license and `UPSTREAM.json` are also included in the served output.

## Running Locally

```bash
npm ci
npm run build
python3 -m http.server 18123 --bind 127.0.0.1 --directory site
```

Open [the editor](http://127.0.0.1:18123/) or [the sample artwork](http://127.0.0.1:18123/?image=/sample.svg). Python is only a local preview option; Wasmer uses its static web server.

With the server running, verify the packaged page, assets, and license:

```bash
npm run check -- http://127.0.0.1:18123
```

Editing happens in your browser. Export your work before clearing browser data. Optional upstream features such as remote images, online media search, and Google Fonts still depend on external services; they are not required for local image editing.

## Deploying to Wasmer

Install [Anybuild](https://www.anybuild.run/docs/installation/) and the [Wasmer CLI](https://docs.wasmer.io/runtime/get-started/), then log in with `wasmer login`.

From this directory:

```bash
anybuild build . --wasmer
anybuild deploy .
```

When importing this repository through Wasmer's GitHub flow, select `js-minipaint` as the application root. Keep both the example's `Anybuild` file and the repository-root `Anybuild.js-minipaint` loader: Anybuild 0.26.4 uses the latter for monorepo builds with `--subdir js-minipaint`.

To check that monorepo configuration from the repository root:

```bash
anybuild plan . --subdir js-minipaint --wasmer
```

## License and Upstream

miniPaint is copyright ViliusL and distributed under the [MIT license](https://github.com/viliusle/miniPaint/blob/a79733eb803fc97084ef0ee4faa96b031e69e1c0/MIT-LICENSE.txt). The build copies that license and the generated bundle's third-party notices without modifying them. This template's build recipe and sample artwork are also MIT-licensed.
