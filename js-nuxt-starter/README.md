# Nuxt starter for Wasmer Edge

A Nuxt 4 app with file-based routing, prerendered to static files with `nuxt generate` and served from Wasmer Edge.

[Deploy this template](https://wasmer.io/templates/nuxt-starter) from the Wasmer templates page.

## How it works

- Pages live in `app/pages/`; `app/app.vue` wraps them.
- `npm run build` runs `nuxt generate`, which prerenders every route to `.output/public/`.
- Wasmer detects Nuxt and serves `.output/public/` as a static site.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000/.

To check the production build, run `npm run build` and look in `.output/public/`.
