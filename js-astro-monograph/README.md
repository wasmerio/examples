<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Monograph](https://github.com/xocothemes/monograph) Astro theme by xocothemes, copied from commit `879081f0824a6d4454911379e0af1dee28b1fba2` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-monograph.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
- **Environment variables:** None.
- **Credit:** theme by [xocothemes](https://github.com/xocothemes), NOASSERTION. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Monograph - Minimal Astro Blog Theme

[![Monograph theme preview](/preview.webp)](https://monograph.xocoweb.workers.dev/)

[![Astro 7](https://img.shields.io/badge/Astro-7-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Configured-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-84cc16?style=for-the-badge)](./LICENSE)

**Live preview:** https://monograph.xocoweb.workers.dev/

Monograph is a free Astro theme for essays, notes, and long-form writing. It is text-first by design: the feed is a reading list rather than a card grid, so titles and excerpts carry the page and covers appear on the post itself. Type is monochrome with a single ink-blue accent held back for links, dates, and hover states, articles read in one centred column, and every hover runs on the same easing curve so nothing calls attention to itself. Categories, navigation, and SEO defaults come from a small set of config files, content is Markdown or MDX validated by Astro content collections, and the output is static: fast pages, crawlable articles, and no framework islands to hydrate.

## Features

- Text-first front page: a large latest post, a whitespace-separated feed with no thumbnails, and a sticky sidebar holding the about blurb, a subscribe form, featured posts, and categories with post counts
- Article pages with a single 720px reading column, a byline that reads "By author in category", a share row above the feature image, copy-link, previous/next navigation, and related posts
- Categories as the only taxonomy: one short configured list, a `/categories/` index with descriptions and counts, and a generated archive per category
- Author, archive, search, about, contact, privacy, and 404 pages, plus RSS, sitemap, and `robots.txt`
- Built-in client-side search with a keyboard-friendly command palette and a dedicated results page — no search service and no database, and nothing listed until the first keystroke
- System-aware light and dark modes behind a header toggle switch, applied before first paint with the reader's choice remembered
- Read time calculated from the post body at build time, so nothing to maintain by hand
- Markdown and MDX content powered by Astro content collections, with dual light/dark syntax-highlighted code blocks (plus a copy button), styled lists, and blockquotes
- Reusable MDX content components — `Callout` (note/tip/warning/danger) and tabbed `CodeGroup` code samples — available in any post with no imports
- Frontmatter validation for titles, excerpts, categories, dates, authors, covers, featured, and drafts
- Sticky header that hides while scrolling down and slides back in on the way up
- Restrained hover motion on one easing curve: titles pick up the accent, inline links wipe an underline in, arrows lean toward their destination, and icon buttons lift
- Optional feature images, capped in height and shown on the post only, never in a feed
- Central site, navigation, category, social, and SEO defaults
- Canonical URLs, sitemap generation, RSS, Open Graph, Twitter/X cards, and JSON-LD
- Accessible skip link, landmarks, labels, a `role="switch"` theme toggle, keyboard-friendly controls, visible focus states, and reduced-motion support
- Provider-neutral newsletter and contact forms that run as working demos until an endpoint is configured
- Tailwind CSS 4 tokens in cascade layers, with no external font requests by default

## Tech Stack

- Astro 7
- Tailwind CSS 4 via the Vite plugin
- TypeScript
- Astro content collections
- `@astrojs/sitemap`, `@astrojs/mdx`, `rehype-slug`
- Sharp for image processing

## Requirements

- Node.js `22.12.0` or newer
- npm

## Getting Started

```bash
npm install
npm run dev
```

Build for production and preview the output:

```bash
npm run build
npm run preview
```

Before deploying, set `siteUrl` in [src/config/site.ts](./src/config/site.ts) — canonical URLs, RSS,
sitemap, social images, and JSON-LD all derive from it.

## Content

Posts live in [src/content/posts](./src/content/posts). Each post is a folder containing an
`index.md` or `index.mdx` and, optionally, a `cover.jpg`:

```yaml
---
title: "Design Tokens That Survive Product Growth"
excerpt: "Tokens work when they describe decisions."
category: "Design Systems" # must match src/config/categories.ts
date: 2026-07-05
updatedDate: 2026-07-11 # optional
author:
  name: "Leah Morgan"
  role: "Design systems and craft"
cover: # optional; shown on the post, never in the feed
  src: "./cover.jpg"
  alt: "Soft gradient mesh"
  creditName: "Credits to Codioful via Unsplash"
  creditUrl: "https://unsplash.com/photos/..."
featured: false # true lists it in the home sidebar
draft: false
---
```

Read time is calculated from the body at build time. The schema in
[src/content.config.ts](./src/content.config.ts) is enforced, so a typo fails the build rather than
shipping a broken page, and `category` must match an entry in
[src/config/categories.ts](./src/config/categories.ts).

Authors come from frontmatter too: posts sharing a `name` are grouped into an author archive
automatically.

## Routes

| Route                                                           | Page                           |
| --------------------------------------------------------------- | ------------------------------ |
| `/`                                                             | Latest post, feed, and sidebar |
| `/posts/[page]`                                                 | Paginated archive              |
| `/post/<slug>/`                                                 | Article                        |
| `/categories/`                                                  | Category index with counts     |
| `/category/<slug>/`                                             | Posts in one category          |
| `/author/`, `/author/<name>/`                                   | Author index and archive       |
| `/search/`                                                      | Full search page (`?q=...`)    |
| `/about/`, `/contact/`, `/privacy/`                             | Starter static pages           |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/search-index.json` | Feeds and generated endpoints  |

## Customization

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for site settings, navigation, categories, authors, the
newsletter and contact forms, search, reading mode, motion, theme tokens, fonts, and icons.

## Support

Monograph is free and provided as-is. Bug reports and questions are welcome as GitHub issues; custom
design and feature work is not included.

## License

MIT — free for personal and commercial projects. See [LICENSE](./LICENSE), which also lists the
licenses of the bundled fonts, icons, and demo images.
