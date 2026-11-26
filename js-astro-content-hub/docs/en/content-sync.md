---
title: "Content sync"
description: "How content from a separate repository is validated and synced into the hub via a pull request."
order: 3
---

This guide explains how content from a **separate repository** gets into the
hub. It mirrors the `awareride-content-sync` skill shipped in this repo (under
`.agents/skills/awareride-content-sync/`). To write content directly in the hub
instead, see [Authoring](./authoring.md).

The hub itself — and the documentation you are reading — follows this exact
model. The `docs/` folder in this repository is synced into the hub as the
`astro-content-hub` product.

## The model

The hub aggregates content from many source repos. An external repo authors
`posts/` or `docs/` in a locale layout; a GitHub Action validates it and opens
a **pull request** against the hub's `main`. A human reviews the PR; when
merged, the hub builds and deploys. **Nothing lands on the hub's `main`
directly** — content is reviewed first.

## The layout (mirror the hub's locale dimension)

```
<external-project>/
  posts/
    en/hello-world.md          <- /posts/hello-world/ on the hub
    zh-Hans/hello-world.md     <- SAME filename as en/ (slug contract)
    en/my-product/foo.md       <- nested dirs become path segments
  docs/
    en/index.md                <- product docs landing page
    en/getting-started.md
    zh-Hans/index.md           <- optional; falls back to en if absent
  .agents/skills/awareride-content-sync/   <- the sync skill (copied in)
  sync-delete.list             <- opt-in deletion manifest (see below)
```

`posts/` maps onto the hub's `src/content/posts/`; `docs/` maps onto
`src/content/docs/${PRODUCT}/`. The product segment is added by sync from the
`PRODUCT` env var, **not** present in the external repo — this keeps relative
markdown links resolving against `docs/` on GitHub.

**Interactivity syncs too.** Because the copy is a straight file copy, any
inline `<script>` inside your Markdown ships with it — so a button, tab, or
chart written in your repo's `docs/en/foo.md` is interactive on the hub with
zero extra setup. Follow the [authoring guidance](./authoring.md#interactivity-in-markdown)
(self-contained, no external requests) and it passes review as-is.

## Frontmatter schemas

Posts (`posts/<locale>/<slug>.md`):

```yaml
---
title: "Post Title"                     # required
date: 2025-07-21                        # required, YYYY-MM-DD
description: "One-line summary."        # required
tags: ["announcement"]                 # optional
author: "Your Name"                    # optional
source: "https://github.com/owner/repo"# optional
draft: false                           # optional; excluded from the hub
---
```

Docs (`docs/<locale>/<slug>.md`):

```yaml
---
title: "Page Title"          # required
description: "Short summary" # optional
order: 2                     # optional, sidebar sort (default 0)
---
```

Docs have no `date`, `tags`, `author`, or `draft`.

## Slug contract

A file's slug is its path relative to the locale dir, without `.md`. The slug
**must be byte-identical across locales** so fallback works (`en/foo.md` and
`zh-Hans/foo.md` both have slug `foo`). Always write the `en` version first.

## Fallback

Fallback is per-page and content-level, never a redirect. A missing `zh-Hans` page
renders the `en` body inside a `zh-Hans` shell with a notice; post cards on
`/zh-Hans/posts/` show an `EN` badge. Ship `en` first and translate incrementally —
the site never 404s on a missing translation.

## Internal links

- In an `en` post/doc, link with default paths: `/posts/foo/`,
  `/<product>/docs/bar/`.
- In a `zh-Hans` post/doc, use the `/zh-Hans/` prefix to keep readers in the Chinese
  shell: `/zh-Hans/posts/foo/`, `/zh-Hans/<product>/docs/bar/`.

## Local validation

A zero-dependency Node script checks frontmatter and the slug contract:

```bash
node .agents/skills/awareride-content-sync/scripts/validate.mjs
```

It exits non-zero on any error, so it can gate the sync workflow. It catches
missing/invalid frontmatter, `zh-Hans` files with no matching `en` file, and a
missing `en/` locale dir. Run it whenever you add or rename content files.

## Syncing to the hub

1. **Create the PAT (one-time, on the hub side).** Create a fine-grained PAT on
   the hub repo with **Contents: write** and **Pull requests: write**. Add it
   as a repository secret named `DOCS_CENTRAL_HUB_TOKEN` in the *external* repo.
2. **Add the workflow.** Copy `sync-docs.yml` (or `sync-posts.yml`) from
   `.agents/skills/awareride-content-sync/templates/` into
   `.github/workflows/`. For docs, set `PRODUCT` to your product name. Both
   validate first, then open a PR.
3. **Directory mapping.** `posts/` → `src/content/posts/`,
   `docs/` → `src/content/docs/${PRODUCT}/`.

The copy is a **merge**, not a mirror: it adds/overwrites the external repo's
files in the hub and leaves other projects' content untouched.

## Deleting content (`sync-delete.list`)

The merge copy never deletes hub-only files. To retire a page, list it in
`sync-delete.list` at the repo root:

```text
# one path per line, relative to the repo root; '#' and blank lines ignored
posts/en/old-post.md
posts/zh-Hans/old-post.md
docs/en/legacy/        # trailing slash = drop the whole directory
```

- Paths map through the copy (`posts/...` → `src/content/posts/...`,
  `docs/...` → `src/content/docs/${PRODUCT}/...`).
- The `sync-posts` workflow only processes `posts/...` lines; `sync-docs` only
  `docs/...` lines.
- A trailing slash removes a directory. Unsafe paths (`..`, absolute, or the
  bare collection root) are rejected.
- Deletions and additions land in the same reviewable PR.

## Registering a new product (docs only)

Docs only render on the hub if the product is registered in the hub's
`products` array (`site.config.ts` at the repo root). This is a **one-time hub-side change** an
owner makes via PR — the external repo cannot do it through sync. Once merged,
set `PRODUCT` in your `sync-docs.yml`. Posts need no registration.

## What can break the hub build

The hub runs `npm run build` (Astro + `astro check`, zero errors expected).
Your content can break it via: mismatched frontmatter types, duplicate slugs
within a locale, a `zh-Hans`-only slug with no `en` file, or internal links to
non-existent pages. `validate.mjs` catches most of these; run it before
pushing.
