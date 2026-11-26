---
name: awareride-content-sync
description: Organize blog posts and product docs in this external project and sync them into the AwareRide content hub (awareride.github.io). Use when authoring markdown content under posts/ or docs/, adding translations, or setting up the GitHub Action that pushes content to the hub. Covers the en-default + zh-Hans i18n layout, slug contracts, per-page fallback, local validation, and sync workflow setup.
---

# AwareRide Content Sync

This skill is for an **external project** that contributes blog posts or
product docs to the AwareRide content hub (`awareride/awareride.github.io`).
It documents how to organize markdown content here, validate it locally, and
sync it into the hub via a GitHub Action.

The hub is an Astro 7 static site whose content lives under `src/content/`
with a locale-prefixed i18n layout: default locale `en` (no URL prefix) and
`zh-Hans` under `/zh-Hans/...`. The external project mirrors the **locale** layout
(`posts/<locale>/...`, `docs/<locale>/...`). For docs, the product dimension
is injected at sync time from the `PRODUCT` env var (see "Syncing"), so the
external repo stays flat - `docs/en/foo.md`, not `docs/<product>/en/foo.md`.
This keeps relative markdown links working on GitHub: they resolve against
`docs/`, not `docs/<product>/`.

## The layout (mirror the hub)

```
<external-project>/
  posts/
    en/
      hello-world.md            <- /posts/hello-world/ on the hub
      packscope/
        2025-07-20-why-packscope.md   <- nested dirs become path segments
    zh-Hans/
      hello-world.md            <- SAME filename as en/ (slug contract)
  docs/
    en/                         <- product is set via PRODUCT env var in sync-docs.yml
      index.md                <- the product's docs landing page
      getting-started.md
    zh-Hans/
      index.md                <- optional; falls back to en if absent
  landing/                       <- OPTIONAL; one file per locale, drives the auto-generated landing
    en.md                      <- product slug injected at sync: -> product-info/en/${PRODUCT}.md
    zh-Hans.md                 <- optional; falls back to en if absent
  .agents/skills/awareride-content-sync/      <- this skill (copied in)
    SKILL.md
    scripts/validate.mjs
    scripts/apply-delete-list.mjs
    templates/sync-posts.yml
    templates/sync-docs.yml
```

`posts/` maps onto the hub's `src/content/posts/`; `docs/` maps onto
`src/content/docs/${PRODUCT}/` (the product segment is added by sync from
the `PRODUCT` env var, not present in the external repo), so sync copies the
whole locale tree.

## Frontmatter schemas

### Posts (`posts/<locale>/<slug>.md`)

```yaml
---
title: "Post Title"                     # required, string
date: 2025-07-21                        # required, YYYY-MM-DD (parses to a date)
description: "One-line summary."        # required, string
tags: ["announcement", "tooling"]       # optional, defaults to []
author: "AwareRide"                     # optional, string
source: "https://github.com/awareride/packscope"  # optional, link to source
draft: false                            # optional, defaults to false; drafts are excluded from the hub
---
```

### Docs (`docs/<locale>/<slug>.md`)

```yaml
---
title: "Page Title"          # required, string
description: "Short summary" # optional, string
order: 2                     # optional, defaults to 0; controls sidebar sort order
---
```

- `index.md` is the product's docs landing page, served at `/.../docs/`
  (never `/.../docs/index/`). It is always sorted first in the sidebar
  regardless of `order`; `order` controls the remaining pages, then ties
  break by `title`.
- Docs do **not** have `date`, `tags`, `author`, or `draft`.

### Product landing info (`landing/<locale>.md`) - optional

A product can ship a **structured landing page** (hero + highlights + install
snippet + feature grid + an optional curated overview body) instead of the
minimal default. One file per locale at `landing/<locale>.md` (e.g.
`landing/en.md`). The product slug is **not** in the filename - it is injected
at sync time from the `PRODUCT` env var, so the file lands at
`src/content/product-info/<locale>/${PRODUCT}.md` on the hub.

```yaml
---
tagline: "One-line subtitle shown under the product name."  # required
description: "Short summary for <meta> and cards."            # required
features:                                                      # optional; feature grid
  - title: "Feature name"
    body: "One or two sentences."
install: |                                                    # optional; code snippet block
  npm install -g my-tool
highlights:                                                    # optional; stat/label row
  - label: "License"
    value: "MIT"
links:                                                        # optional; extra action buttons
  - label: "Website"
    href: "https://example.com"
---

<!-- Optional body: a curated overview, rendered as styled prose.
     Markdown (headings, code blocks, lists) is supported. -->
```

A hand-written landing override at
`src/components/product-landing/<slug>.astro` (on the hub) always takes
precedence over this file. With no override and no landing file, the product
gets the minimal default landing (hero + CTA).

## The slug contract (critical)

A file's **slug** is its path relative to the locale dir, without `.md`:

| File | Slug |
|------|------|
| `posts/en/hello-world.md` | `hello-world` |
| `posts/zh-Hans/hello-world.md` | `hello-world` |
| `posts/en/packscope/2025-07-20-why-packscope.md` | `packscope/2025-07-20-why-packscope` |
| `docs/en/getting-started.md` | `getting-started` |
| `docs/zh-Hans/getting-started.md` | `getting-started` |

**The slug must be byte-identical across locales.** The hub's fallback renders
the `en` body when a `zh-Hans` page is missing, matched by slug. `en/getting-started.md`
and `zh-Hans/Getting-Started.md` would break fallback. Keep filenames identical.

When you add a localized page, always add the `en` version first - the default
locale is the source of truth and must contain every slug.

## Fallback behavior (how missing translations are handled)

Fallback is **per-page and content-level** - never a redirect:

- A `zh-Hans` page that exists renders the Chinese body, in a Chinese shell
  (`<html lang="zh-Hans">`, Chinese nav/breadcrumb).
- A `zh-Hans` page that is missing still has a URL (`/zh-Hans/.../`) on the hub; that URL
  renders the `en` body inside the Chinese shell, with a visible notice
  ("此页暂无中文翻译,以下显示英文原文。"). Post cards on `/zh-Hans/posts/`
  show an `EN` badge for fallback entries.

So you can ship `en` first and translate incrementally - the site never 404s
on a missing translation, it just shows English with a notice.

## Internal links inside content

- In an `en` post/doc, link to other pages with their default paths:
  `/posts/foo/`, `/packscope/docs/bar/`.
- In a `zh-Hans` post/doc, use the `/zh-Hans/` prefix so readers stay in the Chinese
  shell: `/zh-Hans/posts/foo/`, `/zh-Hans/packscope/docs/bar/`.
- Links to the marketing/product pages follow the same rule.
- External links (https://github.com/...) are locale-agnostic.

## Local validation (run before committing)

A Node script checks frontmatter conformance and the slug contract. It has no
dependencies (pure Node stdlib), so it runs anywhere Node 18+ is available:

```bash
node .agents/skills/awareride-content-sync/scripts/validate.mjs
```

It exits non-zero on any error, so it can gate the sync workflow. It reports:
- missing required frontmatter fields
- invalid `date` / `order` values
- a `zh-Hans` file with no matching `en` file (broken fallback)
- missing `en/` locale dir (the default locale must exist)

Run it whenever you add or rename content files.

## Syncing to the hub

Sync is a GitHub Action that copies `posts/` (and/or `docs/`) into the hub
repo on every push to `main`. It pushes to a dedicated branch and opens a
pull request against the hub's `main`, so content is reviewed before it
ships - nothing lands on `main` directly. The action uses a PAT that has
write access to `awareride/awareride.github.io`.

### 1. Create the PAT (one-time, on the hub side)

Create a fine-grained PAT (or a GitHub App token) on
`awareride/awareride.github.io` with **Contents: write** (to push the sync
branch) **and Pull requests: write** (to open the PR). Add it as a repository
secret named
`DOCS_CENTRAL_HUB_TOKEN` in the **external** project (Settings → Secrets and
variables → Actions → New repository secret).

### 2. Add the workflow(s)

Copy from `awareride-content-sync/templates/`:

- If you contribute posts: copy `sync-posts.yml` to
  `.github/workflows/sync-posts.yml`.
- If you contribute docs: copy `sync-docs.yml` to
  `.github/workflows/sync-docs.yml`, and set the `PRODUCT` env var in it to
  your product name (e.g. `packscope`). The product must be registered on
  the hub (see "Registering a new product").

Both run validation first, then sync. They trigger on pushes to `main` that
touch `posts/**` (sync-posts) or `docs/**` + `landing/**` (sync-docs)
respectively, and can be run manually via the Actions tab
("workflow_dispatch").

### 3. Directory mapping (how the copy works)

| External | Hub |
|----------|-----|
| `posts/` | `src/content/posts/` |
| `docs/` | `src/content/docs/${PRODUCT}/` |
| `landing/<locale>.md` | `src/content/product-info/<locale>/${PRODUCT}.md` (optional) |

The product segment (`${PRODUCT}/`) is added by sync from the `PRODUCT` env
var; it is **not** present in the external repo. This is what lets relative
markdown links inside docs keep resolving against `docs/` on GitHub. The
`landing/` directory is optional (one file per locale) and drives the
auto-generated product landing page; no landing file means the minimal
default landing.

The sync is a merge copy (not a mirror): files present in this project are
added or overwritten in the hub's `src/content/posts/` /
`src/content/docs/${PRODUCT}/`; files that exist only on the hub are left
untouched by the copy. This protects content contributed by other projects
from being removed when one project restructures. To retire a page, see
"Deleting content" below.

### 4. Deleting content (sync-delete.list)

Because the copy never deletes hub-only files, removing a page from this
project does **not** remove it from the hub automatically. To retire content,
use `sync-delete.list` at the external project root:

```text
# sync-delete.list - one path per line, relative to the repo root.
# Blank lines and '#' comments are ignored.
posts/en/old-post.md
posts/zh-Hans/old-post.md
docs/en/legacy-page.md
docs/en/legacy/        # trailing slash = drop the whole directory
landing/en.md          # retires the en landing (mapped to product-info/en/${PRODUCT}.md)
```

Rules:

- Paths are relative to the repo root and match the external file path, so
  they map through the copy (`posts/...` -> `src/content/posts/...`,
  `docs/...` -> `src/content/docs/${PRODUCT}/...`).
- A single `sync-delete.list` can mix `posts/`, `docs/`, and `landing/`
  entries. The `sync-posts` workflow only processes `posts/...` lines and the
  `sync-docs` workflow processes both `docs/...` and `landing/...` lines;
  the other namespace is skipped.
- For `landing/`, the entry is `landing/<locale>.md` (e.g. `landing/en.md`).
  The script applies the PRODUCT rename
  (`landing/<locale>.md` -> `product-info/<locale>/${PRODUCT}.md`), so the
  delete matches the synced file on the hub.
- A trailing slash means "delete the whole directory".
- Unsafe paths (parent traversal `..`, absolute paths, or the bare collection
  root like `posts/`) are rejected with a warning.
- Missing entries (already gone on the hub) are a no-op, not an error.

The deletion is applied by `scripts/apply-delete-list.mjs` after the rsync
copy, so a path in `sync-delete.list` always wins over the copy. If
`sync-delete.list` is absent, the step is a no-op - so this feature is
strictly opt-in.

Both deletions and additions end up in the same reviewable pull request, so a
human still reviews what is removed before it ships.

## Registering a new product (docs only)

A product's docs only render on the hub if the product is registered in the
hub's `src/config/products.ts` `products` array:

```ts
export const products: Product[] = [
  { slug: 'packscope', name: 'Packscope', github: 'https://github.com/awareride/packscope', badges: ['Tool'], nav: false },
  { slug: 'mytool', name: 'MyTool', github: 'https://github.com/owner/mytool', badges: ['Tool'], nav: false },
];
```

This is a **one-time setup on the hub side**, not something this external
project can do via sync. When you introduce a new product:

1. Open a PR (or issue) against `awareride/awareride.github.io` adding the
   product entry to `src/config/products.ts`. **No route files are needed** -
   the hub uses universal dynamic routes (`src/pages/[product]/...` for the
   default locale and `src/pages/[locale]/[product]/...` for non-default
   locales), so one set of route files serves every product and every locale.
   The hub's own `skills/site-content/SKILL.md` documents this for whoever
   owns the hub repo.
2. Once merged, set `PRODUCT` to that name in your `sync-docs.yml` and your
   `docs/` content will sync and render.

Posts have no registration step - dropping a `.md` file into
`posts/<locale>/` is enough; the hub's routes already serve it.

## Hub build constraints (what breaks the hub)

The hub runs `npm run build` (Astro + `astro check`, zero errors expected).
Your content can break the hub build if:

- **Frontmatter types mismatch**: `date` not a parseable date, `order` not a
  number, `tags` not an array of strings. `validate.mjs` catches most of these.
- **Duplicate slugs within a locale**: two files resolve to the same route.
  Astro errors on this.
- **A `zh-Hans`-only slug with no `en` file**: not a build error, but the page
  renders an empty/fallback body and the slug contract is violated.
  `validate.mjs` flags it.
- **Internal links to non-existent pages**: produces a build warning (broken
  link), not an error, but should be fixed.

Run `validate.mjs` locally before pushing to catch all of these except broken
links (the hub's `astro check` reports those after sync).

## Quick reference

```bash
# Validate before pushing
node .agents/skills/awareride-content-sync/scripts/validate.mjs

# Apply a sync-delete.list against a hub checkout (used by the workflows)
node .agents/skills/awareride-content-sync/scripts/apply-delete-list.mjs \
  <hub-collection-dir> <posts|docs>

# Add a post (en + zh-Hans)
#   posts/en/my-post.md
#   posts/zh-Hans/my-post.md   (same slug; omit to fall back to en)

# Retire content: list it in sync-delete.list at the repo root
#   posts/en/old-post.md
#   docs/en/legacy/    (trailing slash = whole dir)

# Add a doc page for product PRODUCT (set in sync-docs.yml; must be registered on the hub)
#   docs/en/my-page.md
#   docs/zh-Hans/my-page.md   (optional)

# Add an auto-generated product landing (optional; drives a rich landing page)
#   landing/en.md             (one file per locale; slug = PRODUCT, injected at sync)
#   landing/zh-Hans.md        (optional; falls back to en)

# Workflows live at .github/workflows/sync-{posts,docs}.yml
# Secret on THIS repo: DOCS_CENTRAL_HUB_TOKEN
```
