---
title: What Inkfolio is
order: 0
description: The moving parts, the docs map and where every file lives.
---

Inkfolio is a static editorial theme for Astro. Markdown in, static HTML out — no
database, no admin panel, no client-side framework in the bundle.

Two ideas shape everything else:

- **Everything is configuration.** Site name, navigation, footer, languages and
  feature switches live in `site.config.yaml`.
- **Content is files.** Posts, docs, weekly issues and research notes are Markdown
  files under `src/content/`, one folder per collection.

## The docs map

| Section | What it answers |
| --- | --- |
| Getting started | Install it, write a post, deploy it, move an existing blog in |
| Configuration | Every key in `site.config.yaml` and what it changes |
| Content | Frontmatter fields, drafts, images, translations |
| Reference | The full config surface and the answers to "why is this happening?" |

## Project structure

```
site.config.yaml          site name, nav, footer, languages, feature switches
src/
  content/
    posts/                posts (en)
    posts-zh/             posts (zh + zh-Hant, converted at build time)
    docs/  docs-zh/       these docs
    weekly/ research/     the other two collections
  data/
    taxonomy.ts           category covers and blurbs
  lib/
    config.ts             reads site.config.yaml, exposes typed helpers
    docs.ts               docs sidebar: section order and labels
  pages/                  routes; /zh/ and /zh-Hant/ mirror them
  components/             one component per page type
  styles/global.css       design tokens and every rule that ships
public/                   static files: images, og covers, icons, robots.txt
scripts/build.mjs         astro check → astro build → pagefind → seo-check
```

## Two files do most of the work

- `site.config.yaml` — anything a buyer would change first: text, links, theme,
  banner, analytics, SEO defaults.
- `src/content/` — anything a writer would change: posts and pages.

Everything else is the theme itself. You rarely need to touch `src/`.

## Next

- New here: [Install and run](/docs/getting-started/installation/)
- Bringing a blog over: [Migrate an existing blog](/docs/getting-started/migration/)
- Something looks broken: [FAQ](/docs/reference/faq/)
