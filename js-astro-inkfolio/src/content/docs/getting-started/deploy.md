---
title: Deploy
order: 2
description: Any static host works. Cloudflare Pages, Netlify and Vercel need two settings each.
---

`npm run build` produces a folder of plain HTML in `dist/`. There is no server component.

## Cloudflare Pages

1. Push the repository to GitHub.
2. Pages → Create project → connect the repo.
3. Build command `npm run build`, output directory `dist`.

## Netlify

Same two values: build `npm run build`, publish `dist`.

## Vercel

It detects Astro by itself. Confirm the output directory is `dist`.

## Custom domain

Point the domain at the host, then change `site.url` in `site.config.yaml` and redeploy. The canonical tags, sitemap and RSS all follow that one value — no other file needs editing.

> [!WARNING]
> If you deploy to a preview URL and keep `site.url` pointing at production, preview builds will emit canonical tags pointing at production. That is usually what you want; if it is not, build with `SITE_URL=https://preview.example.com npm run build`.

## What gets published

Everything in `dist/`, including `/sitemap-index.xml` and `/robots.txt`, which are generated from `site.url` at build time.
