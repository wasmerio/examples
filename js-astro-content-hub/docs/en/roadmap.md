---
title: "Optimization roadmap"
description: "A phased plan to close the gaps between the current template and its vision: org front door, stronger default product landings, and positioning."
order: 5
---

> This page is a **plan** that tracks implementation. Each phase is a
> self-contained chunk that was (or will be) done, reviewed, and shipped on
> its own. A ✓ next to a phase means it is merged.

## Why this roadmap exists

The [vision](./vision.md) describes an **org & product portal**: an
organization front door, a branded product page per product, aggregated docs,
all free and upgradable. The template already has the machinery for most of
it — but two gaps keep it from *feeling* like the vision:

1. **There is no org introduction.** The landing page is a hero + product grid
   + latest posts. An organization's own story (mission, team, links) is
   missing, which is the first thing a visitor to an org site expects.
2. **The default product landing is thin.** A product with only docs gets a
   minimal page that reads like a docs index, not a product page. The vision
   promises "write docs, get a good-looking page" — today that is only true
   once a product also ships a `product-info` file (or a custom landing).

## Phase 1 — Org front door (highest value, smallest surface) ✅ DONE

**Goal:** the landing page introduces the *organization*, not just the
products.

**Status:** merged. Implemented as:

- `src/config/copy.ts` gains an `org` block (`eyebrow`, `title`, `mission`,
  `linksLabel`, `links`), per-locale like every other copy table.
- Both landings (`src/pages/index.astro` and its `[locale]/` twin) render a
  **#mission** section between the hero and the latest posts: eyebrow, title,
  mission lead, and a centered link row.
- The copy is re-exported from `src/lib/i18n.ts` (the single import surface
  for copy), so no page needs to import from `config/copy` directly.
- Styles reuse the existing `.section-header`/`.eyebrow`/`.btn` primitives;
  only `.mission-lead` and `.mission-links` were added to `global.css`.

All of it lives in the "Your site" tier (`copy.ts` + landing pages + one
style block) — no Machinery changes.

### Acceptance

- ✓ Landing page shows org mission and links from `copy.ts`, localized
  (both locales render the mission section in the hero → mission → posts
  order).
- ✓ Changing the `org` block in `copy.ts` updates the landing without
  touching components.

### Tasks (as originally scoped)

- Add an `org` block to `src/config/copy.ts`:
  `name`, `tagline`, `mission`, `cta` (label + href), `links` (GitHub, contact,
  etc.). Per-locale, matching the existing `Record<Locale, …>` pattern.
- Add an **"About the organization"** section to `src/pages/index.astro`
  (between hero and latest posts): mission text + a short link row.
- Add a `mission`/`org` section to the default landing template
  `ProductLandingDefault.astro`? **No** — org copy belongs to the org landing
  only. Product landings stay product-focused.
- Keep everything in the "Your site" tier: `copy.ts` + `index.astro` are
  instance files. No Machinery changes required.

## Phase 2 — Stronger default product landing ✅ DONE

**Goal:** a product with **only docs** gets a presentable product page, and a
product with `product-info` gets an even better one — with zero extra work
beyond writing content.

**Status:** merged. Implemented as:

- `ProductLandingDefault.astro`'s fallback branch (no `product-info`) now
  renders a real product page straight from the `Product` registry entry:
  **hero** (name + localized `description` lead + docs/repo buttons),
  **badges** as a highlight-badge trust strip, an **about** section
  (description + Read Docs / View Source), and a CTA. A product with only a
  registry entry (and optionally docs) now gets a presentable page — the
  "write docs, get a page" promise holds without any `product-info`.
- The `product-info` path is unchanged (still the rich landing via the section
  registry); the fallback upgrade is purely additive.
- `docs/en/authoring.md` (+ zh-Hans) now documents the three-tier resolution:
  custom override → `product-info` structured landing → registry fallback,
  and adds a "product-info files" subsection under "Add a new product".

### Acceptance

- ✓ A product with only a registry entry (docs optional) renders a page that
  reads as a product — hero with description lead, badges, about, CTA
  (verified with a temporary no-`product-info` product; the fallback renders
  in both locales).
- ✓ `product-info` files are the documented path to a rich page (authoring.md
  now explains the ladder).
- ✓ No breaking change to existing products (all sample products keep their
  `product-info`-driven landings; build stays 0 errors / 0 warnings).

### Current state (before the change)

- Default (`ProductLandingDefault.astro`): minimal hero + docs link + repo
  link. Reads like a docs index.
- With `product-info`: rich landing (tagline, features, install, highlights)
  via `src/components/landing-sections/*`.
- With a custom override: `src/components/product-landing/<slug>.astro`.

### Tasks (as originally scoped)

- **Upgrade the default landing** (`ProductLandingDefault.astro`) so it uses
  the product's `description`, `badges`, `logo` (already available from the
  `Product` registry) to render a real product card — what it is, why use it,
  quick links (docs, repo, GitHub).
- **Promote `product-info` from "extension" to "recommended default."** In
  `site.config.ts`, allow a product to declare `landing: 'default' | 'info' |
  'custom'` (or just document the upgrade path). Keep Machinery unchanged;
  this is a documentation + sample-content change.
- **Add a sample `product-info` file for every sample product** so adopters
  see the recommended pattern, and update
  `docs/en/authoring.md` to say "docs → good page; add product-info → great
  page."

### Notes on scope

- The original "promote product-info to recommended default" task was
  resolved by **documenting the ladder** in authoring.md rather than adding a
  `landing:` field to the `Product` interface — keeping the Machinery
  interface stable (fewer breaking changes for adopters). Sample products
  already all ship `product-info` files, so no sample-content change was
  needed.

## Phase 3 — Positioning & docs ✅ DONE

**Goal:** the repo *tells* the org-portal story clearly, so the right people
find it.

**Status:** merged. Implemented as:

- **README** reframed from "content-hub template" to "org & product portal":
  it leads with the org front door + per-product landing + aggregated docs,
  then describes the sync/PR mechanism as the means.
- **`docs/en/vision.md`** (+ zh-Hans) added as the "why" — the philosophy
  home — and linked from the README and both docs indexes.
- The docs table in `README.md` and `docs/en/index.md` (+ zh-Hans mirrors)
  now lists Vision and this roadmap.
- The **repository description + topics** were set on GitHub (a repo-settings
  change, not code or docs): the description now leads with the org &
  product portal framing, and 19 discovery topics are attached — `astro`,
  `astro-template`, `static-site-generator`, `docs-generator`,
  `documentation`, `documentation-site`, `markdown`, `typescript`, `i18n`,
  `github-pages`, `developer-portal`, `content-aggregation`, `ssg`,
  `jamstack`, `cloudflare-pages`, `knowledge-base`, `landing-page`, `blog`,
  `open-source`. `package.json` `description`/`keywords` were aligned with
  them so the npm metadata does not drift.

All of it is copy/docs — no Machinery changes.

### Tasks

- **README** — reframe from "content-hub template" to "org & product portal":
  lead with the org front door + per-product landing + aggregated docs, then
  the sync/PR mechanism as the means.
- **`docs/en/vision.md`** — the "why" (this is the philosophy home; link it
  from README and the docs index).
- **Docs index / table** — add `Vision` and this roadmap to the docs table in
  `README.md` and `docs/en/index.md` (with zh-Hans mirrors).
- **Repository description + topics** — ✅ done: description and topics
  updated to the org-portal framing ("org & product portal", "multi-project
  docs", "landing pages"), with `package.json` keywords aligned.

### Acceptance

- ✓ README and docs lead with the org-portal value proposition.
- ✓ `vision.md` and `roadmap.md` are linked from the docs index, in both
  locales.
- ✓ The GitHub repository description/topics match the org-portal framing.

## Phase 4 (deferred) — Versioned docs

**Goal:** support `v1.x`, `v2.x` docs per product (like
[MultiDocumenter.jl](https://github.com/juliacomputing/multidocumenter.jl/) and
[DocBuilder](https://github.com/inful/docbuilder) offer), for SDK/API-heavy
products.

Deferred because the core vision (org + product landing + docs aggregation)
does not require it. When picked up, it should follow the extension pattern:
a `versions` field on a product + a version switcher in the docs layout —
added as an opt-in, not a breaking change.

## Verification for each phase

- `npm run validate:content` — 0 errors (slug parity, index, product-info
  checks).
- `npm test` — full suite passes.
- `npm run build` — 0 errors, 0 warnings.
- Spot-check `dist/` for the affected routes.
- If `examples/` or `skills/` change: `npm run check:examples`.

## How to pick this up

Phases 1–3 are merged and shipped. The only remaining item is the deferred
Phase 4 (versioned docs), which the core vision does not require — pick it up
only if an SDK/API-heavy product needs it, and follow the extension pattern
described above.
