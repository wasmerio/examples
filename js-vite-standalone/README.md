# Vite + Node.js server on Wasmer Edge

A minimal [Vite](https://vitejs.dev/) site served by a small Node.js HTTP
server (`server/index.js`), deployed to
[Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

The site is **built with Node.js** (`vite build`, plus an esbuild step that
bundles the server into `dist/server/index.cjs`), and only the resulting
`dist/` artifact runs on EdgeJS. This template is also a good starting point
for running any hand-written Node.js HTTP server on Wasmer Edge.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

This builds the static site into `dist/` and bundles the server into
`dist/server/index.cjs`.

## Run locally with Wasmer

```bash
wasmer run . --net --env PORT=3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, then:

```bash
wasmer deploy
```
