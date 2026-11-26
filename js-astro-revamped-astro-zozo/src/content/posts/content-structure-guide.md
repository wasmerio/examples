---
title: Content Structure Guide
slug: content-structure-guide
description: A quick guide to the sample folder layout and the fastest path to turning this theme into your own site.
date: 2026-03-15 09:30:00
lastmod: 2026-06-30 10:00:00
tags:
  - content
  - guide
  - gallery
---

Revamped Astro Zozo is a sample-first Astro 6 starter theme for editorial blogs, creative portfolios, and personal publishing sites. It works well if you publish long-form writing, maintain a visual gallery, or want a personal site that feels more like a magazine than a barebones blog starter.

## Where content lives

This template keeps most editable content in a few predictable places:

- `src/content/posts/` for blog posts
- `src/content/gallery/` for gallery entries
- `src/data/friends.ts` for the friends page
- `src/config.ts` for site-wide branding and toggles
- `public/sample/` for logo, hero art, and friend avatars
- `src/assets/sample/` for gallery media and focus portraits

## Getting started

1. Clone the repository
2. Run `bun install` or `npm install`
3. Run `bun run dev` or `npm run dev`
4. Replace branding in `src/config.ts`, posts in `src/content/posts/`, gallery entries in `src/content/gallery/`, and friends data in `src/data/friends.ts`

If you want to publish your own version, start by replacing the sample markdown files and switching the site metadata to your own title, description, and links.

## Sample content policy

The template branch is meant to stay sample-first, so future code merges should prefer reusable structural improvements while keeping personal writing and owned media out of the branch.

Current sample media uses Unsplash photos with credits in gallery frontmatter. Replace those images with your own artwork or redistributable assets before publishing a production site.

## Related docs

- Repository README for setup and deployment
- `docs/getting-started.md` for replacing sample branding and content
- `docs/astro-theme-submission.md` for Astro Themes listing copy
