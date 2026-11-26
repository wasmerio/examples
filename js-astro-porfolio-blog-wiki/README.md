<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Portfolio, Blog & Wiki Template](https://github.com/EloyEMC/astro-porfolio-blog-wiki-template) Astro theme by EloyEMC, copied from commit `025f2c175289fd476960da65a718051ed1d60663` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-porfolio-blog-wiki.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.toml.
  - Removed lockfiles of other package managers: package-lock.json; kept pnpm-lock.yaml.
- **Environment variables:** None.
- **Credit:** theme by [EloyEMC](https://github.com/EloyEMC), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Portfolio + Blog + Wiki Template

A generic, buildable Astro starter for a portfolio, editorial blog, and optional knowledge wiki. It contains example content and placeholder assets only—replace them before publishing.

Created by [Eloy Martínez Cuesta](https://eloymartinezcuesta.com).

<p align="center">
  <a href="docs/screenshots/home-real.webp"><img src="docs/screenshots/home-real.webp" alt="Home page of the reference implementation" width="1100" /></a>
</p>

## Quick start

Requirements: Node.js `>=22.12.0` and npm.

```bash
npm install
npm run dev
npm run build
```

The local site runs at `http://localhost:4321`.

## Customization

1. Edit `src/config.ts` for the site name, URL, description, social links, SEO image, and homepage filters.
2. Replace `src/authors.js` with your author profiles.
3. Add Markdown or MDX posts under `src/content/blog/` and update the collection loader in `src/content.config.ts` if you want a different content pattern.
4. Add wiki entries under `src/content/wiki/iluminacion/`, or rename the collection and route for your subject area.
5. Replace the SVG placeholders in `public/` with your own optimized assets.
6. Update navigation and visual tokens in `src/components/` and `src/styles/`.

All URLs, names, social handles, analytics IDs, and legal text in this repository are examples. Search, RSS, sitemap, responsive navigation, SEO metadata, article layouts, tag/archive routes, and the wiki pattern are designed to be extended rather than treated as finished product copy.

## Project map

```text
src/
├── components/       # Navigation, search, SEO, cards, and shared UI
├── content/          # Blog and optional wiki Markdown collections
├── layouts/          # Site, home, interior, and article shells
├── pages/            # Portfolio, blog, tags, archive, API, and wiki routes
├── styles/           # Global and page-level styles
├── config.ts         # Site identity and reusable settings
└── content.config.ts # Content schemas and loaders
public/               # Curated generic SVG placeholders
astro.config.mjs      # Markdown, sitemap, and Tailwind integration
wrangler.toml         # Optional Cloudflare Pages settings
```

## Screenshots

The repository includes reference captures from the original implementation at [eloymartinezcuesta.com](https://eloymartinezcuesta.com). They show the visual direction the clean template preserves:

| Home | Articles | Wiki |
| --- | --- | --- |
| [![Home](docs/screenshots/home-real.webp)](docs/screenshots/home-real.webp) | [![Articles](docs/screenshots/articles-real.webp)](docs/screenshots/articles-real.webp) | [![Wiki](docs/screenshots/wiki-real.webp)](docs/screenshots/wiki-real.webp) |

| Article detail |
| --- |
| [![Article detail](docs/screenshots/article-real.webp)](docs/screenshots/article-real.webp) |

## Demo video

GitHub does not render a YouTube iframe inside a README, so the video is linked through its thumbnail:

[![Watch the Astro template walkthrough](https://img.youtube.com/vi/IjI0EbcuNrw/maxresdefault.jpg)](https://youtu.be/IjI0EbcuNrw)

The local demo video is also generated from the reference captures as `docs/demo.mp4`. It is intentionally ignored by Git so the repository does not carry a binary video.

## Deployment

Run `npm run build` and deploy the generated `dist/` directory to any static host, including Cloudflare Pages.

## License

MIT. Copyright © 2026 [Eloy Martínez Cuesta](https://eloymartinezcuesta.com). Replace the example identity, content, and links before redistribution.
