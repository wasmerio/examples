# Architecture

> The codebase tier map for the `astro-content-hub` template.
> `AGENTS.md` is the rulebook (how to behave in this repo); this file is the
> map (what lives where, and what editing each file means).

## Three tiers

The template splits into three tiers, named for adopters; the nimbus
(cloudflare/nimbus) terms are kept in parentheses for anyone coming from that
discussion.

| Tier | nimbus term | What lives here | Editing means |
|---|---|---|---|
| **Machinery** | Framework | behavior with (mostly) one correct answer: path/fallback generation, collection wiring, base/locale helpers, route delegation, build validation, sync mechanics | fixing behavior / a bug |
| **Your site** | Starter | visible UI and instance configuration: component look, Nav/Footer/landing layout, global styles, sample copy, the `products` array, sample content | your taste / rebranding |
| **Extensions** | Registry | optional per-product hooks, enabled by a file existing, plus the `examples/*` sample source repos | opting in / adding optional features |

**Boundary test** - when unsure which tier a file belongs to:

- one correct answer -> **Machinery** (it is a bug fix / behavior);
- a user might reasonably want a different answer -> **Your site** (taste);
- not needed on day 1 -> **Extensions** (an optional hook).

## Machinery (fix behavior here)

| Area | Files | Role |
|---|---|---|
| i18n machinery | `src/lib/i18n.ts` | locales, `defaultLocale`, base/locale helpers (`withBase`, `localizePath`, `buildAlternates`, `localeFromPath`), `localeLabel`/`localeCode`. Re-exports the instance copy from `src/config/copy.ts` so imports stay unchanged. |
| Content plumbing | `src/lib/content.ts` | localized path generation + fallback rendering (docs / posts / product-info) |
| Interactive docs | `docs/en/interactive-md.md` | reference: buttons/tabs/icons/charts via inline `<script>` in plain `.md` (no components); `.mdx` accepted minimally via `@astrojs/mdx` |
| Docs-dir resolution | `src/lib/doc-dirs.ts` | single source of truth for which product × locale has a docs dir (content.config.ts registers collections; content.ts / llms.ts skip empty ones - no "empty collection" build warnings for docs-less products) |
| Sidebar | `src/lib/docs.ts` | `buildNav` (index -> base path, sort by `order` then title) |
| Feeds | `src/lib/feed.ts` | RSS builder |
| Landing resolver | `src/lib/product-landing.ts` | per-product landing-override resolver (the Extensions mechanism) |
| Markdown plugins | `src/lib/heading-ids.mjs`, `src/lib/remark-rewrite-links.mjs` | heading ids + link rewriting |
| Collections | `src/content.config.ts` | collection generation (zod schemas, loops products x locales) |
| Routes | `src/pages/**` | thin delegation to `lib/` (en routes + universal `[locale]/` routes) |
| Authoring contract | `skills/site-content/SKILL.md` | per-hub content authoring skill |
| Template CI | `.github/workflows/deploy.yml` | build + GitHub Pages / Cloudflare Pages deploy |
| Upgrade guard | `scripts/check-upstream.mjs` | Machinery drift guard: byte-compares contract files against the latest release tag so adopters know if an upgrade merge is routine or needs reconciliation (see UPGRADING.md) |

## Your site (edit to rebrand)

| Area | Files | Role |
|---|---|---|
| Shell | `src/components/Layout.astro`, `DocsLayout.astro` | document shell + content-region layout (head behavior delegates to i18n helpers; see audit note C) |
| Visible UI | `src/components/Nav.astro`, `Footer.astro`, `PostCard.astro`, `TagPage.astro`, `TableOfContents.astro`, `ThemeToggle.astro`, `LocaleSwitcher.astro`, `ProductLandingDefault.astro` | header, footer, cards, tags, TOC, theme toggle, locale switcher, default landing |
| Instance copy | `src/config/copy.ts` | `siteName`, UI strings (`t`), landing copy (`home`), product page copy (`productCopy`) - **rebrand by editing this file** |
| Instance config | `site.config.ts` (repo root) | the `site` block (`orgUrl`, `nav.links`, `footer.links`) + the `products` array (the `Product`/`NavLink`/`FooterColumn` interfaces are Machinery) |
| Sample content | `src/content/**` | sample posts / docs / product-info (replaceable) |
| Styles | `src/styles/global.css`, `src/styles/theme.css` | tokens + prose (token *names* and `.prose` are the contract - see audit note D) |
| Instance docs | `AGENTS.md`, `README.md`, `THEMING.md`, `CONTRIBUTING.md` | repo docs |

## Extensions (opt in - file exists, feature is on)

| Hook | Enable by | Docs |
|---|---|---|
| Custom landing for one product | `src/components/product-landing/<slug>.astro` | AGENTS.md "Per-product landing overrides" |
| Per-product color theme | `src/styles/product-themes/<slug>.css` + one `@import` line in `product-themes/index.css` | THEMING.md |
| Auto-generated rich landing data | `src/content/product-info/<locale>/<slug>.md` | AGENTS.md "add a product landing page" |
| Sample source repos | copy any `examples/*` repo | `examples/*/README.md` + `skills/site-content-sync/SKILL.md` |

## Edit X to ... (quick table)

| Want to | Edit | Tier |
|---|---|---|
| Rebrand (site name, taglines, UI strings) | `src/config/copy.ts` | Your site |
| Add / remove a product | `site.config.ts` (repo root) | Your site |
| Customize nav / footer links | `site.config.ts` (repo root) `site.nav.links` / `site.footer.links` | Your site |
| Add a language | `src/lib/i18n.ts` (`locales` + `localeLabel`/`localeCode`) and add the locale tables in `src/config/copy.ts` | Machinery + Your site |
| Change the look | `src/components/*`, `src/styles/*` | Your site |
| Fix routing / fallback behavior | `src/lib/content.ts`, `src/lib/i18n.ts`, `src/pages/**` | Machinery |
| Upgrade a fork to a new release | `npm run check:upstream` + merge `upstream/<tag>` (see UPGRADING.md) | Machinery (tooling) |
| Custom landing for one product | `src/components/product-landing/<slug>.astro` | Extensions |
| Theme one product | `src/styles/product-themes/<slug>.css` + barrel line | Extensions |
| Rich auto landing data | `src/content/product-info/<locale>/<slug>.md` | Extensions |
| Author content in the hub | follow `skills/site-content/SKILL.md` | Your site |
| Sync content from an external repo | copy an `examples/*` repo + its sync skill | Extensions |

## Audit notes (boundary decisions)

- **A. Copy vs machinery** - the instance copy (`siteName`, `t`, `home`,
  `productCopy`) lives in `src/config/copy.ts`; `src/lib/i18n.ts` re-exports
  it so every existing `from './i18n'` import keeps working. Rebranding is an
  edit to a config file, not a lib file.
- **B. `site.config.ts`** - the `Product`/`NavLink`/`FooterColumn` interfaces are
  Machinery; the `products` array and the `site` block (`orgUrl`, `nav.links`,
  `footer.links`) are Your-site config. They share a file by design; treat
  the interfaces as stable.
- **C. `Layout.astro` shell** - head behavior (lang, hreflang, base-aware
  meta, `data-product`) is Machinery logic inside a Your-site component. It
  already delegates to `buildAlternates`/`withBase`; extracting a
  `buildHeadData()` helper was considered and deferred (low value today).
- **D. CSS contract vs taste** - the `--color-*` token names and `.prose`
  typography are the shared contract (Machinery); token *values* and the rest
  of `global.css` are Your-site taste. THEMING.md documents both theming
  axes (site theme + per-product themes).

## Related docs

- `AGENTS.md` - conduct, git/deploy boundaries, coding conventions
- `UPGRADING.md` - how adopters update a rebranded fork to a new release
- `THEMING.md` - theming (site theme, per-product themes, `data-product`)
- `README.md` - what the template is + quick start
- `skills/site-content/SKILL.md` - authoring content inside the hub
- `examples/*/skills/site-content-sync/SKILL.md` - syncing content from
  external repos into the hub
