# Future improvements

Items identified during a full template review (June 2026) that were
deliberately deferred. They are ordered roughly by impact. None of them block
using the template today — all quality gates pass — but each one removes a
class of future bugs or unlocks functionality the scaffolding only hints at.

## Completed since the original review

- ~~**Consolidate the English/Spanish page duplication**~~ — **Done.** All
  page pairs now live in `src/pages/[...lang]/`; one route file per page
  generates both `/` and `/es/` URLs via `localeStaticPaths()`, with per-locale
  copy objects colocated in each page. Parity is now structural — a page
  cannot exist in one language and not the other. (The consolidation itself
  surfaced and fixed more drift: the Spanish apply pages had been missing the
  eligibility-requirements alert and income hint.)
- ~~**Search backend**~~ — **Done.** [Pagefind](https://pagefind.app/) indexes
  `dist/` at the end of `pnpm build` and serves language-aware results at
  `/search/` and `/es/search/` (it splits the index per `<html lang>`). The
  help-page search boxes submit there. Note: search only works on a production
  build (`pnpm build && pnpm preview`), not the dev server.

## 1. Single source of truth for the locale set

**Problem:** Adding a third language still requires touching several places
that each know about the `en`/`es` pair, though fewer than before:

- `LOCALES` in `astro.config.mjs`
- the `Locale` type, `locales` array, and `translations` map in
  `src/i18n/utils.ts` (routing is now derived from this — `localeStaticPaths()`
  picks up new entries automatically)
- the hreflang/`og:locale` logic in `src/layouts/BaseLayout.astro`
- `localizeUrl()` and the per-page `prefix` pattern (hardcode the `/es` prefix)
- default footer columns and the language toggle in `Footer.astro` / `Header.astro`
- the per-page `copy` objects in `src/pages/[...lang]/*.astro` (TypeScript
  will flag these once the `Locale` type widens)

**Direction:** Move the locale list (and its OG/hreflang metadata) into a
shared module (e.g. `src/i18n/locales.ts`) imported by both `astro.config.mjs`
and the runtime code; derive the `Locale` type from it
(`type Locale = keyof typeof LOCALES`). Generate hreflang links by mapping over
the list instead of writing one `<link>` per language.

## 2. Unify the site-origin configuration

**Problem:** Absolute URLs (canonical, hreflang, og:url) are built from
`siteConfig.domain` in `src/config/site.ts`, while the build also receives a
`SITE` env var (exposed as `Astro.site`) from the deploy workflow. Two sources
of truth that can disagree — a deploy to a staging domain still emits
`https://agency.gov/...` canonicals.

**Direction:** Prefer `Astro.site` when set and fall back to
`siteConfig.domain`, or validate at build time that they agree. Update
`init-agency.mjs` to set both from one answer.

## 3. Wire the form backends (M3)

The remaining interactive endpoints are accessible scaffolding with no backend:

- **Contact form** (`src/pages/[...lang]/contact.astro`) — `action="#"`, see
  the `TODO (M3)` comments. Options: Formspree, API Gateway + Lambda, agency
  CRM.
- **Apply flow** (`src/pages/[...lang]/apply/[program].astro`) — posts to
  `/apply/check-eligibility`, which does not exist. The M3 plan is client-side
  islands with preserved state per step, plus a real eligibility endpoint.

## 4. Translated content collections

The Spanish routes reuse the English markdown bodies from
`src/content/services/` and `src/content/faqs/` (the schema has `esSlug` /
`esQuestion` hooks, but no Spanish bodies exist). This is now most visible in
the apply pages' "Requisitos generales" alert, which renders English
`eligibility` values on the Spanish page. Decide on a convention — e.g.
`src/content/services/es/snap.md` or per-locale frontmatter — and render the
localized body on `/es/` routes with the English version as an explicit,
labeled fallback.

## 5. Security headers on the chosen production host

`public/_headers` (clickjacking, MIME-sniffing, referrer policy, HSTS) only
takes effect on Netlify/Cloudflare Pages; GitHub Pages ignores it (documented
in README.md and SECURITY.md). Before production launch, either deploy to a
host that supports response headers or front Pages with a CDN that adds them.
Once on HTTPS-stable infrastructure, enable the HSTS line (start with a short
`max-age`).

## 6. CI scaling knobs

Current settings favor coverage over speed; revisit if CI time becomes a
problem:

- The axe-core job tests every built page sequentially in one browser
  session. If the page count grows substantially, shard the URL list across
  parallel jobs or switch to `--crawl`.
- Lighthouse runs 3× per page against the full `dist/`. Scope it to a
  representative URL subset (`lighthouserc.json` → `collect.url`) if the
  matrix gets slow.
- The `/internal/` component preview is excluded from html-validate and
  axe (it intentionally renders components out of document context, e.g.
  multiple `<h1>` Heroes). If a per-component test harness is ever added,
  test components there instead.

## 7. Smaller cleanups

- **Pagefind Component UI:** the search page uses the classic `PagefindUI`
  API; Pagefind ≥ 1.5 recommends the newer web-component UI
  (`pagefind-component-ui.js`) for new integrations. Migrate when convenient.
- **Analytics:** the CSP comments in `astro.config.mjs` explain how to allow
  DAP (`dap.digitalgov.gov`); consider a first-class, documented opt-in.
- **Placeholder content:** the office address, Google Maps link, and TTY
  number in the contact/help pages are sample values; `init-agency.mjs`
  could prompt for them alongside the agency name and domain.
- **README/SECURITY.md overlap:** the GitHub Pages header warning appears in
  both; if it changes, change both (or link one to the other).
- **Spanish legal pages:** the privacy and accessibility statements at
  `/es/privacy/` and `/es/accessibility/` are intentionally summaries linking
  to the English versions (marked with NOTE comments in the page files);
  replace with full translations before launch.
