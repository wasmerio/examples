---
title: "Overview"
description: "Documentation for the astro-content-hub template — an org & product portal that aggregates docs and posts from many repositories."
order: 0
---

`astro-content-hub` is an **org & product portal** template built on a
content-hub model: it aggregates documentation and blog posts from many
open-source repositories into one **localized, auto-deployed static site**,
gives the organization a front door, and gives every project a product
landing page. It is built with Astro 7 (static output) and
deploys for free to GitHub Pages and Cloudflare Pages.

This documentation is itself **synced content**: it lives in this repository
under `docs/<locale>/` and is pushed into the hub via a pull request, just like
any other product's docs. See [Content sync](./content-sync.md)
for how that works.

## What's in these docs

- [Vision & product philosophy](./vision.md) — why this template
  exists: an org & product portal, not just a docs aggregator.
- [Architecture](./architecture.md) — the Astro site
  layout, routing, content collections, and key modules.
- [Authoring content](./authoring.md) — write posts and
  docs directly in the hub (i18n, slug contract, fallback, adding a
  product/locale).
- [Content sync](./content-sync.md) — contribute content
  from a separate repository via the PR-based sync Action.
- [Deployment](./deployment.md) — point the template at
  GitHub Pages and/or Cloudflare Pages.
- [Upgrading](./upgrading.md) — update a rebranded fork to a new template
  release with minimal migration (git merge + `npm run check:upstream`).
- [Optimization roadmap](./roadmap.md) — a phased plan to close the
  gaps between the template and its vision.

## Why this template

- **Hub + content-sync model.** External projects author `posts/` and `docs/`
  and sync them in via a GitHub Action that opens a PR. One hub, many source
  repos, and nothing lands on `main` without review.
- **i18n with per-page fallback.** Default locale `en` (no URL prefix); `zh-Hans`
  lives under `/zh-Hans/...`. A missing translation renders the default-language
  body inside the localized shell - never a 404.
- **Modern reading UX.** Dark mode, docs table of contents with
  active-section highlighting, prev/next pagination, copy-code buttons, and
  heading anchor links.
- **Content discovery.** Tag pages, clickable tags, related posts, and post
  breadcrumbs.
- **SEO out of the box.** Canonical URLs, sitemap with `hreflang`, RSS feed,
  `robots.txt`, and a custom 404.
- **Free auto-deploy.** Static output publishes to GitHub Pages and
  Cloudflare Pages at no cost.
