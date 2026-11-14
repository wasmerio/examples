# Docusaurus starter for Wasmer Edge

A Docusaurus 3 documentation site with docs, a blog and search-friendly static pages, served from Wasmer Edge.

After catalog registration, [deploy this template](https://wasmer.io/templates/docusaurus-starter) from the Wasmer templates page.

## How it works

- Write docs in `docs/` and posts in `blog/`; the sidebar comes from `sidebars.ts`.
- Site title, links and footer are in `docusaurus.config.ts`. Change `url` to your app's address.
- `npm run build` writes the site to `build/`, which Wasmer serves as a static site.

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:3000/.

To check the production build, run `npm run build` and look in `build/`.

Catalog registration follows source merge; this PR does not publish the catalog entry. Direct dependencies are pinned, and build tools generate dependency resolutions; transitive dependencies can change between builds.

## Shared UI

The homepage uses the shared Wasmer starter components in `_shared/starter-ui/DESIGN.md`. Docusaurus provides its canonical shared layout, navigation, mobile menu, documentation, blog and footer. Supported theme tokens set the neutral palette; page-local CSS does not replace controls or surfaces.

Run `node scripts/sync-starter-ui.mjs --check js-docusaurus-starter/src/starter-ui.js` at the repository root to verify the generated component copy. Set `SITE_URL` to your production origin before publishing feeds and sitemap links.
