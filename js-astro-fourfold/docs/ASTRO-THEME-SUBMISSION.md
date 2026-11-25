# Astro Theme Submission

This file is the prepared submission copy for the Astro Dev Portal.

## Theme name

A Quiet Publication

## Repository

https://github.com/Liyuk/astro-fourfold

## Demo

https://liyuk.github.io/astro-fourfold/

## Short description

A static-first personal publication theme for Astro with writing archives, columns, tags, projects, research notes, photo essays, search, favorites, RSS, and GitHub Pages support.

## Full description

A Quiet Publication is a reusable Astro theme for independent writers, engineers, researchers, and creators. It treats a personal website as a small publication instead of a chronological post list.

The theme separates content types from reading paths:

- writing for the chronological archive;
- columns for ordered, guided reading;
- tags for lateral exploration;
- projects and research for long-term work records;
- photo essays for visual work;
- start, search, favorites, and RSS for discovery and return visits.

It is static-first and Markdown-first. Astro generates the pages, RSS, sitemap, robots, canonical metadata, Open Graph metadata, JSON-LD, and a static search index at build time. Browser JavaScript is intentionally limited to search, theme selection, local favorites, and link copying.

The starter contains no real author identity, private data, database, server runtime, or vendor lock-in. Site identity, locale, content collections, visual tokens, GitHub Pages base path, and optional integrations are configurable.

## Features

- Markdown content collections
- Writing archive with year pages and pagination
- Ordered columns
- Cross-content tags
- Project lifecycle states
- Versioned research notes
- Photo essays
- Static search index and query URLs
- Browser-local favorites
- Light/dark themes
- RSS, sitemap, robots, canonical, Open Graph, and JSON-LD
- GitHub Pages project-subpath support
- GitHub Actions deployment
- Content consistency validation
- Built-in SVG icon design system
- No database required

## Technical details

- Framework: Astro
- Output: static
- Content: Astro Content Collections, Markdown/MDX
- Language: TypeScript
- Deployment: GitHub Pages, CDN, static hosting
- License: MIT for the theme code (Copyright 2026 Liyuk). `src/data/site.ts` only supplies a replaceable content-license label for the site footer.

## Screenshots

Use `docs/screenshots/theme-cover.png` as the featured theme image. It is a 16:9, 1600×900 preview under the portal's 1280px minimum width and 5MB combined limit.

Additional screenshots:

- `docs/screenshots/homepage.png`
- `docs/screenshots/article.png`
- `docs/screenshots/search.png`
- `docs/screenshots/columns.png`
- `docs/screenshots/projects.png`
- `docs/screenshots/photos.png`

## Submission notes

Astro Dev Portal requires GitHub authentication before the theme submission form is available:

https://portal.astro.build/

After logging in, use this document as the source for the theme name, links, description, and feature list.
