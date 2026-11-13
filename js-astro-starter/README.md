# Astro starter for Wasmer Edge

A static Astro 7 site with two pages and a shared layout. Astro renders every page to HTML at build time and ships no JavaScript unless you add it.

[Deploy this template](https://wasmer.io/templates/astro-starter) from the Wasmer templates page.

## How it works

- Pages live in `src/pages/`; `index.astro` and `about.astro` use the layout in `src/layouts/Base.astro`.
- `npm run build` writes the site to `dist/`.
- Wasmer detects Astro and serves `dist/` as a static site.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:4321/.

To check the production build, run `npm run build` and look in `dist/`.
