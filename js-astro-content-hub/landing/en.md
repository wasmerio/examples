---
tagline: "A content hub that aggregates docs and posts from many repositories into one localized, auto-deployed static site."
description: "Astro Content Hub is a template for aggregating documentation and blog posts from many repositories into one bilingual, searchable, auto-deployed static site."
highlights:
  - label: "License"
    value: "MIT"
  - label: "Stack"
    value: "Astro 7 + TypeScript"
  - label: "Locales"
    value: "en, zh-Hans"
install: |
  npx degit awareride/astro-content-hub my-hub
  cd my-hub
  npm install

  # Run locally
  npm run dev

  # Build for production
  npm run build
features:
  - title: "Data-driven products"
    body: "Add a product to site.config.ts and its docs collection, landing page, nav and footer entries are generated automatically - no per-product route files."
  - title: "Multilingual by default"
    body: "en default locale plus zh-Hans under /zh-Hans/, with per-page fallback: a missing translation renders the English body inside the localized shell, never a 404."
  - title: "Sync content from anywhere"
    body: "External repos contribute docs and posts via GitHub Actions, which push to a review branch and open a PR against the hub - content is reviewed before it ships."
  - title: "Structured product landings"
    body: "An optional landing/<locale>.md per product drives a rich auto-generated landing (hero, highlights, install, features, FAQ), with hand-written .astro overrides for full control."
  - title: "Search & SEO built in"
    body: "Pagefind site search, sitemap with hreflang alternates, llms.txt, RSS, and static build output that deploys to GitHub Pages or Cloudflare Pages."
  - title: "Theme per product"
    body: "Each product can override the site's color tokens for its landing and docs pages via a scoped CSS file - rebrand without touching the machinery."
sections:
  - type: hero
  - type: highlights
  - type: install
  - type: features
    data:
      layout: grid
      eyebrow: "Features"
      title: "What Astro Content Hub gives you"
  - type: docs-preview
  - type: cta
    data:
      primary: { label: "Read the Docs", href: "/astro-content-hub/docs" }
      secondary: { label: "View Source", href: "https://github.com/awareride/astro-content-hub" }
---

**Astro Content Hub** is a static site template that aggregates documentation and blog posts from
many repositories into one site. It is built with Astro 7 (static output, no client-side framework),
TypeScript, and a single global stylesheet - no Tailwind, no CSS-in-JS.

The site is **data-driven**: products live in one `site.config.ts` registry. Registering a product
auto-wires its localized docs collections, its landing page, the nav and footer entries, and the
`/products` catalog. Content is authored in external repositories and **synced in via GitHub
Actions** that open pull requests against the hub, so everything is reviewed before it ships.

It ships bilingual out of the box (**en** default + **zh-Hans** under `/zh-Hans/`) with per-page
fallback, Pagefind search, a sitemap with hreflang alternates, `llms.txt`, RSS, and static deploy
targets for GitHub Pages and Cloudflare Pages.

Use it to run your org's central documentation hub, or fork it to build a per-product docs site on
the same machinery.
