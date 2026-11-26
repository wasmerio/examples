---
title: Template Overview
slug: template-overview
description: A warm Astro 6 blog theme with gallery, friends, search, and dark mode.
date: 2026-03-17 10:00:00
lastmod: 2026-06-30 10:00:00
tags:
  - template
  - overview
  - astro
---

**Revamped Astro Zozo** is a sample-first Astro 6 starter theme for editorial blogs, creative portfolios, and personal publishing sites. It builds on the lightweight writing flow of [astro-blog-zozo](https://github.com/ladit/astro-blog-zozo) and adds a warmer visual system, richer content surfaces, and pages that go beyond a simple post list.

## Key features

- Split-hero Home and About layouts for editorial landing pages
- Blog with tags, timeline archives, reading time, and RSS
- Gallery with category walls, viewer pages, notes, and optional character-focus hotspots
- Friends page for curated link cards
- Pagefind full-text search
- Light and dark mode with a persistent theme toggle
- KaTeX math support, Shiki code highlighting, and dynamic Open Graph images
- Giscus comments support (hidden by default until configured)

## Who it is for

This theme works well if you publish long-form writing, maintain a visual gallery, or want a personal site that feels more like a magazine than a barebones blog starter.

## What changed from Astro Zozo

Compared with the original Astro Zozo baseline, this branch keeps the fast writing workflow intact while adding:

- a warmer light and dark theme with a more deliberate surface system
- a Friends page for curated links
- a Gallery route with category walls, notes, and optional character-focus interactions
- a more compact mobile menu
- a content structure that is easier to replace with your own markdown and media

It also keeps explicit attribution to the upstream lineage instead of pretending the project appeared from nowhere.

## Getting started

1. Clone the repository
2. Run `bun install` or `npm install`
3. Run `bun run dev` or `npm run dev`
4. Replace branding in `src/config.ts`, posts in `src/content/posts/`, gallery entries in `src/content/gallery/`, and friends data in `src/data/friends.ts`

If you are turning this into your own site, the main things to replace are branding, posts, gallery entries, and social links. Sample photos in this branch are from [Unsplash](https://unsplash.com).

## Credits

This project is a derivative of [astro-blog-zozo](https://github.com/ladit/astro-blog-zozo) by Ladit, inspired by [hugo-theme-zozo](https://github.com/varkai/hugo-theme-zozo).
