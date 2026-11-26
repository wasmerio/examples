---
title: Start here — run the theme in three commands
description: Install, preview locally, and put Inkfolio online. No build config to touch.
date: 2026-11-10
cover: /og/posts/en/getting-started.png
pinned: 1
coverAlt: Start here — run the theme in three commands
tags: [setup, deploy]
categories: ['Setup']
---

Inkfolio is a static Astro theme. You need Node.js 20 or newer and nothing else.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes static HTML to dist/
```

The first thing to change is one line in `site.config.yaml`:

```yaml
site:
  url: https://your-domain.com
```

That value becomes the canonical URL, the sitemap and the RSS links. If you skip it the site still builds, but every canonical tag will point at `example.com`.

## Deploying

`npm run build` produces a folder of plain HTML. Any static host works, and none of them need special settings:

- **Cloudflare Pages** — connect the repo, build command `npm run build`, output directory `dist`.
- **Netlify** — same two values, done.
- **Vercel** — it detects Astro by itself.

No server, no database, no API keys. If you later add a contact form, that is a separate service — the theme deliberately ships without one.

## What is in the box

- Home page with your latest posts
- Posts index and article pages
- About page (a Markdown file you edit)
- RSS feed for each language
- Automatic sitemap
- Light and dark mode, remembered per visitor
- Optional Chinese version under `/zh/` with proper `hreflang`

The next post walks through every setting in `site.config.yaml`.
