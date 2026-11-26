---
title: Images, icons and the favicon
order: 7
description: "Where pictures live, and how to replace the favicon without breaking tabs, home screens or install prompts."
---

## Pictures

Anything Astro should optimise goes in `src/assets/`. Anything whose path matters goes in `public/`.

| Path | What lives there |
| :--- | :--- |
| `public/avatar.png` | The portrait on the home page and the friends card |
| `public/footer/` | The footer illustration, one file per theme |
| `public/icons/` | Tool icons for the tools page, matched by name |
| `public/og-default.png` | Fallback card when a page has no generated OG image |
| `src/assets/` | Post and doc images, resized at build time |

In Markdown, a relative path is enough: `![alt](../../assets/pic.png)`. Always write real alt text — the SEO check reports images without it, and image search cares as much as screen readers do.

## The favicon

Browsers and home screens want more than one file. Keep these names:

| File | Used by |
| :--- | :--- |
| `favicon.svg` | Modern browsers, sharp at any size — this is the source |
| `favicon.ico` | Old browsers and some feed readers, 16×16 and 32×32 |
| `favicon-32.png` | Tabs that ignore SVG |
| `apple-touch-icon.png` | iOS home screen, 180×180, opaque background |
| `icon-192.png`, `icon-512.png` | Android and install prompts |
| `site.webmanifest` | Ties the icons to the site name and theme colour |

`Base.astro` links all of them, so replacing the files is enough. Keep the mark square and legible at 16px: a wordmark turns to mush.

The manifest carries `name`, `short_name`, `start_url`, `display`, `background_color` and `theme_color`. Match `theme_color` to the accent in `site.config.yaml`, or the mobile status bar will clash with the page.
