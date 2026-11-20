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
anybuild auto . --docker --wasmer --subdir js-astro-starter
```

Anybuild detects Astro, builds the selected subdirectory and prepares a Wasmer artifact
that serves `dist/` through Wasmer's static server. This is the command CI runs. Catalog registration follows source merge; this source PR
does not publish a template entry or production deployment.

## Dependencies and shared UI

The direct Astro dependency is pinned to 7.4.11, and `package-lock.json` locks the full
dependency tree so every build installs the same versions. Run `npm install` after changing
`package.json` and commit the updated lockfile.

From the repository root, refresh or verify the shared component copy with:

```sh
node scripts/sync-starter-ui.mjs js-astro-starter/src/starter-ui.js
node scripts/sync-starter-ui.mjs --check js-astro-starter/src/starter-ui.js
```
