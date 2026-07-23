# Next.js SSR on Wasmer Edge

A minimal [Next.js](https://nextjs.org/) app with server-side rendering,
deployed to [Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

The app is **built with Node.js** (`next build` with `output: "standalone"`),
and only the resulting standalone build artifact (`.next/standalone`) runs on
EdgeJS.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

This runs `next build` and then copies `.next/static` and `public/` into
`.next/standalone` (see `scripts/prepare-standalone.cjs`), producing a
self-contained server in `.next/standalone`.

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
