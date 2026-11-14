# Nuxt starter for Wasmer Edge

A Nuxt 4 app with file-based routing, prerendered to static files with `nuxt generate` and served from Wasmer Edge.

After catalog registration, [deploy this template](https://wasmer.io/templates/nuxt-starter) from the Wasmer templates page.

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

Catalog registration follows source merge; this PR does not publish the catalog entry. Direct dependencies are pinned, and build tools generate dependency resolutions; transitive dependencies can change between builds.

The UI uses the repository's shared Wasmer web components, loaded from `public/starter-ui.js`.
Their design references and supported states are documented in `_shared/starter-ui/DESIGN.md`.
Refresh the generated copy from the repository root with `node scripts/sync-starter-ui.mjs js-nuxt-starter/public/starter-ui.js`.
