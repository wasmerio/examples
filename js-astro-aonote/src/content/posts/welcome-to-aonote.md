---
title: Welcome to Aonote
date: 2025-12-01
summary: What astro-theme-aonote is, what it includes, and how to get started.
tags: [intro]
---

**astro-theme-aonote** is an Astro port of [runsli/Aonote](https://github.com/runsli/Aonote): the Python static blog’s layout and Markdown features rebuilt on [Astro](https://astro.build), ready for Vercel, Netlify, GitHub Pages, or any static host.

The goal is not a heavy web app—it is a calm, maintainable writing baseline. Content stays in Markdown, styles in CSS, and the build output is plain static files you can publish anywhere.

## Good fits

- Personal blogs: learning notes, projects, reading lists, long-form thinking.
- Technical notes: snippets, postmortems, tool configs, and workflows.
- Lightweight docs: changelogs, guides, and design decisions.
- Existing Astro sites: reuse Aonote’s layout and Markdown extensions without a Python build script.

If you already use Astro—or want its deploy and plugin ecosystem—this branch is usually simpler than the upstream Python generator.

## Included out of the box

- Home, posts, archive, tags, about, and 404 pages.
- Markdown: GFM, Shiki highlighting, tables, footnotes, task lists, admonitions, and MathML math.
- RSS, Atom, sitemap, canonical URLs, Open Graph, and Twitter cards.
- Light/dark theme, mobile navigation, and in-page table of contents.

## Getting started

1. Edit site name, description, author, and `baseUrl` in `src/site.config.ts`.
2. Add or replace posts under `src/content/posts/` (kebab-case filenames recommended).
3. Tune colors, fonts, and spacing in `src/styles/aonote.css` if needed.
4. Run `npm run dev` locally or `npm run build` to produce `dist/`.
5. Deploy `dist/` to your static host.

To make the site yours, start by replacing this welcome post and `about.md`, then trim the sample posts.

## Upstream mapping

| Upstream (Python) | This branch (Astro) |
| --- | --- |
| `config.py` | `src/site.config.ts` |
| `markdown/` | `src/content/posts/` |
| `templates/base.html` | `src/layouts/BaseLayout.astro` |
| `assets/style.css` | `src/styles/aonote.css` |
| `python autobuild.py` | `npm run build` |

We aim to track upstream Aonote; differences mostly come from Astro’s content and build pipeline. Issues and PRs for parity gaps are welcome.
