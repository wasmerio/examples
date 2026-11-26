---
name: site-content
description: Add or localize blog posts and product docs in the astro-content-hub Astro site. Use when creating/editing markdown content under src/content/, adding a new product's docs, or adding a new language. Covers the en-default + zh-Hans i18n pattern, slug contracts, fallback behavior, and build verification.
---

# Content authoring for astro-content-hub

This site is an Astro 7 static site (`output: 'static'`) deployed to GitHub
Pages and Cloudflare Pages from `main`. Content is markdown in `src/content/`,
routed by file-based pages under `src/pages/`, and localized with a
locale-prefix scheme: default `en` has no prefix, other locales live under
`/<locale>/...` (currently `zh-Hans`).

All artifacts written into the repo must be **English** in source comments and
code; locale-specific content (markdown body, UI strings) is the only exception.
See `AGENTS.md`.

## Before changing anything

1. Read `AGENTS.md` for repo conduct (no `git push`, no dep installs without
   authorization, small focused changes).
2. Read `src/lib/i18n.ts` (locales, `t`/`home`/`productCopy` dictionaries),
   the `products` array in `site.config.ts` (repo root), and
   `src/content.config.ts` (collection generation) to see
   the current shape.
3. Run `npm run build` to confirm a clean baseline before you start.

## The i18n model (read this once)

- `site.config.ts` (repo root) is the instance config: the `site` block
  (`orgUrl`, `nav.links` custom nav entries, `footer.links` footer columns)
  and the `products` registry (the list of products that ship docs + a
  landing card). `src/lib/i18n.ts`
  holds the machinery around it: `locales`, `defaultLocale`,
  `t` (small UI strings), `home` (landing copy), `productCopy` (product page
  copy).
  Locale codes are BCP-47-style; the non-default locale is `zh-Hans` (script
  subtag included), so URLs are `/zh-Hans/...`.
- `src/content.config.ts` auto-generates collections by looping
  `products × locales` for docs, `locales` for posts, and `locales` for product
  landing info (`product-info`). Collection names use a PascalCase locale
  suffix via `collectionSuffix()` (e.g. `zh-Hans` -> `postsZhHans`,
  `viteDocsZhHans`). Adding a product or locale is a one-line change there.
- `src/lib/content.ts` owns path generation + fallback rendering for both docs
  and posts. Route files are thin and delegate to it.
- Product pages are **dynamic**: `src/pages/[product]/...` serves every product
  in the `products` array for the default locale, and
  `src/pages/[locale]/[product]/...` serves every non-default locale. You do
  **not** create per-product or per-locale route files.
- Non-default-locale routes are **universal**: `src/pages/[locale]/...` loops
  `locales` (minus the default) in `getStaticPaths`, so one set of route files
  serves every non-default locale. Adding a locale needs **no new route files**.
- **Slug contract**: a doc/post's `id` is its path relative to the collection
  base. `en/getting-started.md` and `zh-Hans/getting-started.md` both have
  `id = "getting-started"`. Fallback matches on this id, so **keep filenames
  identical across locales** (only the body differs).
- **Fallback** is per-page, content-level (not a redirect): a missing `zh-Hans`
  page renders the `en` body inside a `zh-Hans` shell (nav/breadcrumb/`lang` stay
  `zh-Hans`), with a visible "此页暂无中文翻译" notice. The URL stays
  `/zh-Hans/...`.

## Task: add or edit a blog post

Posts live in `src/content/posts/<locale>/`. Nested dirs are supported and
become part of the slug (e.g. `posts/en/mytool/foo.md` -> `/posts/mytool/foo/`).

**Frontmatter schema** (`postSchema` in `content.config.ts`):

```yaml
---
title: "Post Title"          # required
date: 2025-07-21             # required, YYYY-MM-DD
description: "One-line summary."  # required
tags: ["announcement"]       # optional, defaults to []
author: "Your Name"          # optional
source: "https://github.com/owner/repo"  # optional, link to source
draft: false                 # optional, defaults to false; drafts are excluded
---
```

Steps:
1. Create `src/content/posts/en/<slug>.md` with the frontmatter + body.
2. For a Chinese version, create `src/content/posts/zh-Hans/<slug>.md` (same
   path under `zh-Hans/`). If you omit it, the `en` post still appears on
   `/zh-Hans/posts/` with an `EN` badge and renders the English body on
   `/zh-Hans/posts/<slug>/`.
3. Internal links inside a `zh-Hans` post should target `/zh-Hans/...` paths.
4. Run `npm run build`. No route file changes needed - routes already exist at
   `src/pages/posts/[...slug].astro` (default) and
   `src/pages/[locale]/posts/[...slug].astro` (non-default locales).

## Task: add a doc page to an existing product

Docs live in `src/content/docs/<product>/<locale>/`. Products come from the
`products` array in `site.config.ts` (repo root) (samples: vite, astro,
json-server).

**Frontmatter schema** (`docSchema`):

```yaml
---
title: "Page Title"          # required
description: "Short summary" # optional
order: 2                     # optional, defaults to 0; controls sidebar sort
---
```

- `index.md` is the product's docs landing page (served at `/<product>/docs/`,
  not `/<product>/docs/index/`). It is always sorted first in the sidebar
  regardless of `order`; `order` controls the rest.
- Other pages are sorted by `order`, then by `title`.

Steps:
1. Create `src/content/docs/<product>/en/<slug>.md`.
2. For Chinese, create `src/content/docs/<product>/zh-Hans/<slug>.md` (same
   slug). Missing `zh-Hans` pages fall back to `en` body + notice.
3. Internal links in a `zh-Hans` doc should target `/zh-Hans/<product>/docs/...`.
4. Run `npm run build`. No route changes - the dynamic catch-all
   (`src/pages/[product]/docs/[...slug].astro` and the universal
   `src/pages/[locale]/[product]/docs/[...slug].astro`) picks it up automatically.

## Task: add a product landing page (auto-generated)

A product's landing page has three tiers, in order of precedence:

1. **Hand-written override** - `src/components/product-landing/<slug>.astro`
   renders fully custom `<main>` sections. Highest precedence.
2. **Auto-generated from `product-info`** - a structured Markdown file at
   `src/content/product-info/<locale>/<slug>.md` whose frontmatter drives a
   rich landing (hero + tagline, highlights, install snippet, feature grid, an
   optional `.prose` overview body, and a CTA).
3. **Minimal default** - `ProductLandingDefault.astro` renders a hero + CTA.
   Lowest precedence, used when neither of the above exists.

Products without a `product-info` file look exactly as before (tier 3).

**Frontmatter schema** (`productInfoSchema` in `content.config.ts`):

```yaml
---
tagline: "One-line subtitle under the product name."   # required
description: "Short summary for <meta> and cards."       # required
features:                                                # optional; feature grid
  - title: "Feature name"
    body: "One or two sentences."
install: |                                              # optional; code snippet block
  npm install -g my-tool
highlights:                                              # optional; stat/label row
  - label: "License"
    value: "MIT"
links:                                                  # optional; extra action buttons
  - label: "Website"
    href: "https://example.com"
---

<!-- Optional body: a curated overview, rendered as styled prose. -->
```

Steps:
1. Create `src/content/product-info/en/<slug>.md` (the `<slug>` is the
   product's slug from `site.config.ts` (repo root), used as the filename).
2. For Chinese, create `src/content/product-info/zh-Hans/<slug>.md` (same
   filename). Missing `zh-Hans` falls back to `en` body + notice, like docs.
3. Run `npm run build`. No route changes - `ProductLandingDefault.astro`
   resolves the product-info file at render time (via
   `getLocalizedProductInfo()` in `lib/content.ts`) and renders the rich
   landing when present.

**Note for per-product themes:** a `product-info` landing inherits the
product theme tokens (see `data-product` / `product-themes/`) because it reads
`var(--color-*)`, so an auto-generated landing and a themed product compose
for free. A hand-written override also inherits themed tokens.

## Task: add a new product's docs

This is the only task that touches config, not just content. Suppose the
product is `mytool`.

1. **Register the product** - edit the `products` array in `site.config.ts`
   (the `products` array used to live in `src/lib/i18n.ts` and later in
   `src/config/products.ts`; it now lives at the repo root):
   ```ts
   export const products: Product[] = [
     { slug: 'mytool', name: 'MyTool', github: 'https://github.com/owner/mytool', badges: ['Tool'], featured: true, description: { en: 'A short one-liner.', 'zh-Hans': '一句话简介。' } },
   ];
   ```
   This auto-generates `mytoolDocsEn` / `mytoolDocsZhHans` collections and a
   landing card on the home page, the footer, and the `/products` catalog
   (+ a nav dropdown entry when `featured: true`).

2. **Add content**:
   ```
   src/content/docs/mytool/en/index.md
   src/content/docs/mytool/en/getting-started.md
   src/content/docs/mytool/zh-Hans/index.md   # optional; falls back to en
   ```

3. **Routes are automatic.** Because product pages are dynamic
   (`src/pages/[product]/...` + `src/pages/[locale]/[product]/...`), no new
   route files are needed. The landing page and docs render every registered
   product, for every locale.

4. Run `npm run build` and verify both `/mytool/docs/` and
   `/zh-Hans/mytool/docs/` render, and that a missing `zh-Hans` page falls back
   to `en` with a notice.

## Task: add a new language

Adding a locale is a **data-only change** - no route files are created or
mirrored, because non-default routes are universal (`src/pages/[locale]/...`
loops `locales`). Suppose adding `ja`.

1. **`src/lib/i18n.ts`**: append `'ja'` to `locales`, and add `ja` blocks to
   every `Record<Locale, …>` table: `localeLabel`, `localeCode`, `t`, `home`,
   and `productCopy`. Because every table is typed `Record<Locale, …>`,
   forgetting one (or letting its keys drift from the `en` seed) is a compile
   error - `astro check` will not pass until `ja` is filled in everywhere.

2. **Create the content dirs** (collections auto-generate from `locales`):
   ```
   src/content/posts/ja/
   src/content/docs/<product>/ja/
   ```

3. **No route changes.** `src/pages/[locale]/...` already loops `locales`, so
   `ja` pages are served at `/ja/...` automatically. Layout/Nav/Footer infer the
   locale from the URL via `localeFromPath` and look up `t[locale]`; the
   `LocaleSwitcher` lists every locale in `locales`, so it picks up `ja`
   automatically. `localeFromPath`'s regex matches both 2-letter prefixes
   (`/ja/...`) and subtagged ones (`/zh-Hans/...`).

4. Run `npm run build`. Verify a `/ja/...` page renders and the switcher offers
   the new language. (With no `ja` content, every `/ja/...` page is a fallback
   to `en` inside a `ja` shell - which is a valid way to confirm routing works
   before translating.)

## Task: validate your content before committing (pre-commit gate)

Single-file frontmatter is validated by zod at build time; **cross-file** rules
live in a stdlib-only checker at `skills/site-content/scripts/validate-hub-content.mjs`,
run via `npm run validate:content`. It is the pre-commit gate for content
providers and also runs in CI before `npm run build`.

- **Errors (exit non-zero - fix before opening a PR):**
  - Duplicate slugs within one locale, including nested-dir collisions
    (`foo.md` + `foo/index.md` map to the same page; Astro builds either way
    but silently drops one, so this is caught here).
- **Warnings (reported, exit 0 - review, fix when not intentional):**
  - A non-default-locale slug with no default-locale counterpart (breaks
    fallback - the default-locale route is simply absent).
  - A product+locale docs collection with some docs but no `index.md`.
  - A `product-info/<locale>/<slug>.md` whose slug isn't in the `products`
    array (it renders nothing).
- **Info:** drafts (excluded from the build).

Each issue prints `file -> field -> offending value -> fix hint`. The checker
walks `src/content/` plus any product `base` override (e.g. `./docs` for the
hub's own docs) and reads locales from `src/lib/i18n.ts` and products from
the root `site.config.ts`.

## Verification (always run before declaring done)

```bash
npm run validate:content   # cross-file rules; must exit 0 (0 errors)
npm run build
```

Must pass with **0 errors, 0 warnings, 0 hints** (the build runs `astro check`).
Then spot-check `dist/`:

```bash
# A localized page has the right lang and hreflang alternates
grep -o '<html lang="[^"]*"' dist/zh-Hans/vite/docs/getting-started/index.html
grep -c 'rel="alternate"' dist/zh-Hans/vite/docs/getting-started/index.html  # expect 3

# A fallback page shows the notice but keeps zh-Hans lang
grep -c '此页暂无中文翻译' dist/zh-Hans/posts/localized-sample/index.html
```

## Common pitfalls

- **Slug mismatch across locales**: `en/foo.md` and `zh-Hans/Foo.md` produce
  different ids and break fallback. Keep filenames byte-identical.
- **Linking to `/<product>/docs/...` from a `zh-Hans` page**: use
  `/zh-Hans/<product>/docs/...` so users stay in the localized shell. The home
  and product pages use `localizePath()` for this; inside markdown, write the
  localized prefix explicitly.
- **Forgetting `order`**: the sidebar sorts by `order` then title. New docs
  with default `order: 0` cluster together; set explicit values for a stable
  order.
- **The `index` slug is special**: never link to `/<product>/docs/index/`; it
  does not exist. `buildNav` maps the index doc to the base path
  (`/<product>/docs/`) automatically.
- **Don't create per-locale route files**: non-default locales are served by the
  universal `src/pages/[locale]/...` tree. Mirroring it per locale (e.g. a
  `src/pages/ja/` tree) is both unnecessary and wrong.

## Reference: where things live

```
src/lib/i18n.ts          locales, dictionaries (t/home/productCopy), helpers
src/lib/content.ts       localized path + render helpers (docs + posts)
src/lib/docs.ts          buildNav (sidebar) - index -> base path, sort by order
site.config.ts (repo root)  site block + products[] registry
                            (orgUrl, nav.links, footer.links)
src/content.config.ts    collection generation (declarative, loops products×locales)
src/components/          Layout (lang/hreflang), Nav/Footer (URL-inferred),
                         DocsLayout, PostCard, LocaleSwitcher
src/pages/               en routes (no prefix) + [locale]/ routes (/<locale>/ prefix)
                         [product]/... are dynamic, serving every product
src/content/docs/<prod>/<locale>/   docs markdown
src/content/posts/<locale>/          posts markdown (nested dirs ok)
src/content/product-info/<locale>/<slug>.md   product landing info (auto-gen)
```
