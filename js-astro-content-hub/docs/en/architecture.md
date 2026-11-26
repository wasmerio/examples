---
title: "Architecture"
description: "How the astro-content-hub Astro site is structured: layout, routing, content collections, and key modules."
order: 1
---

This page explains how the `astro-content-hub` site is put together. It is a
reference for contributors working inside a hub repo. Authoring content (rather
than changing the site) is covered in
[Authoring](./authoring.md); syncing content from external
repos is covered in [Content sync](./content-sync.md).

## Tech stack

- **Astro 7** with `output: 'static'`. The whole site is prerendered to `dist/`.
- **TypeScript** in `strict` mode. No `any` without reason.
- **No UI framework.** Components are `.astro` files.
- **Styling:** one global stylesheet (`src/styles/global.css`) built on CSS
  custom properties, plus small scoped `<style>` blocks where needed. No
  Tailwind, no CSS-in-JS.
- **Markdown:** Shiki with the `css-variables` theme.
- **Node 22** (matches the deploy workflow). Use `npm`.

## Directory layout

```
astro-content-hub/            <- the hub (Astro site) at the repo root
├── astro.config.mjs          <- set `site` to your domain
├── src/
│   ├── components/           <- Layout, Nav, Footer, DocsLayout, PostCard, LocaleSwitcher, ProductLandingDefault
│   ├── components/product-landing/  <- optional per-product landing overrides (one file per product, keyed by slug)
│   ├── content/              <- markdown collections (posts + docs)
│   ├── content.config.ts     <- collection schemas + glob loaders
│   ├── lib/                  <- i18n.ts, content.ts, docs.ts, product-landing.ts, remark-rewrite-links.mjs
│   ├── pages/                <- file-based routes (+ [locale]/ universal routes)
│   └── styles/global.css
├── public/                   <- favicon, CNAME
├── .github/workflows/        <- deploy.yml (GitHub Pages + Cloudflare Pages)
├── examples/                 <- sample external repos that sync INTO the hub
└── docs/                     <- this documentation (synced to the hub)
```

## Routing

Routes are file-based under `src/pages/`:

- `/` — landing page (`index.astro`).
- `/posts`, `/posts/[...slug]` — blog listing + catch-all article route.
- `/<product>` — product landing page, served **dynamically** from the
  `products` array in `site.config.ts` (repo root).
- `/<product>/docs`, `/<product>/docs/[...slug]` — docs index + catch-all.
- Non-default locales are served by **universal routes** under
  `src/pages/[locale]/...`, which loop `locales` (minus the default) in
  `getStaticPaths`. One set of route files serves every non-default locale.

Because product and locale pages are data-driven, **you do not create
per-product or per-locale route files.** Add an entry to `products` and the
routes + docs collections are generated automatically.

**Per-product landing overrides.** A product can ship a custom landing page
(distinct `<main>` sections) by adding
`src/components/product-landing/<slug>.astro`. `src/lib/product-landing.ts`
eagerly globs that directory at build time and returns the component for a
slug (or `undefined`); both landing routes render the override when present,
otherwise the shared fallback `src/components/ProductLandingDefault.astro`.
The override renders only the `<main>` sections - the route still owns
`Layout` + `Nav` + `Footer` and the `<head>`. The override and fallback share
one prop contract (`product`, `locale`, `c`, `docsHref`). See
[Authoring - Customize a product landing](./authoring.md#customize-a-product-landing).
Docs subroutes (`/<product>/docs...`) are unaffected.

## Layout composition

- `Layout.astro` owns the document shell (`<html>/<head>/<body>`, fonts, meta,
  OpenGraph). It also emits the canonical URL, `hreflang` alternates, the RSS
  feed-discovery `<link>`, the `theme-color` meta, and a no-FOUC inline script
  that sets the dark/light theme before first paint. Every page composes it -
  never hand-write a second document shell.
- `Nav.astro` (sticky header) and `Footer.astro` are composed inside pages.
  `Nav` holds the locale switcher and the theme toggle.
- `DocsLayout.astro` is a content-region layout: it composes `Layout` + `Nav` +
  `Footer` and adds a sidebar, a `.prose` content area, a right-rail table of
  contents, prev/next pagination, and the copy-code button script.

## Built-in site features

Beyond rendering Markdown, the hub ships these features out of the box:

- **SEO**: canonical URLs, `sitemap-index.xml` (with `hreflang` grouping),
  `robots.txt`, and a custom 404. Driven by `@astrojs/sitemap` and the
  `Layout` head.
- **RSS**: `/rss.xml` (en) and `/zh-Hans/rss.xml` (zh-Hans) via `@astrojs/rss`, built by
  `src/lib/feed.ts` (`src/pages/rss.xml.ts` + `src/pages/[locale]/rss.xml.ts`).
- **Dark mode**: `:root[data-theme='dark']` token block in `global.css`, a
  `ThemeToggle.astro` button, and a no-FOUC `<head>` script reading
  `localStorage` + `prefers-color-scheme`.
- **Reading UX**: heading anchor IDs (`src/lib/heading-ids.mjs`, a Sätteri
  hast plugin), a right-rail `TableOfContents.astro` with IntersectionObserver
  active-section highlight, prev/next docs pagination, copy-code buttons, and
  heading `#` anchor links.
- **Content discovery**: tag pages (`/posts/tags/[tag]`), clickable tags on
  post cards, related posts on article pages, and post breadcrumbs. Tag
  aggregation lives in `src/lib/content.ts` (`getAllTags`, `getPostsByTag`,
  `getRelatedPosts`, `tagSlug`).

## Content collections

Defined in `src/content.config.ts` with [zod](https://zod.dev/) schemas:

- `posts<Locale>` — `src/content/posts/<locale>/**/*.{md,mdx,html}`. Schema:
  `title`, `date`, `description`, `tags`, `author?`, `source?`, `draft?`.
  Nested dirs are part of the slug.
- `<product>Docs<Locale>` — `src/content/docs/<product>/<locale>/**/*.md`,
  auto-generated per product in the `products` array. Schema: `title`,
  `description?`, `order` (controls sidebar sort; `index` is always first).

Markdown is rendered via `render(entry)` from `astro:content`; pages pass
`<Content />` into a `.prose` container so shared typography applies.

## Key modules in `src/lib/`

| File | Responsibility |
|------|----------------|
| `i18n.ts` | Single source of truth: `locales`, `defaultLocale`, `t` (UI strings), `home` (landing copy), `productCopy`, and path/locale helpers. |
| `site.config.ts` (root) | Instance config: the `site` block (`orgUrl`, `nav.links` custom nav entries, `footer.links` footer columns) and the `products` registry (the list of products that ship docs + a landing card). |
| `content.ts` | Localized path generation + fallback render helpers (docs + posts). |
| `docs.ts` | `buildNav` — sidebar construction (index → base path, sort by `order`). |
| `product-landing.ts` | Per-product landing override resolver - eager-globs `components/product-landing/*.astro` keyed by slug; returns the override or `undefined` (falls back to `ProductLandingDefault.astro`). |
| `remark-rewrite-links.mjs` | Rewrites doc links so `docs/<product>/<locale>/` resolves to `/<product>/docs`. |

## Build & deploy

- `npm run dev` — local dev server.
- `npm run build` — runs `astro check` (type check) then builds to `dist/`.
- `.github/workflows/deploy.yml` is triggered **manually** (`workflow_dispatch`):
  it builds, then deploys `dist/` to GitHub Pages and Cloudflare Pages. It does
  not run automatically on push to `main`. See
  [Deployment](./deployment.md).

## Conventions

- Keep components small and composable; prefer props over globals.
- Use CSS custom properties from `global.css` instead of hard-coded values.
- Prefer relative imports for app code; `@/*` maps to `src/*`.
- Keep `<head>` concerns in `Layout.astro`; pages must not duplicate meta tags.
- All committed artifacts are in **English** (source comments, code, docs),
  except locale-specific content.
