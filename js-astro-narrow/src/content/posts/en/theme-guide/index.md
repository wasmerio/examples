---
title: "Theme Guide"
description: "Configure Astro Narrow from a single tour: site setup, content model, and appearance."
date: 2026-06-27
tags: ["Guide", "Astro"]
toc: true
---

Astro Narrow is a content-first theme: one narrow column, a quiet color system mixed from a single seed, and Markdown that stays plain. Everything you can configure lives in a handful of typed files.

```sh
pnpm install
pnpm dev
pnpm build
```

| File | What it controls |
| --- | --- |
| `src/config/site.ts` | Site identity, navigation, home page, pagination, comments, analytics |
| `src/config/i18n.ts` | Locales and their display names |
| `src/config/theme.ts` | Default theme and the color-picker recipe |
| `src/content.config.ts` | Frontmatter fields for posts, projects, and pages |
| `src/styles/tokens.css` | Paper/ink axioms, seed recipe, type and space scales |

This guide is itself a set of subposts: the folder's `index.md` is the page you are reading, and the other files in the folder are subposts. Open the table of contents in the Dock to see them all — it lists every subpost and nests the current one's headings.
