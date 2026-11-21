# CyberChef

Encode, decode, and hash data in the browser. Open the app, paste text into Input, and run To Base64. Nothing is stored on the server.

## Demo

https://cyberchef-template-test.wasmer.app

That URL is the test deploy of this recipe (`ayushojha/cyberchef-template-test`, version v1). Locally, `anybuild . --wasmer --start` serves the same build on http://127.0.0.1:8080.

## Preview image

`preview.png` is 1600×1000, captured from https://cyberchef-template-test.wasmer.app. It shows To Base64 of `Hello Wasmer` producing `SGVsbG8gV2FzbWVy`. This file is the image to upload as the catalog `defaultImage`.

## How it works

- `UPSTREAM.json` pins CyberChef 11.6.0 at commit `f464d62c7c943cda9749a765932a7548ba9bfb16`.
- `npm run build` downloads the official release zip and the matching source archive, checks both SHA-256 values, and serves the release as a static site.
- The release page is `CyberChef_v11.6.0.html`. The build also copies it to `index.html` so the static server has a directory index. No upstream file is edited.
- The exact upstream tree is published at `/source/`, and the Apache 2.0 license is published at `/LICENSE`.
- `Anybuild` uses Node 24.16.0 only to run that download. The site itself is static. The root loader `Anybuild.js-cyberchef` selects `js-cyberchef` for monorepo imports.

The pattern follows `js-bentopdf` and `js-it-tools`: verify an upstream release, then serve it with the static file provider.

## Setup (secrets)

None. CyberChef has no account, database, or admin password.

## Limits

- Processing happens in the visitor's browser. There is no Wasmer database, volume, or scheduled job.
- The official release zip is about 80 MB. That is the deployed site, plus the upstream source tree under `/source/`.
- Operations that call another website run from the browser, so they depend on that site and on the browser's network.
- There is no always-on worker. Closing the tab stops the current recipe.

## Running locally

Requirements: Node.js 24, `curl`, `unzip`, `tar`, and network access to GitHub.

```bash
cd js-cyberchef
npm ci
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Check it with `node smoke.mjs http://localhost:8080`.

## Deploying to Wasmer

Import this repository and select `js-cyberchef` as the root directory, or upload that directory. Keep the checked-in `Anybuild` file.

```bash
anybuild build . --wasmer
anybuild . --wasmer --start
```

## License and source

CyberChef is Apache-2.0, with Crown Copyright held by the UK government. The license file in this directory is the upstream `LICENSE` at the pinned commit. Source: https://github.com/gchq/CyberChef/tree/f464d62c7c943cda9749a765932a7548ba9bfb16
