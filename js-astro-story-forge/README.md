<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Story Forge](https://github.com/fishbaby1011/StoryForge) Astro theme by fishbaby1011, copied from commit `7cc1b30eccb04ff8fd39e827178b1fd6e39ebeb5` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-story-forge.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [fishbaby1011](https://github.com/fishbaby1011), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# StoryForge

StoryForge is a production-ready Astro starter for novel publishing and long-form writing websites. It provides a clean content architecture, strong defaults for SEO, and a deployment model that works on any static hosting platform.

This repository is intended to be used as a template. You write content in Markdown, run a build, and deploy the generated static site.

## Table of Contents

- [Why StoryForge](#why-storyforge)
- [Features](#features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Content Authoring](#content-authoring)
- [Configuration](#configuration)
- [Build and Preview](#build-and-preview)
- [Deployment](#deployment)
- [SEO Checklist](#seo-checklist)
- [Customization Guide](#customization-guide)
- [Contributing](#contributing)
- [License](#license)

## Why StoryForge

Most publishing platforms provide distribution but limit ownership and customization. StoryForge is for authors and builders who want:

- Full ownership of content (Markdown in your repo)
- A fast reading experience (static output)
- Predictable deployment (no database required)
- A clean foundation to extend (tags, search, multiple series, analytics)

## Features

- Chapter-based structure suitable for novels and serials
- Astro Content Collections (type-safe content organization)
- Static generation for performance and low operational overhead
- Sitemap generation
- RSS feed generation
- Canonical URL support via `site` configuration
- Minimal reading layout suitable for long text
- Works on any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages, S3)

## Use Cases

- Web novels and serialized fiction
- Author portfolio + writing hub
- Long-form technical writing (essays, guides)
- Documentation with a narrative flow
- Digital gardens focused on structured reading

## Tech Stack

- Astro
- Markdown (MD/MDX depending on your setup)
- TypeScript (optional; depends on your configuration)
- Static Site Generation (SSG)

## Project Structure

Typical structure (may vary depending on how you organize collections):

```
src/
├── content/           Content collections (chapters, posts, series)
├── layouts/           Layouts (BaseLayout, reading layout, etc.)
├── pages/             Routes (index, chapter pages, rss, sitemap, 404)
├── components/        UI components
└── styles/            Global styles (if used)

public/
├── robots.txt         Crawler rules and sitemap URL
└── assets/            Static assets (images, icons, etc.)

astro.config.mjs       Astro configuration (site/base, integrations)
package.json           Scripts and dependencies
```

## Quick Start

### 1) Use as a template

Option A: GitHub template
1. Click "Use this template" on GitHub
2. Create your own repository
3. Clone it locally

Option B: Clone directly

```
git clone https://github.com/fishbaby1011/storyforge
cd storyforge
```

### 2) Install dependencies

```
npm install
```

### 3) Run the dev server

```
npm run dev
```

Default local address:

```
http://localhost:4321
```

## Content Authoring

Write new chapters/posts as Markdown files inside your content directory (for example):

```
src/content/
```

Recommended conventions:

- Use one file per chapter
- Keep stable slugs (do not rename slugs after publishing)
- Include consistent frontmatter fields across chapters

Example frontmatter (adjust to your schema):

```
---
title: "Chapter 1"
date: "2026-02-24"
description: "A short summary for previews and SEO."
series: "My Novel"
chapter: 1
draft: false
---
```

## Configuration

### Set your production site URL (required for correct sitemap/canonical URLs)

Edit `astro.config.mjs` and set:

```
site: "https://your-domain.com"
```

If you deploy under a subpath (for example GitHub Project Pages), set `base`:

- GitHub Project Pages: `base: "/your-repo-name"`

### robots.txt sitemap URL

Update `public/robots.txt` to point to your real domain:

```
Sitemap: https://your-domain.com/sitemap-index.xml
```

### Node version (recommended)

Add a `.nvmrc` file so contributors use the same Node version:

```
20
```

## Build and Preview

Build the static site:

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

## Deployment

StoryForge outputs static files, so deployment is just uploading the generated `dist/` directory.

### Cloudflare Pages

Build command:
- `npm run build`

Output directory:
- `dist`

### Vercel / Netlify

Build command:
- `npm run build`

Output directory:
- `dist`

### GitHub Pages

If using Project Pages (repo subpath), set `base` in `astro.config.mjs`:

- `base: "/your-repo-name"`

Then deploy the `dist/` directory via your preferred Pages workflow.

## SEO Checklist

Before you consider the site "live":

- Set `site` in `astro.config.mjs` to your real URL
- Update `public/robots.txt` sitemap URL
- Verify the sitemap loads in production: `/sitemap-index.xml`
- Verify RSS loads in production (if enabled): `/rss.xml`
- Ensure the 404 page exists (`src/pages/404.astro`)
- Add a favicon and social preview image (Open Graph) if you share links publicly

## Customization Guide

Common extensions:

- Tags and categories:
  - Add fields to your content schema
  - Create listing pages (by tag, by series, by date)
- Search:
  - Static index + client-side search (small sites)
  - External search (Algolia, Meilisearch) for larger sites
- Multi-series:
  - Group chapters by `series` and generate series landing pages
- Analytics:
  - Add Cloudflare Web Analytics, Plausible, or GA4
- Comments:
  - Integrate Giscus/Utterances (GitHub-based) or other providers
- Monetization:
  - Add a sponsor page or donation links
  - Prefer user-friendly monetization patterns that do not violate ad network policies

## Contributing

Contributions are welcome.

- Use issues for bug reports and feature proposals
- Open a pull request with a clear description and rationale
- Keep changes focused and avoid unrelated formatting churn

Suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

MIT License. See `LICENSE` for details.
