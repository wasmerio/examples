# AGENTS.md

## Environment

- **Node >= 22.22.0 required** (Astro 7 hard-fails below). Default shell PATH points at `~/.config/nvm/versions/node/v22.17.0` = too old — `pnpm build`/`pnpm check` abort with "not supported by Astro". Prefix correct version:
  `export PATH="$HOME/.config/nvm/versions/node/v22.22.0/bin:$PATH"`
  (`.nvmrc` wants 24.22.1; not installed).
- **pnpm only** (`pnpm-lock.yaml` source of truth). Never npm/yarn.
- `typescript` pinned **^6**: `astro check` errors on TS 7 (tsgo). Don't bump.

## Commands

- `pnpm dev` — dev server. Use background mode:
  ```
  pnpm astro dev --background
  ```
  Manage: `pnpm astro dev stop | status | logs`.
- Stale dev server misses NEW content collections (empty `getCollection('blog')`, 404 on new routes). After adding `src/content/<collection>`, restart dev: `pnpm astro dev stop`, then start again.
- `pnpm check` — typecheck (`astro check`); run before + after changes.
- `pnpm build` — static site to `dist/`; regenerates content types + sitemap.
- Order: `pnpm check` → `pnpm build`.

## Architecture

- **Astro 7 + Bulma 1.0.4** (Sass `@use`), strict TypeScript, SPA navigation via `<ClientRouter />` (soft fade, respects `prefers-reduced-motion`). JS limited to navbar/theme scripts, written with **document-level event delegation** — DOM re-created on every client-side navigation; cached element refs go stale.
- **Content-driven pages**: page text in `src/data/*.ts` (site, services, team, pricing, testimonials); components presentational with typed props; pages assemble. Keep.
- **Blog**: Content Collections via Content Layer — schema `src/content.config.ts`, posts `src/content/blog/`. Import `z` from `astro/zod`, **not** `astro:content` (deprecated in Astro 7, removed in Astro 8; `astro check` warns). Content/type changes regenerate on `check`/`build`.
- **Routes**: `/`, `/about`, `/services`, `/blog`, `/blog/[slug]`, `/contact`, `/rss.xml` (RSS endpoint), `404.astro` (custom 404).

## Styling (Bulma via Sass)

- Single entry: `src/assets/styles/main.scss`. Tokens flow two ways: `@use 'bulma/sass' with (...)` block + `--aw-*` custom properties. Classes prefixed `aw-`. **Never override Bulma classes or use `!important`** — only token/var changes.
- **Theming**: Bulma light/dark themes switch via `data-theme` on `<html>`; `[data-theme='light']` flips `--aw-*` tokens. First visit follows `prefers-color-scheme` (light default); navbar toggle persists to `localStorage`, re-applied on `astro:page-load` (survives SPA nav). BaseLayout `is:inline` head script prevents flash before paint. Don't hardcode colors — use tokens.
- **Sass gotchas (Bulma 1.0.4 + Dart Sass 1.106)**:
  - `@use ... with`: commas separate variable/value pairs → font stack must be parenthesized list: `$family-sans-serif: ('Inter', ...)`.
  - Only some variables configurable (`$primary`, `$link`, `$family-sans-serif`). `$link-hover`, `$text-light`, `$title-color`, `$input-*` don't exist / computed — fine-tune via CSS variables.
  - Bulma 1.x removed `columns is-variable` — use `style="--column-gap: …"`.
  - `astro.config.mjs` silences Bulma legacy `if()` Sass deprecations — keep.

## SEO / deploy placeholders

- Site URL placeholder (`https://example.com`) lives in **three** places, keep in sync: `astro.config.mjs` (`site`), `src/data/site.ts` (`url`), `public/robots.txt` (Sitemap). Canonical/OG/RSS/sitemap derive from `astro.config.mjs`.
- Contact form static: composes `mailto:` to `site.email`. No backend.
- Social share image `public/og-image.png` (`og-image.svg` editable source).
- `public/_headers` ships Netlify security headers (CSP allows Google Fonts + inline scripts/styles; `#`-level CSP changes need re-testing).

## Template repo files

- `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md` mirror repo conventions (keep changelog entry for user-visible changes; point `package.json` `author`/`repository` at real identity before publishing).
- No CI workflow, no test suite: verify `pnpm check` → `pnpm build` → manual browser pass (both themes, mobile, keyboard).

## Documentation

- Full docs: https://docs.astro.build
- Consult guides before related tasks:
  - [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
  - [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
  - [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
  - [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
  - [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)