# AGENTS.md

This file gives coding agents the ground rules for working in this repository.
Read it before making any changes.

## Working with a human

You are collaborating with a **real human developer**, not running unattended.
Treat every change as if a teammate will review it on Monday morning.

- Prefer small, focused, reviewable changes over large sweeps.
- Explain your reasoning and trade-offs, not just the result.
- When something is ambiguous, **ask first** instead of guessing. State your
  assumption explicitly and let the human correct it before proceeding.
- Keep the human in the loop at every non-trivial step: what you are about to
  do, what you did, and what to verify next.

## Language policy

- **All artifacts written into the repo must be in English**, regardless of the
  language used in conversation. This includes source code, comments, commit
  messages, documentation (`.md`), content collection files, and config.
- You may converse with the human in whatever language they use, but never let
  that leak into committed files.
- The only exception is files explicitly marked for another locale, e.g.
  `README.zh.md`, `getting-started.zh.md`. If a file is not clearly scoped to a
  non-English locale, write English.

## Git & deployment boundaries

- You **may** stage and commit locally (`git add`, `git commit`) to group
  logical work.
- You **must not** run `git push`, `git push --force`, or any command that
  writes to the remote (`origin`) on your own. Pushing to remote is initiated
  by the human developer. When work is ready, tell the human and let them push.
- Never amend, rebase, or rewrite history that has already been pushed.
- The `main` branch is protected. The deploy workflow
  (`.github/workflows/deploy.yml`) is triggered manually (workflow_dispatch)
  and publishes to GitHub Pages and Cloudflare Pages. Do not push to `main`
  yourself.

## Dangerous actions require authorization

Before performing any potentially destructive operation, **stop and get
explicit authorization from the human**. This includes, but is not limited to:

- `git push`, `git push --force`, `git reset --hard`, `git rebase`, history
  rewriting, deleting branches or tags.
- Deleting or overwriting files outside the scope of the current task.
- Mass find-and-replace or refactors that touch many files at once.
- Modifying CI/deploy workflows, secrets, or permissions.
- Installing, removing, or upgrading dependencies (`npm install`, changing
  `package.json` / `package-lock.json`).
- Destructive shell commands (`rm -rf`, `chmod`, `sudo`, etc.).
- Anything that changes how the site builds or deploys.

When in doubt, ask. "I think this is safe" is not authorization.

## Project architecture

`astro-content-hub` is a static site built with **Astro 7** (static output),
deployed to GitHub Pages and Cloudflare Pages from `main` via GitHub Actions.
It is an **org & product portal template** built on a content-hub model: the
site gives the organization a front door and every project a landing page,
and aggregates docs and posts from many repositories, synced in via pull
requests.

For the codebase tier map - which files are **Machinery** (fix a bug), which
are **Your site** (edit to rebrand), and which are **Extensions** (optional
hooks) - see [ARCHITECTURE.md](./ARCHITECTURE.md). AGENTS.md stays
conduct/rules; ARCHITECTURE.md is the map.

### Tech stack
- **Framework**: Astro (`output: 'static'`), TypeScript, no UI framework.
- **Styling**: a single global stylesheet `src/styles/global.css` using CSS
  custom properties. No CSS-in-JS, no Tailwind. Component-specific styles live
  in scoped `<style>` blocks, but shared typography (e.g. `.prose`) lives in
  `global.css` so it reliably applies to Astro `<Content />` output.
- **Per-product themes**: a product may override the site's color tokens for
  its landing + `/<slug>/docs/...` pages by adding
  `src/styles/product-themes/<slug>.css` (scoped to
  `html[data-product="<slug>"]`) and an `@import` in
  `product-themes/index.css`. Product routes pass `productSlug` to
  `Layout`/`DocsLayout`, which emits `data-product` on `<html>`. Nav/Footer
  need no changes. See THEMING.md.
- **Markdown**: Shiki with the `css-variables` theme.
- **Node**: 22 (see deploy workflow). Use `npm`, not `pnpm`/`yarn`.

### Directory layout
```
src/
  components/      Astro components (Layout, Nav, Footer, DocsLayout, PostCard,
                   ProductLandingDefault)
  components/product-landing/  Per-product landing overrides, one file per
                   product, filename = product `slug` (e.g. `vite.astro`);
                   auto-discovered, optional - see "Pages & routing".
  content/         Markdown collections (see "Content collections" below)
  content.config.ts  Collection schemas (zod) + glob loaders
  lib/             Shared helpers (e.g. docs.ts — sidebar nav builder)
  pages/           File-based routes (.astro)
  styles/global.css
.astro/            Generated types (do not edit)
.github/workflows/ CI: build + deploy to GH Pages & Cloudflare Pages
examples/          Sample external repos that sync INTO the hub:
                   my-posts/ (posts) and vite-docs/ astro-docs/
                   json-server-docs/ (one docs repo per product). Each carries a
                   skills/site-content-sync/ skill copy, regenerated from the
                   canonical tree examples/_shared/site-content-sync/ via
                   `npm run sync:examples` (see below).
skills/site-content/  Per-hub authoring skill (docs in this repo).
public/            Static assets served as-is (favicon, images, CNAME)
```

### Examples & the sync skill (drift discipline)
- The sample repos under `examples/*` each carry a copy of the
  `site-content-sync` skill. The **single source of truth** is
  `examples/_shared/site-content-sync/` — hand-edit the skill **only** there
  (per-example workflow config lives in `scripts/examples-lib.mjs`). The
  copies under `examples/*/skills/site-content-sync/` and
  `examples/*/.github/workflows/sync-*.yml` are sync output; do not hand-edit
  them.
- `npm run sync:examples` regenerates every example's skill copy and workflows
  from the canonical tree (idempotent).
- `npm run check:examples` gates drift: it byte-compares each copy against the
  canonical tree, compares workflows against the generated templates, and
  re-runs each example's own `validate.mjs` against its content. Run it
  whenever you touch `examples/`, `skills/`, or `scripts/`.

### Pages & routing
- `/` — landing page (`src/pages/index.astro`).
- `/posts`, `/posts/[...slug]` — blog listing + catch-all article route.
- `/<product>` — product landing page, served dynamically from the `products`
  array in `site.config.ts` at the repo root (`src/pages/[product]/index.astro`).
- `/<product>/docs`, `/<product>/docs/[...slug]` — docs index + catch-all route
  rendering Markdown from the `<product>Docs<Locale>` collections. Non-default
  locales are served by universal routes under `src/pages/[locale]/...`, which
  loop `locales` in `getStaticPaths` - one set of route files per locale.

Products are data-driven: add an entry to `products` in `site.config.ts`
(repo root)
and content under `src/content/docs/<product>/<locale>/`; no per-product or
per-locale route files are required.

**Per-product landing overrides.** A product can ship a custom landing page
(distinct `<main>` sections) by adding `src/components/product-landing/<slug>.astro`.
`src/lib/product-landing.ts` eagerly globs that directory at build time and
returns the component for a slug (or `undefined`); both landing routes
(`src/pages/[product]/index.astro` and its `src/pages/[locale]/[product]/index.astro`
twin) render the override when present, otherwise the shared fallback
`src/components/ProductLandingDefault.astro`. The override renders **only the
`<main>` sections** (hero, custom sections, CTA) - the route still owns
`Layout` + `Nav` + `Footer` and the `<head>` (no second document shell). The
override and fallback share one prop contract: `product` (Product), `locale`
(Locale), `c` (ProductCopy, locale-resolved UI strings), and `docsHref`
(base-aware, locale-prefixed docs link). To localize custom copy, the override
branches on `locale` internally; v1 ships one override per product used across
all locales. Per-locale override files (e.g. `vite.zh-Hans.astro`) are a future
extension. Docs subroutes (`/<product>/docs...`) are unaffected and remain
fully data-driven.

### Layout composition
- `Layout.astro` owns the document shell (`<html>/<head>/<body>`, fonts, meta,
  OG tags). Every page should compose it — do **not** hand-write a second
  document shell.
- `Nav.astro` (sticky header) and `Footer.astro` are composed inside `Layout`
  by pages that need them. Both are data-driven from `site.config.ts`:
  `site.orgUrl` (git host CTA), `site.nav.links` (custom nav entries,
  including dropdowns) and `site.footer.links` (footer columns, including the
  `{ type: 'products', limit? }` auto column). The built-in Posts/Products
  skeleton always renders in the nav; edit `site.config.ts` to rebrand or
  add links, not the components.
- `DocsLayout.astro` is a content-region layout: it composes `Layout` +
  `Nav` + `Footer` and adds a sidebar + `.prose` content area. Do not duplicate
  the document shell inside it.

### Content collections
Defined in `src/content.config.ts` with zod schemas:
- `posts` — `src/content/posts/**/*.md`. Schema: `title`, `date`, `description`,
  `tags`, `author?`, `source?`, `draft?`. Nested dirs are supported (id is the
  path relative to the collection base).
- `<product>Docs<Locale>` — `src/content/docs/<product>/<locale>/**/*.md`,
  auto-generated per product in the `products` array. Schema: `title`,
  `description?`, `order` (controls sidebar sort, `index` always first).

Markdown is rendered via `render(entry)` from `astro:content`; pages pass
`<Content />` into a `.prose` container so shared typography applies.

### Prose / Markdown styling
- The `.prose` class in `global.css` is the single source of truth for Markdown
  typography (headings, code blocks, blockquotes, lists, tables, links, images,
  hr). It is global (not component-scoped) so it applies to `<Content />`.
- Article pages use `class="article-body prose"`; docs use `class="prose"`.
- When adding new Markdown-rendering pages, wrap `<Content />` in `.prose`
  rather than writing fresh scoped styles.

### Build & deploy
- `npm run dev` — local dev server.
- `npm run build` — runs `astro check` (type check) then builds to `dist/`.
- `.github/workflows/deploy.yml` is triggered manually (workflow_dispatch):
  it builds, then deploys `dist/` to GitHub Pages and (via wrangler) Cloudflare
  Pages. It no longer runs automatically on push to `main`.
- The deployed origin is set in `astro.config.mjs` `site` (sample:
  `https://awareride.github.io/astro-content-hub`). The template uses
  root-absolute links, so a root deploy (custom domain / Cloudflare Pages)
  needs no `base`; a GitHub Pages project path (`/<repo>/`) requires
  `base: '/<repo>/'` plus base-aware link/asset helpers. A GitHub Pages custom
  domain uses `public/CNAME` (not shipped by default).

## Coding conventions
- Keep components small and composable; prefer passing props over globals.
- Use the CSS custom properties from `global.css` (`--color-*`, `--radius-*`,
  `--shadow-*`, `--transition`) instead of hard-coded values.
- TypeScript is `strict`; do not introduce `any` without reason.
- Imports: prefer relative paths for app code; the `@/*` alias maps to `src/*`.
- Keep `<head>` concerns in `Layout.astro`; pages should not duplicate meta
  tags or font links.

## Verifying your work
Before declaring a task done:
1. Run `npm run validate:content` (cross-file content rules) and fix any errors.
2. Run `npm run build` and confirm it passes with no errors.
3. Check the affected route's rendered HTML in `dist/` if behavior is uncertain.
4. Summarize what changed, what to review, and any follow-ups for the human.

## Content health audit (agent audit brief)
When a task touches content (posts, docs, product-info) or the routes that
render it, audit the hub end to end before claiming done:

1. **`npm run validate:content`** — cross-file rules the zod schemas cannot
   express. Errors (duplicate slugs within one locale, incl. nested-dir
   collisions like `foo.md` + `foo/index.md`) block with a value-echoing
   message naming every file; warnings (slug parity, missing `index.md`,
   product-info for an unregistered product) are reported but do not fail.
2. **`npm run build`** — zod types, route generation, and link rewriting;
   must pass with 0 errors.
3. **Spot-check `dist/`** — a fallback page (`/zh-Hans/...`) renders the `en`
   body inside the `zh-Hans` shell with the translation notice and keeps
   `lang="zh-Hans"` + correct hreflang alternates; `dist/llms.txt` and
   `dist/llms-full.txt` exist and contain the expected default-locale sections.
4. **If the sync skill / examples changed** — run `npm run check:examples`
   (examples-consistency drift guard: skill copies vs the canonical tree,
   workflows vs templates, per-example validation) and fix any drift with
   `npm run sync:examples`.
