---
title: About Aonote
date: 2025-12-01
summary: Design goals, scope, and customization for this Astro port of Aonote.
---

This repository is the **Astro branch** of [runsli/Aonote](https://github.com/runsli/Aonote) (`astro-theme-aonote`): it keeps the original visual design and information architecture while using Astro Content Collections for Markdown and a Node toolchain for static builds.

Upstream Aonote is a Python static generator; this branch targets authors who want the same reading experience inside the Astro ecosystem.

## Design principles

- **Content first:** Clear hierarchy for prose, code blocks, and tables.
- **Static output:** HTML and CSS only—no client-side runtime required for reading.
- **Maintainable:** Posts live in Markdown, styles in CSS, settings in `src/site.config.ts`.
- **Easy to deploy:** Ship the `dist/` folder to Vercel, Netlify, GitHub Pages, or any static host.

## Customization

1. Edit site title, description, author, and `baseUrl` in `src/site.config.ts`.
2. Add or replace posts under `src/content/posts/`.
3. Adjust `src/styles/aonote.css` as needed.
4. Run `npm run build` and preview `dist/`.
