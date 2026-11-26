# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Reframed the remaining "content-hub template" copy to the **org & product
  portal** story: the README hero tagline, the docs index (both locales), the
  hub's own `product-info` landing copy, the sample docs/posts, and AGENTS.md.
- Aligned repository metadata with that story: the GitHub repository
  description and 19 discovery topics were set on the repo, and
  `package.json` `description`/`keywords` were updated to match (keywords:
  6 → 15).

## [1.0.0] - 2026-08-24

First release of `astro-content-hub`, an **org & product portal** template:
one branded, localized, free-to-deploy static site that gives an organization
a front door, every project a product landing page, and aggregates each
project's docs and posts into a single searchable place.

### Added

- **Org front door** — the landing page introduces the organization itself
  (mission, links, brand) via a config-driven `org` block, localized per
  locale.
- **Product landing pages** — data-driven from the `products` array in
  `site.config.ts`. Every product gets a generated landing page through a
  three-tier ladder (custom override → `product-info` structured landing →
  registry fallback), so even a docs-only product reads as a product.
- **Product landing section system** — a `product-info` content collection
  lets a product compose rich landings (hero, features, install, highlights,
  FAQ, docs preview, social proof) from declarative Markdown.
- **Per-product themes** — a product can override the site's color tokens for
  its landing and docs via `data-product`-scoped CSS.
- **i18n with per-page fallback** — default `en` (no URL prefix) plus
  `zh-Hans` under `/zh-Hans/...`; a missing translation renders the
  default-language body inside the localized shell, never a 404.
- **Docs** — sidebar navigation, table of contents, heading anchors,
  copy-code, and prev/next, across per-locale collections.
- **Posts** — tag pages, related posts, breadcrumbs, and per-locale RSS feeds.
- **Search** — build-time Pagefind index with a custom modal, page-level
  scope filters, and GitHub-style auto-scoped results.
- **SEO & discovery** — canonical URLs, sitemap (hreflang `en`/`zh-Hans`),
  `robots.txt`, a 404 page, and machine-readable `llms.txt` /
  `llms-full.txt`.
- **Interactive Markdown** — plain `.md` files can host buttons, tabs,
  toggles, and SVG charts via inline `<script>` tags, with no hub-side code.
- **Relative-link rewriting** — a build-time plugin rewrites GitHub-friendly
  relative `.md` links into the correct hub routes.
- **Config-driven nav & footer** — rebranding the header/footer is a
  `site.config.ts` edit, not a component edit.
- **Content sync** — external repos author `posts/`/`docs/` and sync in via a
  GitHub Action PR workflow (canonical `site-content-sync` skill + sample
  repos).
- **Validation & drift guards** — `validate:content` cross-file content gate,
  `check:examples` examples-consistency guard, `check:upstream` template
  upgrade drift guard, and a vitest unit suite.
- **Base-path aware** — root-absolute links through a `withBase()` helper, so
  the same site works at a site root or a GitHub Pages project path.
- **Free auto-deploy** — a manual workflow publishes `dist/` to GitHub Pages
  and Cloudflare Pages.
- **Dark mode** — system preference with a manual toggle.

### Changed

- Reframed the template's positioning from "content-hub template" to
  "org & product portal" in the README, `docs/en/vision.md`, and the docs
  index (both locales).
- Isolated instance copy into `src/config/copy.ts`, re-exported from
  `src/lib/i18n.ts`.

### Fixed

- Mobile layout issues across the landing page, nav dropdowns, the search
  modal (safe-area insets, keyboard overlap), and testimonial cards.
- Docs anchor scroll offset below the sticky header.
- Base-path and locale detection under sub-path deploys, and canonical URLs.
- Empty-collection build warnings for docs-less products.

### Removed

- Dead `assets/` directory left over from the pre-Astro site.
