# Changelog

## 2.0.3

Syncs `hugo-narrow v2.1.4`. The patch drops the foldable-device layout: foldable screens now use the
same breakpoint-based layout as every other screen, so content may span the hinge and the dock keeps
its normal bottom or side placement.

- Removed `src/scripts/fold.js` and its call in `main.js`. Nothing writes `--fold-content-width` or
  `--fold-margin-start` any more.
- `#page-container` only reads the content width token; the `100vw` clamp and the fold margin
  override are gone.
- Dropped the `horizontal-viewport-segments` / `vertical-viewport-segments` blocks from
  `components.css` and `toc.css`, and `SIDE_DOCK_QUERY` / `TOC_PIN_QUERY` in `layout.js` are back to
  their plain breakpoint form.

## 2.0.2

Syncs `hugo-narrow v2.1.3`. Upstream's fixes are all Chroma-specific, but one of them changed the
shape of the code-block stylesheet, which this port reuses.

- Fix: code blocks keep their padding and stay flat after the upstream stylesheet moved those rules
  from `.chroma` onto Chroma's `.highlight` wrapper. Shiki does not emit that wrapper, so the rehype
  plugin now adds it around the `<pre>`. Without it the block lost its 1rem padding and Shiki's
  syntax background showed as a grey panel inside the bordered container.
- The rest of v2.1.3 has no counterpart here: `lineNumbersInTable`, `noClasses` and the copy-source
  `<pre>` all describe Hugo's HTML minifier and Chroma's table layout. Astro preserves the
  indentation in the copy source already, and this port renders line numbers itself.

## 2.0.1

Syncs `hugo-narrow v2.1.1` and `v2.1.2` (the last patches on the upstream v2 line).

- Fix: the dock's comments button now appears only on pages that actually render a comments section.
  Before, enabling comments site-wide put a button on every page, including ones with nothing to
  scroll to. Pages opt in by rendering the component; other page kinds stay clean.
- Internal: `src/scripts/vendor` is renamed to `src/scripts/lib` to match upstream. The vendored
  bundles are unchanged; only the two import paths and the `tsconfig` exclude moved.
- Same behaviour as before (verified against the upstream templates): the lightbox flag and the
  Mermaid block already render without template-indentation artefacts, so upstream's fixes there
  needed no port. The remaining diff is Hugo-specific formatting and CRLF handling.

## 2.0.0

Syncs `hugo-narrow v2.1.0`.

**Breaking:** `comments.system` is now `comments.provider`, in site config and in page front matter.
Rename the key and everything else keeps working; leave it on `system` and comments show the
"not configured" notice instead of loading.

- Search runs on MiniSearch with `Intl.Segmenter`, so Chinese, Japanese and other unspaced languages
  match by word instead of by substring. The engine is vendored with the theme, `search.js` is its
  own bundle, and turning `search.enabled` off removes the dock button, the dialog, the script and
  the index content (the endpoint returns `[]`).
- The context bar on article pages hides while scrolling down and returns as a title capsule while
  scrolling up; clicking or tapping the capsule expands the breadcrumb again. Other page kinds keep
  the static trail.
- Every gallery layout value (`gap`, `columns`, `targetRowHeight`, `lastRowBehavior`, `columnWidth`)
  can now be set in `siteConfig.gallery` and overridden per post in front matter. The layout switcher
  is a single cycling button, and `gallery.js` uses the vendored smart-gallery instead of a CDN
  build.
- Comments follow the upstream breaking change: `comments.system` is now `comments.provider` in both
  site config and front matter. giscus requires `repo`, `repoId` and `categoryId` together; a
  provider with missing keys, or one the theme does not ship, shows the "not configured" notice
  instead of loading an empty embed. Theme changes are forwarded to giscus, utterances, twikoo,
  artalk and comentario.
- Tabs render their tablist at build time, so the tabs are usable and the first panel is visible with
  JavaScript disabled.
- Safe-area insets are respected on notched devices, and small controls grow to a comfortable tap
  size on coarse pointers (dock, series steps, gallery switcher, search clear, announcement close).
- The icon sprite only strips the root `width`/`height` now, so icons with sized shapes inside them
  (the GitHub mark, the new layout icon) draw correctly.
- Added Bengali (`bn`) to the locales and `ui.galleryLayoutSwitch`.
- Chore: the duplicated 1.2.2 entry is gone from this file.

## 1.2.2

- Internal: move `markdown.remarkPlugins` / `markdown.rehypePlugins` to `markdown.processor` with
  `unified()` from `@astrojs/markdown-remark`. Astro 7 deprecates the old options and will remove them
  in a future major. No behaviour change — KaTeX, Mermaid, alerts, galleries and heading anchors all
  render as before.

## 1.2.1

- Fix: the favicon and apple-touch-icon links ignored `base`, so they 404'd on subpath deployments.
  Both now go through `url()`, and `favicon.svg` falls back to the default path when unset.

## 1.2.0

Restores three upstream layout pieces the port had missed:

- Heading anchors: content headings now render the hover link icon from `render-heading.html`.
  Astro assigns heading ids after user rehype plugins run, so the plugin generates ids with the same
  slugger Astro uses and keeps TOC links in sync.
- Table of contents on project, resume and timeline pages. They render Markdown headings but never
  passed `headings` to the layout, so the panel and the dock button were missing.
- The home page lists recent posts as the upstream card grid instead of a plain list, and project
  detail headers match upstream (bottom border plus an "open project" button).

## 1.1.0

- The home page now honours `home.contentOrder` instead of rendering two hard-coded sections, and
  implements the upstream "featured projects" block: projects with `featured: true` show up on the
  home page (up to four), with a "view all" link when the projects collection has more entries.

## 1.0.2

- Fix: the table of contents panel never opened. `toc.js` was ported verbatim but nothing imported
  it — upstream loads it conditionally from `head/js.html`, while the Astro layout only pulled in
  `main.js`. The script now ships with the TOC component, so the dock button, scroll spy and pinning
  work again.

## 1.0.1

Synced with upstream 2.0.2:

- Dock container is a `<div role="toolbar">` instead of `<nav>`, fixing the Lighthouse
  `aria-allowed-role` audit
- Sprite preload removed (external `<use>` references cannot reuse it); the menu button is back to a
  single icon and the table of contents uses the new `toc` icon
- `announcement.autoClose` added: set it to a number of seconds to dismiss the banner automatically
- Icon set trimmed from 73 to 48 SVGs, sprite down from ~27 KB to ~17.5 KB

## 1.0.0

First public release. Port of [hugo-narrow](https://github.com/tom2almighty/hugo-narrow) v2.0.1 to
Astro.

Synced with upstream 2.0.1:

- Subpath deployments work: `base` now flows through internal links, cover images, the icon sprite,
  the search index, the web manifest and the feed
- Collapsed dock capsule shrinks to a single item, with distinct icons for the expanded menu,
  collapsed menu and table of contents

**Layout and reading**

- Content column with a floating dock and a breadcrumb context bar
- Appearance panel: 12 colour schemes, light/dark/system, adjustable width, blur and grain
- Post header with meta, prose typography, TOC panel with pin, reading progress
- Prev/next navigation, related posts, series progress bar and popover

**Content and lists**

- Posts with pagination, archives by year and month
- Tags, categories and series indexes with term pages
- Projects, about, resume and timeline pages
- RSS feed, sitemap, robots.txt and an SVG icon sprite endpoint

**Rendering**

- Code blocks: Shiki dual theme, language label, copy and collapse
- Math: KaTeX rendered at build time
- Diagrams: Mermaid loaded on demand and re-rendered on theme change
- Images: adjacent images grouped into a gallery with layout switcher and lightbox
- Alerts: GitHub-style `[!NOTE]` blockquotes, including collapsible `+` / `-` variants
- Cover images rendered above the post header, and an optional updated date in the meta line
- MDX components replacing the upstream shortcodes (button, link card, tabs, Bilibili, Tencent Video)

**Integration**

- Search with a Ctrl+K modal and a generated index
- Comments: giscus, disqus, utterances, waline, artalk, twikoo, comentario
- Analytics: Google, Baidu, Clarity, Umami
- UI copy in 13 languages, generated from the upstream i18n files
- Site-wide and per-page feature switches

**Known differences from upstream**

- KaTeX renders at build time instead of in the browser
- Resume and timeline use CSS for their section layout instead of splitting the rendered HTML
- The `link` shortcode's group form (reading `data/links.yaml`) is not ported
- Localized routes are not implemented; `lang` switches UI copy only
