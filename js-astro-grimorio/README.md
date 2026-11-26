<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Grimorio](https://github.com/sud0pls/Grimorio-astro) Astro theme by sud0pls, copied from commit `aeb59a18123e0445bff48dbae63bd5d249e96ed6` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-grimorio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `SITE_URL`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [sud0pls](https://github.com/sud0pls), NOASSERTION. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Grimorio

A fast, bilingual blog theme for Astro, built for writing of any kind: guides, notes, essays, or a dev log. English and Spanish out of the box, light/dark themes, full-text search, and social images generated at build time. No client-side framework runs the page: Vue powers only the few interactive islands, everything else ships as static HTML.

**[Live demo](https://grimorio-astro.pages.dev)** · built with [Astro](https://astro.build), [Vue](https://vuejs.org) and [Tailwind CSS](https://tailwindcss.com).

> Grimorio ships with example posts and copy so you can see every feature working. Replace them with your own — see [Make it yours](#make-it-yours).

## Features

- **Bilingual.** English at `/`, Spanish at `/es/`, with a language switch that keeps you on the same page. Change the default or add/drop a language from one config file.
- **Writing-first.** Markdown posts with categories, tags, a monthly archive, and pagination. Pair a post across languages by giving both files the same name.
- **Search.** Client-side full-text search over every post, opened with `Ctrl` / `⌘ + K`.
- **Light and dark.** Theme toggle that respects the system preference and `prefers-reduced-motion`, with no flash on load.
- **Generated images.** Each post gets a 1200×630 social card and a wide hero banner rendered from its title and category at build time — no design work per post. Drop an image in `src/assets/banners/` to override the banner for a specific post.
- **SEO without the busywork.** Per-page canonical URLs, `hreflang`, Open Graph and Twitter tags, JSON-LD structured data, a `sitemap.xml` with real `lastmod` dates, per-language RSS, `robots.txt`, and an `llms.txt` summary for AI crawlers.
- **Fast by default.** Static output, inlined critical CSS, hover prefetching, and self-hosted fonts. A clean build scores 100 across the board in Lighthouse.
- **Tested.** A Playwright suite covers navigation, search, theming, i18n, and metadata on both desktop and mobile viewports.

## Tech stack

Astro 7 · Vue 3 (islands only) · Tailwind CSS 4 · TypeScript · Satori + Sharp for image generation · Playwright for tests.

## Quick start

You need **Node.js 24** (22.12 minimum) and **pnpm 10.33**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:4321>.

| Command         | What it does                                    |
| --------------- | ----------------------------------------------- |
| `pnpm dev`      | Start the dev server                            |
| `pnpm build`    | Type-check, then build to `dist/`               |
| `pnpm preview`  | Serve the production build locally              |
| `pnpm check`    | Type-check Astro, Vue, and TypeScript           |
| `pnpm test`     | Build and run the browser tests                 |
| `pnpm format`   | Format the codebase with Prettier               |

## Project structure

```
src/
├─ assets/            Avatar (and optional per-post banner overrides)
├─ components/        Vue islands + Astro layout pieces
├─ content/posts/     Your posts, as es/ and en/ Markdown
├─ data/              Category and projects data
├─ i18n/              UI strings (es.json, en.json) + language config
├─ layouts/           Base and blog layouts
├─ lib/               Image generation, post helpers
├─ pages/             Routes, feeds, sitemap, OG/banner endpoints
└─ styles/global.css  Theme colors and base styles
public/               Favicons, fonts, static SVGs
```

## Make it yours

Everything you'll normally touch lives in a handful of files:

| What                        | Where                                                    |
| --------------------------- | -------------------------------------------------------- |
| Site name, author, nav, links | `src/site.config.json`                                 |
| All interface text          | `src/i18n/es.json`, `src/i18n/en.json`                   |
| Avatar                      | `src/assets/avatar.jpg` (optimized WebP is generated)    |
| Theme colors                | `src/styles/global.css` (`:root` and `:root.dark`)       |
| Posts                       | `src/content/posts/es/`, `src/content/posts/en/`         |
| Projects page               | `src/data/projects.ts`                                   |
| Production domain           | `SITE_URL` in `.env` (see `.env.example`)                |

After cloning, delete the example posts in `src/content/posts/` and the favicons in `public/` you want to replace, then set your domain so the canonical URLs, feeds, sitemap, and social images point at the right place.

### Writing a post

Create `src/content/posts/<lang>/<slug>.md`. Use the **same slug** in `es/` and `en/` so the language switch links the two versions.

```yaml
---
title: "My post"
description: "One or two sentences. Used for SEO and the social card."
date: 2026-09-20
lang: en # must match the folder
category: notes # guides | notes | stories
tags: ["Guides", "Astro"]
featured: false # featured posts are highlighted on the home page
draft: false # drafts are excluded from the build
updated: 2026-10-01 # optional: last-reviewed date, used in the sitemap
---
```

The body is standard Markdown: headings, tables, fenced code (with a copy button and syntax highlighting), blockquotes, and images all work. For diagrams, drop an SVG in `public/` and reference it with a `<figure class="diagram">`.

### Renaming categories

The three example categories are `guides`, `notes`, and `stories`. To change them, edit the list in `src/data/post-options.ts`, the enum in `src/content.config.ts`, and the `category.*` labels in both `src/i18n/*.json`.

### Changing languages

Languages are declared in `src/i18n/index.ts` (`languages` and `defaultLanguage`). To run the site in a single language, keep one entry; to swap the default, change `defaultLanguage`. Keep the sitemap locales in `astro.config.mjs` in sync.

## Deployment

The site is fully static — any host that serves a folder works (Cloudflare Pages, Netlify, Vercel, GitHub Pages, a plain bucket). Set `SITE_URL` to your production origin before building so metadata is correct.

### Cloudflare Pages

1. Push the repo to GitHub.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Build settings:

   | Field                  | Value        |
   | ---------------------- | ------------ |
   | Framework preset       | Astro        |
   | Build command          | `pnpm build` |
   | Build output directory | `dist`       |

4. Add `SITE_URL=https://yourdomain.com` under **Settings → Environment variables**, then add your domain under **Custom domains**.

Cloudflare reads the Node version from `.node-version` and pnpm from `package.json`. Every push to `main` ships a new version.

## Credits

Grimorio is based on [Kanade-Astro](https://github.com/sudoriaa/Kanade-Astro) by sudoriaa, reworked and extended (design, i18n defaults, content, and features).

IBM Plex Sans and IBM Plex Mono are used under the SIL Open Font License; the license texts live in `public/fonts/licenses/`.

The example post images are photos from [Unsplash](https://unsplash.com) (via Lorem Picsum), free to use under the Unsplash License. Replace them with your own in `public/covers/`.

## License

[MIT](./LICENSE).
