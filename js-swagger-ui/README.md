# Swagger UI

Browse an OpenAPI document in the browser. The page is the official Swagger UI build from the pinned commit. Nothing is stored on the server.

## Demo

Local check: `npm run build`, then `python3 -m http.server 8080 --directory dist`. Smoke passed against that server. Edge deploy is not done yet.

## Preview image

`preview.png` is 1600×1000, captured from that local server. It shows the Swagger Petstore document loaded in Swagger UI 5.35.1.

## How it works

- `UPSTREAM.json` pins Swagger UI 5.35.1 at commit `8fd7a7d57514e63e3601b4c61f3cdbafe605af02`.
- `npm run build` downloads that source archive, checks the SHA-256, and serves the `dist/` directory upstream already committed. No upstream file is edited.
- The Apache-2.0 license is published at `/LICENSE`. The archive is published at `/source/`.
- Node 24.16.0 only runs the download. The site itself is static.

The pattern follows `js-cyberchef`: verify an upstream archive, then serve it with the static file provider.

## Setup (secrets)

None.

## Limits

- The page is a browser app. There is no Wasmer database, volume, or scheduled job.
- Loading a remote OpenAPI URL uses the visitor's browser network.

## Running locally

```bash
cd js-swagger-ui
npm ci
npm run build
python3 -m http.server 8080 --directory dist
```

Check it with `node smoke.mjs http://127.0.0.1:8080`.

## Deploying to Wasmer

```bash
anybuild build . --wasmer
anybuild . --wasmer --start
```

## License and source

Swagger UI is Apache-2.0. Source: https://github.com/swagger-api/swagger-ui/tree/8fd7a7d57514e63e3601b4c61f3cdbafe605af02
