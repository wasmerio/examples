# Astro SSR on Wasmer Edge

A minimal [Astro](https://astro.build/) app with server-side rendering
(`output: "server"` with the [`@astrojs/node`](https://docs.astro.build/en/guides/integrations-guide/node/)
adapter in `standalone` mode), deployed to
[Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

The app is **built with Node.js** (`astro build`), and only the resulting
build artifact (`dist/`, containing the standalone server and the client
assets) runs on EdgeJS.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

This produces the standalone server in `dist/server/entry.mjs` and the static
client assets in `dist/client/`.

## Run locally with Wasmer

```bash
wasmer run . --net --env PORT=4321
```

Then open [http://localhost:4321](http://localhost:4321).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, then:

```bash
wasmer deploy
```
