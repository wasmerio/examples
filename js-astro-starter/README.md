# Astro starter for Wasmer Edge

A static Astro 7 site with a home page, an about page and one shared layout.
Astro renders the pages to HTML at build time. A small local JavaScript module
provides the canonical Wasmer starter components; this template ships that module.

## Develop and build

Use Node 22.23.4 or later:

```sh
npm install
npm run dev
```

Open http://localhost:4321/. Run `npm run build` to write the production site to `dist/`;
`npm run preview` serves that output locally. `/about/` is a second static page.

The pages live in `src/pages/` and use `src/layouts/Base.astro`. The layout imports
`src/starter-ui.js`, generated from the repository's shared component library.
No page-local CSS replaces card surfaces, typography or controls.

## Verify the Wasmer build

With Docker, Wasmer and Anybuild 0.33.3 available, run from the repository root:

```sh
anybuild --subdir js-astro-starter --builder docker --runner wasmer --serve-port 18946 --start
```

Anybuild detects Astro, builds the selected subdirectory and serves `dist/` through
Wasmer's static server. Catalog registration follows source merge; this source PR
does not publish a template entry or production deployment.

## Dependencies and shared UI

The direct Astro dependency is pinned to 7.4.11. The build generates its dependency
resolution and lockfile inside the build artifact. No lockfile is committed, so later
builds may resolve different transitive dependency versions. Commit a reviewed lockfile
in your own application when reproducible dependency resolution is required.

From the repository root, refresh or verify the shared component copy with:

```sh
node scripts/sync-starter-ui.mjs js-astro-starter/src/starter-ui.js
node scripts/sync-starter-ui.mjs --check js-astro-starter/src/starter-ui.js
```
