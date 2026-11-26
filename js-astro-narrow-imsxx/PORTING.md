# Porting map

Upstream snapshot: `hugo-narrow v2.1.4`.
Status values: **copied** (verbatim, safe to overwrite), **rewritten** (same behaviour, Astro
structure), **replaced** (upstream logic dropped because Astro has a native equivalent).

When upstream changes a file marked `replaced`, there is nothing to port. That is the point of the
column.

## Styles

| Upstream | Here | Status |
| --- | --- | --- |
| `assets/css/main.css` | `src/styles/main.css` | copied |
| `assets/css/themes.css` | `src/styles/themes.css` | copied |
| `assets/css/base.css` | `src/styles/base.css` | copied |
| `assets/css/components.css` | `src/styles/components.css` | copied |
| `assets/css/gallery.css` | `src/styles/gallery.css` | copied |
| `assets/css/toc.css` | `src/styles/toc.css` | copied |
| `assets/css/prose.*.css` | `src/styles/prose.*.css` | copied |
| `assets/css/custom.css` | `src/styles/custom.css` | copied |
| `assets/css/compiled.css` | — | replaced (build output; Vite compiles `main.css`) |

## Icons and scripts

| Upstream | Here | Status |
| --- | --- | --- |
| `assets/icons/*.svg` | `src/icons/*.svg` | copied |
| `layouts/_partials/features/icon-sprite.html` | `src/pages/icons/sprite.svg.ts` | rewritten |
| `assets/js/*.js` | `src/scripts/*.js` | copied |
| `assets/js/lib/*.js` (MiniSearch, smart-gallery) | `src/scripts/lib/*.js` | copied (vendored bundle, not edited) |
| `assets/js/theme-init.js` | inline script in `src/layouts/Base.astro` | rewritten (Hugo templating removed) |

## Layouts

| Upstream | Here | Status |
| --- | --- | --- |
| `layouts/baseof.html` | `src/layouts/Base.astro` | rewritten |
| `layouts/home.html` | `src/pages/index.astro` | rewritten |
| `layouts/single.html` | `src/pages/posts/[...slug].astro` | rewritten |
| `layouts/list.html` | `src/pages/posts/index.astro`, `posts/page/[page].astro` | rewritten |
| `layouts/archives.html` | `src/pages/archives.astro` | rewritten |
| `layouts/taxonomy.html` | `src/pages/tags/index.astro`, `categories/index.astro`, `series/index.astro` | rewritten |
| `layouts/term.html` | `src/pages/tags/[tag].astro`, `categories/[category].astro`, `series/[series].astro` | rewritten |
| `layouts/404.html` | `src/pages/404.astro` | rewritten |
| `layouts/_partials/ui/dock.html` | `src/components/ui/Dock.astro` | rewritten |
| `layouts/_partials/ui/appearance-popover.html` | `src/components/ui/AppearancePopover.astro` | rewritten |
| `layouts/_partials/ui/toc.html` | `src/components/ui/Toc.astro` | rewritten |
| `layouts/_partials/ui/search-modal.html` | `src/components/ui/SearchModal.astro` | rewritten (rendered only when `search.enabled`) |
| `layouts/_partials/ui/reading-progress.html` | `src/components/ui/ReadingProgress.astro` | rewritten |
| `layouts/_partials/ui/gallery-switcher.html` | `<template>` inside `src/components/features/Gallery.astro` | rewritten (cloned by `gallery.js`) |
| `layouts/_partials/navigation/context-bar.html` | `src/components/ui/ContextBar.astro` | rewritten |
| `layouts/_partials/navigation/nav-popover.html` + `nav-menu.html` | `src/components/ui/NavMenu.astro` | rewritten |
| `layouts/_partials/navigation/pagination.html` | `src/components/navigation/Pagination.astro` | rewritten |
| `layouts/_partials/navigation/series-popover.html` | inside `ContextBar.astro` | rewritten |
| `layouts/_partials/content/card.html` + `post-card.html` + `series-card.html` | `src/components/content/Card.astro` | rewritten (unified) |
| `layouts/_partials/content/card-grid.html` | `src/components/content/CardGrid.astro` | rewritten |
| `layouts/_partials/content/section-header.html` | `src/components/content/SectionHeader.astro` | rewritten |
| `layouts/_partials/content/page-header.html` | `src/components/content/PageHeader.astro` | rewritten |
| `layouts/_partials/content/post-list.html` | `src/components/content/PostFeed.astro` | rewritten |
| `layouts/_partials/content/related-posts.html` | `src/components/content/RelatedPosts.astro` | rewritten |
| `layouts/_partials/content/post-meta.html` | inline in `posts/[...slug].astro` | rewritten |
| `layouts/_partials/content/image-processor.html` + `config/image.html` | — | replaced (`astro:assets`; see below) |
| `layouts/_markup/render-codeblock.html` | `src/lib/rehype/code-block.ts` | rewritten (`.highlight` wrapper + `.chroma` shim, see below) |
| `layouts/_markup/render-blockquote.html` | `src/lib/rehype/alert.ts` | rewritten |
| `layouts/_markup/render-image.html` | `src/lib/rehype/image-attrs.ts` | rewritten |
| `layouts/_markup/render-heading.html` | — | replaced (Astro heading slugs) |
| `layouts/_partials/layout/head.html` | head block in `Base.astro` | rewritten |
| `layouts/_partials/layout/footer.html` | `src/components/ui/Footer.astro` | rewritten |
| `layouts/index.json` | `src/pages/search-index.json.ts` | rewritten |
| `layouts/_partials/features/comments.html` + all providers | `src/components/features/Comments.astro` | rewritten (7 providers in one component) |
| `layouts/_partials/features/comments/theme-sync.html` | `src/components/features/CommentsThemeSync.astro` | rewritten (same `themeChanged` listener, provider passed as a prop) |
| `layouts/_partials/config/search.html` | `siteConfig.search` + gating in `Base.astro` | rewritten |
| `layouts/_partials/features/analytics/*` | `src/components/features/Analytics.astro` | rewritten (4 providers) |
| `layouts/_partials/features/announcement.html` | `src/components/features/Announcement.astro` | rewritten |
| `layouts/_partials/content/image-processor.html` + `config/image.html` | `src/lib/rehype/image-figure.ts` + `astro:assets` | replaced (see below) |
| `layouts/_partials/features/katex.html` | `remark-math` + `rehype-katex` in `astro.config.ts` | replaced (build-time rendering) |
| `layouts/_partials/features/mermaid.html` | `src/components/features/Mermaid.astro` | rewritten (dynamic import) |
| `layouts/_markup/render-codeblock-mermaid.html` | `src/lib/remark/mermaid.ts` | rewritten |
| `layouts/timeline.html` | `src/pages/timeline.astro` | rewritten (CSS timeline, no HTML splitting) |
| `layouts/about.html` | `src/pages/about.astro` | rewritten |
| `layouts/resume.html` | `src/pages/resume.astro` | rewritten (CSS sections, no HTML splitting) |
| `layouts/projects/list.html` | `src/pages/projects/index.astro` | rewritten |
| `layouts/projects/single.html` | `src/pages/projects/[slug].astro` | rewritten |
| `layouts/_partials/content/split-sections.html` | — | replaced (CSS-only timeline/resume layout) |

### Per-page configuration

Upstream merges page front matter over the site params in `_partials/config/*.html`. Two modules
replace that:

| Upstream | Here |
| --- | --- |
| `_partials/config/toc.html`, `config/comments.html` | `src/lib/toggles.ts` (`resolveToggle`, `resolveLicense`) |
| `config/katex.html`, `config/gallery.html`, `render-image.html` | `src/lib/frontmatter-flags.ts` (reads the file being rendered) |
| `config/gallery.html` layout values, `config/search.html` | `src/content.config.ts` + `src/config/site.ts`, merged in `posts/[...slug].astro` |

`katex` and `mermaid` need the flag before rendering, so their toggles are read straight from the
source file during the markdown pass. Gallery options are structured front matter, validated by the
content schema and merged over `siteConfig.gallery` in the page. The rest are resolved in the page
component.

`comments.system` became `comments.provider` in v2.1.0, both in site config and in front matter.
Since v2.1.2 the dock's comments button follows the page rather than the site switch: upstream sets a
`hasComments` store flag from the comments partial, so `Base.astro`'s `commentsEnabled` defaults to
`false` and only pages that render `Comments.astro` turn it on.

### Images

Upstream only builds a responsive width ladder for Hugo page bundles and `assets/` resources; images
referenced by a plain path (`/images/...`, remote URLs) keep their original URL and get no `srcset`.
The port renders every markdown image as a plain `<img>` with `loading="lazy"` / `decoding="async"`
and the `figure.image-figure` shell the gallery scripts expect, so those images match upstream's
static branch. `astro:assets` handles the processed case instead, through `<Image>` / `<Picture>` in
MDX; `params.image.webp` and `params.image.quality` have no counterpart here.

### Code blocks

Shiki renders the blocks, but the markup keeps two hooks the upstream stylesheet expects: the
inner `<pre>` carries `chroma` (so `.chroma` rules still land) and sits inside a `div.highlight`
wrapper. Upstream moved padding, scrolling and typography onto `.highlight` in v2.1.3 — Chroma emits
that wrapper itself, Shiki does not, so `code-block.ts` adds it. Without it the block loses its
padding and the syntax background shows as an inner panel.

## Shortcodes → MDX components

Hugo shortcodes cannot run in Astro's markdown pipeline. The equivalents are MDX components: content
files that need them use `.mdx` and import the component.

| Upstream | Here | Notes |
| --- | --- | --- |
| `_shortcodes/button.html` | `src/components/embeds/Button.astro` | variant / size / icon / target |
| `_shortcodes/link.html` | `src/components/embeds/LinkCard.astro` | single card form; group form dropped |
| `_shortcodes/tabs.html` + `tab.html` | `src/components/embeds/Tabs.astro` + `Tab.astro` | tablist rendered at build time; `tabs.js` only handles state |
| `_shortcodes/icon.html` | `src/components/Icon.astro` | already used everywhere |
| `_shortcodes/bilibili.html` | `src/components/embeds/Bilibili.astro` | |
| `_shortcodes/tencent.html` | `src/components/embeds/Tencent.astro` | |

## Data and config

| Upstream | Here | Status |
| --- | --- | --- |
| `data/themes.yaml` | `src/lib/themes.ts` | rewritten |
| `exampleSite/config/_default/params.yaml` | `src/config/site.ts` | rewritten (Zod validated) |
| `exampleSite/config/_default/menus.yaml` | `nav` in `src/config/site.ts` | rewritten |
| `i18n/*.toml` (14 locales) | `src/i18n/*.ts` | generated by `scripts/build-i18n.mjs` |
| `i18n/zh-hans.toml`, `i18n/en.toml` | `src/i18n/zh-hans.ts`, `src/i18n/en.ts` | rewritten by hand (baseline + types) |
| `assets/js/theme-init.js` | inline script in `Base.astro` | rewritten (Hugo templating removed) |

Translation files are regenerated rather than hand-edited:

```bash
node scripts/build-i18n.mjs   # upstream/hugo-narrow/i18n/*.toml → src/i18n/*.ts
```

Non-English locales are partial in upstream; missing keys fall back to English at runtime.

## Syncing with upstream

```bash
pnpm upstream:pull v2.1.0   # refresh upstream/hugo-narrow and print a changed-file list
```

1. Read the diff. Split changes by layer:
   - **Styles / icons / copy** — files marked `copied`. Overwrite them, rebuild, compare screenshots.
   - **Components** — files marked `rewritten`. Apply the same change to the Astro counterpart.
   - **Replaced** — ignore. Astro handles it.
2. Run `pnpm build` and compare the affected pages against the upstream demo.
3. Update the snapshot version at the top of this file and add a `CHANGELOG.md` entry.

**Do not chase major versions.** If upstream restructures its layout again (as v1 → v2 replaced the
navbar with a dock), rebuilding is cheaper than merging. If the work exceeds roughly five days,
stay on the current baseline and say so in the README.
