# Docusaurus starter for Wasmer Edge

A Docusaurus 3 documentation site with docs, a blog and search-friendly static pages, served from Wasmer Edge.

[Deploy this template](https://wasmer.io/templates/docusaurus-starter) from the Wasmer templates page.

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
