---
tagline: "One hub for docs and posts from many repositories — localized, auto-deployed."
description: "An org & product portal template: aggregate documentation and blog posts from many open-source repositories into one fast, localized static site."
highlights:
  - label: "License"
    value: "MIT"
  - label: "Stack"
    value: "Astro 7"
  - label: "Locales"
    value: "2"
install: |
  git clone https://github.com/awareride/astro-content-hub
  cd astro-content-hub
  npm install
features:
  - title: "Hub + content-sync"
    body: "External repos author posts and docs, then a GitHub Action syncs them in via pull request. One hub, many source repos, nothing lands on main without review."
    icon:
      paths:
        - "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5"
  - title: "i18n with per-page fallback"
    body: "Default locale en lives at the root; zh-Hans under /zh-Hans/. A missing translation renders the default-language body in the localized shell — never a 404."
    icon:
      paths:
        - "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"
  - title: "Data-driven products"
    body: "Add an entry to the products array in site.config.ts and the landing page, docs routes, and sidebar generate automatically — no per-product route files."
    icon:
      paths:
        - "M4 5h16M4 12h16M4 19h10"
  - title: "Zero-config styling"
    body: "One global stylesheet on CSS custom properties, shared .prose typography, dark mode. No Tailwind, no CSS-in-JS, no UI framework — just small .astro components."
    icon:
      paths:
        - "M4 6h16M4 12h16M4 18h16"
links:
  - label: "Website"
    href: "https://awareride.github.io/astro-content-hub"
# Real product landing for the hub's own template - every section below is
# a real, working feature of this project, not placeholder copy.
sections:
  - type: hero
  - type: highlights
  - type: install
  - type: features
    data:
      layout: grid
      eyebrow: "What it does"
      title: "A hub, not just a blog"
  - type: stats
    data:
      eyebrow: "By the numbers"
      title: "Small, fast, focused"
      items:
        - { label: "Products", value: "4" }
        - { label: "Locales", value: "2" }
        - { label: "Pages built", value: "65" }
  - type: docs-preview
  - type: testimonials
    data:
      - quote: "A genuinely clean way to aggregate docs and posts from many repos."
        author: "AwareRide"
        role: "Maintainer"
        company: "astro-content-hub"
        rating: 5
        avatar:
          github: "dev-bobsong"
  - type: faq
    data:
      - q: "How does content get into the hub?"
        a: "External repos author Markdown and a GitHub Action opens a pull request. A human reviews it before anything lands on main."
      - q: "Does a missing translation 404?"
        a: "No — it renders the default-language body inside the localized shell with a notice. Ship en first, translate incrementally."
      - q: "What does it cost to deploy?"
        a: "Nothing. Static output deploys to GitHub Pages and Cloudflare Pages for free."
  - type: cta
    data:
      primary: { label: "Read the Docs", href: "/astro-content-hub/docs" }
      secondary: { label: "View Source", href: "https://github.com/awareride/astro-content-hub" }
---

`astro-content-hub` is an **org & product portal** template built on a
content-hub model: it aggregates documentation and blog posts from many
open-source repositories into one **localized, auto-deployed static site**,
gives the organization a front door, and gives every project a product
landing page. Content ships through pull requests, so nothing lands on main
without review.

## Why this template

The hard parts of a content hub — i18n with per-page fallback, typed content
collections, data-driven product routes, and free deployment — are already
solved. You write Markdown; the hub builds and deploys.

## What you get

- **Hub + content-sync model** — one hub, many source repos, PR-based review.
- **i18n with per-page fallback** — `en` at root, `zh-Hans` under `/zh-Hans/`,
  never a 404 on a missing translation.
- **Data-driven products** — add an entry to `site.config.ts`, and the landing,
  docs routes, and sidebar appear automatically.
- **Zero-config styling** — one global stylesheet on CSS custom properties,
  shared `.prose` typography, dark mode.
- **SEO & discoverability** — canonical URLs, sitemap, RSS, `llms.txt`,
  `robots.txt`, custom 404.
- **Reading UX** — docs TOC, prev/next pagination, copy-code buttons, tag
  pages, related posts, breadcrumbs.
- **Free auto-deploy** — a manual workflow publishes to GitHub Pages and
  Cloudflare Pages at no cost.
