# Docusaurus starter for Wasmer Edge

A Docusaurus 3 documentation site with docs, a blog and search-friendly static pages, served from Wasmer Edge.

After catalog registration, [deploy this template](https://wasmer.io/templates/docusaurus-starter) from the Wasmer templates page.

## How it works

- Write docs in `docs/` and posts in `blog/`; the sidebar comes from `sidebars.ts`.
- Site title, links and footer are in `docusaurus.config.ts`.
- `npm run build` writes the site to `build/`, which Wasmer serves as a static site.

## Set your site URL

Sitemaps, RSS/Atom feeds and canonical links need your app's public address, which is not known when the site is built. Set it before publishing, either as a `SITE_URL` build variable (for example `SITE_URL=https://my-docs.wasmer.app npm run build`) or by giving `siteUrl` a default in `docusaurus.config.ts` (`process.env.SITE_URL || 'https://my-docs.wasmer.app'`). Without a site URL, the build skips `sitemap.xml` and the blog feeds instead of publishing them with wrong links, and canonical links point at `http://localhost:3000`.

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:3000/.

To check the production build, run `npm run build` and look in `build/`.

Catalog registration follows source merge; this PR does not publish the catalog entry. Dependencies are locked in `package-lock.json`; run `npm install` after changing `package.json` and commit the updated lockfile.

## Shared UI

The homepage uses the shared Wasmer starter components in `_shared/starter-ui/DESIGN.md`. Docusaurus provides its canonical shared layout, navigation, mobile menu, documentation, blog and footer. Supported theme tokens set the neutral palette; page-local CSS does not replace controls or surfaces.

Run `node scripts/sync-starter-ui.mjs --check js-docusaurus-starter/src/starter-ui.js` at the repository root to verify the generated component copy.
