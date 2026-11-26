---
title: Install and run
order: 1
description: Get the theme running locally in three commands. Node 20 or newer, nothing else.
---

Inkfolio is a static Astro theme. You need Node.js 20+ and a terminal.

```bash
npm install
npm run dev      # http://localhost:4321
```

That is the whole setup. The dev server reloads on save; Ctrl+C stops it.

## Build the static site

```bash
npm run build    # writes dist/
npm run preview  # serves dist/ locally, same output as production
```

> [!NOTE]
> `npm run build` fails on purpose if a required config value is missing or malformed — a broken `site.config.yaml` never ships silently.

## Before you go further

Open `site.config.yaml` and set at least these three keys:

```yaml
site:
  url: https://your-domain.com
  name: Your Site
  author: Your Name
```

`url` drives canonical links, the sitemap and the RSS feeds. Leave it as `example.com` and every page will tell search engines it lives at example.com.

## Requirements

- Node.js 20 or newer
- npm (bundled with Node)
- No database, no API key, no server

The theme ships four dependencies: Astro, the RSS helper, the sitemap helper, and Font Awesome. Everything else is standard library.

Next: put it online.
