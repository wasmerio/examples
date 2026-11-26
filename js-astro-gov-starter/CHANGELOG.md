# Changelog

All notable changes to this starter are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## What the version numbers mean

This is a **template you copy**, not a package you install, so semver is applied
to the contract a template can actually keep: what you have to change in *your*
copy to move to a newer release.

| Bump | Means | Example |
|---|---|---|
| **Major** | The Astro major version changed, the minimum Node version rose, or an existing component's markup, props, or config changed in a way that needs edits in a project already built on this starter. | Astro 6 → Astro 7 |
| **Minor** | New components, pages, content collections, CI gates, or config options. Existing code keeps working untouched. | Adding a new USWDS component wrapper |
| **Patch** | Fixes and dependency bumps within the same Astro major — accessibility fixes, copy corrections, CI repairs, USWDS patch releases. | USWDS 3.13 → 3.14 |

**Every major release line targets exactly one Astro major version**, and a new
Astro major always forces a new line here. The reverse does not hold: a breaking
change of our own starts a new line too, so more than one line can target the
same Astro major. Start from the newest line for the Astro version you want —
see the compatibility table in [README.md](./README.md#pick-a-release). Because
this is a template, upgrading means merging changes into your own fork rather
than bumping a dependency; the "Upgrading" notes in each major release tell you
what to look for.

---

## [Unreleased]

Nothing yet.

---

## [3.0.0] - 2026-08-23

Targets **Astro 7**. Requires **Node.js 22.12 or newer** — both unchanged from
2.x.

Makes the Spanish site actually Spanish. Every service, FAQ, and announcement is
translated, and content collections gain a convention for translating entries.
A major release because the `esQuestion` frontmatter field is gone: a project
that used it still builds without error, but its Spanish FAQ headings silently
revert to English.

No component props, markup, routes, or URLs changed.

### Added

- **Spanish translations for all seed content** — the four services, five FAQs,
  and two announcements, including frontmatter (`title`, `summary`,
  `eligibility`, `keyFacts`) and body prose. Previously `/es/` pages rendered
  the English Markdown, so a Spanish reader got a Spanish shell around English
  content.
- **A translation convention for content collections.** A translated entry is a
  file in a locale subdirectory beside the original — `services/es/snap.mdx`
  next to `services/snap.mdx` — so translators edit real Markdown rather than
  strings in frontmatter, and the body is translatable at all. Both files share
  a URL slug. `entriesForLocale()` in `src/utils/content.ts` resolves the pair,
  falling back to the default locale when a translation is missing, so partial
  translations ship fine and a missing file never breaks the build.

### Changed

- **The plain-language gate is language-aware.** It scored every file with
  Flesch-Kincaid, which is tuned to English syllable counts — Spanish words
  carry more syllables, so plain Spanish scored several grades too high and
  would have failed the gate. Spanish files are now scored with the Fórmula de
  Crawford, which yields a comparable grade level, and the summary reports each
  language separately. English scores are unchanged.
- **`esQuestion` is gone from the FAQ schema.** A Spanish FAQ now lives in
  `faqs/es/` and carries its own `question`, so the parallel field is
  redundant. If you added `esQuestion` entries, move them into `faqs/es/` files.
- **`idToSlug()` strips a leading locale directory** as well as the file
  extension, so `faqs/es/ebt-card.md` and `faqs/ebt-card.md` both resolve to the
  slug `ebt-card`. Paths that are not locale directories are unaffected:
  `services/health/foo.md` still yields `health/foo`.

### Upgrading from 2.x

Only content is affected. If you never used `esQuestion` and have no translated
content, there is nothing to do.

1. **Move `esQuestion` into a translated file.** This is the one change that
   fails silently — the build still succeeds, and the heading quietly reverts
   to English — so check for it even if nothing looks broken:

   ```diff
    # src/content/faqs/ebt-card.md
    ---
    question: How does the EBT card work?
   -esQuestion: ¿Cómo funciona la tarjeta EBT?
    ---
   ```

   ```markdown
   <!-- new file: src/content/faqs/es/ebt-card.md -->
   ---
   question: ¿Cómo funciona la tarjeta EBT?
   tags: [snap, ebt]
   order: 4
   ---

   La tarjeta EBT funciona como una tarjeta de débito…
   ```

   Grep for it first: `grep -rn "esQuestion" src/content/`.

2. **Translate the rest of your content the same way**, if you want to. Put the
   translation beside the original in a locale subdirectory, sharing the slug:
   `services/es/snap.mdx` next to `services/snap.mdx`. Keep `applySlug`,
   `order`, and `related` identical across the pair — they are identifiers, not
   copy. Translations are optional per entry; anything untranslated falls back
   to the default locale.

3. **Expect different plain-language scores for non-English content.** Files
   under a locale directory are now scored with a formula for that language
   rather than Flesch-Kincaid. Spanish scores typically drop by a few grades,
   because they were being overstated before, not because the text changed.

4. **Replace the seed translations** as you replace the seed content. The
   Spanish shipped here describes example programs, and the eligibility figures
   in it are illustrative.

---

## [2.1.0] - 2026-08-23

Targets **Astro 7**. Requires **Node.js 22.12 or newer**.

A bug-fix release for subpath deployments, plus the `/apply/` landing page the
header nav had always promised. No component props, content collection schemas,
or configuration changed, so upgrading from 2.0.0 is a straight merge.

### Fixed

- **Links broke on subpath deployments.** Four places emitted root-relative URLs
  without `withBase()`, so on a GitHub Pages project site (or any deployment
  with a `base`) they pointed above the base path and 404'd: the homepage
  announcement link, the "Apply" call to action on each service detail page,
  the eligibility form's `action`, and the `Pagination` component's page links.
  `Pagination` now applies `withBase()` internally, matching every other
  component that takes an `href`-shaped prop.
- **The homepage announcement link ignored the reader's language.** The Spanish
  homepage linked to the English page. It now resolves through `localizeUrl()`.
- **`localizePath()` corrupted non-site-relative URLs.** An external link, `tel:`,
  `mailto:`, or `#anchor` in content frontmatter got a locale segment glued to
  the front. It now passes those through untouched, like `withBase()` does.

### Added

- **An `/apply/` landing page** in both locales. The header's "Apply" nav item
  pointed at a route that never existed, so it 404'd on every page of the site.
  The page lists the programs that accept applications, what to have ready, and
  how to apply by phone or in person.

### Changed

- **The CI link check now crawls a base-path build**, served from under that
  prefix with directory listings disabled. It previously crawled a build made
  at base `/` behind a server that returned a `200` directory listing for any
  folder without an `index.html` — between them, those two gaps hid every bug
  listed above from a passing build. The base used in CI is deliberately not
  this repo's real Pages subpath, so a hardcoded one would fail the check.
  `scripts/check.sh` runs the same crawl locally.

---

## [2.0.0] - 2026-08-22

Targets **Astro 7**. Requires **Node.js 22.12 or newer**.

This release is dependency maintenance only — no components, pages, routes,
props, or content collection schemas changed. It is a major release because
Astro 7 and the raised Node floor both require action in projects built on
`v1.x`.

### Changed

- **Astro 6.1.7 → 7.2.4.** Brings the Rust compiler, Sätteri Markdown, Vite 8
  with the Rolldown bundler, and streaming rendering.
- **`@astrojs/mdx` 5.0.3 → 7.0.7**, matching the Astro 7 peer range.
- **`@uswds/uswds` 3.13.0 → 3.14.0.**
- **`typescript` 5.9.3 → 6.0.3.** Held at `^6` on purpose: `@astrojs/check`
  0.9.x declares a `typescript: ^5.0.0 || ^6.0.0` peer range and does not yet
  support the TypeScript 7 native compiler.
- **`html-validate` 10.13.0 → 11.9.0**, **`linkinator` 7.6.1 → 8.0.4**,
  **`@astrojs/check` 0.9.8 → 0.9.10**, **`tailwindcss` and
  `@tailwindcss/vite` 4.2.2 → 4.3.3**, **`sass` 1.99.0 → 1.103.1**.
- **Minimum Node.js is now 22.12** (was 18.17.1), required by Astro 7.
  html-validate 11 and linkinator 8 additionally require Node 22.22, so CI
  pins `22.22`.
- **CI now uses pnpm 10** (was pnpm 9) to match the committed lockfile.

### Fixed

- **Lost spaces between inline elements.** Astro 7 changes the `compressHTML`
  default to `'jsx'`, which strips whitespace-only text nodes that contain a
  newline. Eight places relied on that whitespace and lost a required space —
  most visibly the USA Banner, which rendered "A lock(" instead of
  "A lock (". Each now uses an explicit `{' '}`.
- **Double-escaped ampersand** in the component preview page. The Rust compiler
  no longer decodes HTML entities inside component props, so
  `heading="Programs &amp; services"` reached the browser as `&amp;amp;`.

### Upgrading from 1.x

Projects built on `v1.x` should expect to do the following in their own copy:

1. **Move to Node 22.12+** locally and in every CI and deploy workflow.
   Update `engines.node` in `package.json`.
2. **Bump the dependencies** listed above; `pnpm install` regenerates the
   lockfile.
3. **Audit your own templates for lost inline whitespace.** This is the change
   most likely to bite silently, because nothing errors — text just runs
   together. Anywhere an inline element (`<a>`, `<strong>`, `<span>`, `<code>`…)
   is followed by a newline and then more text, insert an explicit `{' '}`:

   ```diff
   - We strive to conform to the
   + We strive to conform to the{' '}
     <a href="https://www.w3.org/TR/WCAG21/">WCAG 2.1 Level AA</a>
   ```

   The fastest way to find these is to build before and after the upgrade and
   diff the rendered text of every page.
4. **Replace HTML entities in component props with literal characters.**
   `heading="A &amp; B"` becomes `heading="A & B"`. Entities inside ordinary
   HTML element content are unaffected.
5. **Check any remark or rehype plugins.** Sätteri is now the default Markdown
   processor and does not run them. This starter configures none, so nothing
   was needed here — but if you added any, install `@astrojs/markdown-remark`
   and set `markdown.processor` to `unified({ ... })`, or port the plugins to
   MDAST/HAST.
6. **Validate your HTML.** The Rust compiler no longer silently repairs
   semantically invalid markup such as a `<div>` inside a `<p>`; it leaves it
   for the browser. The `pnpm ci:check` HTML validation gate will catch these.

### Known issues

- Astro warns at build time that Shiki syntax highlighting uses inline styles
  incompatible with the Content Security Policy this starter configures. This
  predates the upgrade and only affects fenced code blocks in Markdown content,
  of which the seed content has none. If you add code blocks, either set
  `markdown.syntaxHighlight: 'prism'` or add the appropriate hashes to the CSP
  `styleDirective` in `astro.config.mjs`.
- `astro:content` re-exports `z` as deprecated. The content collection schemas
  in `src/content.config.ts` still use it; it works, and migrating means taking
  a direct `zod` dependency pinned to Astro's internal version.

---

## [1.0.0] - 2026-08-22

Targets **Astro 6**. Requires **Node.js 18.17.1 or newer**.

First tagged release. This marks the starter as stable and establishes the
versioning contract described above; it is the last release on the Astro 6
line and receives fixes only.

### Added

- **USWDS 3.x design system** wired through SCSS, with assets copied from
  `node_modules` to `public/uswds/` by `scripts/setup-uswds.mjs` — no
  reimplemented components.
- **20 Astro component wrappers** for USWDS patterns: Accordion, Alert,
  Breadcrumb, CallToAction, Footer, Header, Hero, IconList, LanguageSelector,
  Pagination, ProcessList, Search, ServiceCard, SideNav, SiteAlert,
  StepIndicator, SummaryBox, Table, Tag, USABanner, USAIdentifier.
- **Required federal elements on every page**: the USA Banner
  ("An official website of the United States government") and the USA
  Identifier with its seven required links.
- **Bilingual routing.** English at `/` and Spanish at `/es/`, served from one
  `[...lang]` route file per page rather than duplicated page trees.
- **Content collections** for services, announcements, and FAQs, Zod-typed and
  MDX-ready.
- **Static search** via Pagefind at `/search/`, self-hosted and language-aware.
- **Type-safe environment variables** through `astro:env`, so the same build
  config works for local dev, a GitHub Pages subpath, and a custom domain.
- **Content Security Policy** generated at build time, with Astro hashing the
  inline scripts and styles it emits so `unsafe-inline` is not required.
- **Seven CI quality gates**: TypeScript, HTML validation, axe-core
  accessibility, Lighthouse, link checking, plain language (Flesch-Kincaid
  grade ≤ 8), and USWDS compliance. `pnpm ci:check` runs the non-browser gates
  locally.
- **Agency setup wizard** (`node scripts/init-agency.mjs`) to configure agency
  name, domain, and identifier links in one pass.
- **GitHub Pages deploy workflow**, plus a `public/_headers` example for hosts
  that support response headers.

[Unreleased]: https://github.com/ctrimm/astro-gov-starter/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/ctrimm/astro-gov-starter/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/ctrimm/astro-gov-starter/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/ctrimm/astro-gov-starter/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/ctrimm/astro-gov-starter/releases/tag/v1.0.0
