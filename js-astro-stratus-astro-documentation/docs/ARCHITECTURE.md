# Architecture

How the load-bearing machinery fits together. For workflows (adding components, theming, content authoring), see the skills in `.agents/skills/` (canonical; `.claude/skills/` is a generated copy for Claude Code).

## The one-paragraph version

Two content collections mount at the site root: `docs` (Markdown articles, one file per page) and `pages` (page-builder entries whose frontmatter holds a `pageSections` array of component data blocks). A third, `changelog`, has no URL of its own and is read into a page by a component. One catch-all route serves the two routed collections, rendering blocks through a component registry that auto-discovers every `.astro` file under `src/components/`. The documentation sidebar is derived from page frontmatter rather than configured. Each component ships its own CloudCannon editor config as sibling YAML files, aggregated by glob so the CMS always matches the component library. Design lives in CSS custom properties (primitive → semantic → component tiers), so rebranding is a token change, not a component change.

## Content → HTML pipeline

1. **Content**: three collections, all validated in `src/content.config.ts`.
   - `src/content/docs/**/*.mdx` (`docSchema`) — a documentation page. The body is Markdown plus the components `src/components/utils/mdxComponents.ts` exposes. `group` + `order` place it in the sidebar.
   - `src/content/pages/**/*.md` (`pageSchema`) — a page-builder entry. `pageSections` is an array of blocks; each has a `_component` path plus that component's props. The Markdown body renders after the sections.
   - `src/content/changelog/*.md` (`changelogSchema`) — one release: `version`, `date`, `changes`. Unrouted: `getStaticPaths` never walks it. The `changelog` component reads it with `getCollection` and renders the releases newest first, which is what the changelog page's body contains. This is the pattern for any repeating record that belongs on a page rather than at a URL of its own.
2. **Routing**: `src/pages/[...slug].astro` — the site's only content route. `getStaticPaths` walks both collections and mounts them at the root. A slug claimed by both **throws**, naming the two files: two collections sharing a namespace can't be left to resolve by accident.
3. **Page shell**: `src/layouts/Docs.astro` — the topbar, sidebar (plus its mobile drawer), article column, on-this-page rail and footer. Every route goes through it, including 404, so the chrome is defined once. Page-specific furniture (breadcrumbs, meta line, pager, feedback) is composed by the route into its slots.
4. **Navigation**: `src/utils/docsNav.ts` — the single derivation of the sidebar, the prev/next reading order (depth-first) and the breadcrumb trail. Two levels from two sources: `group` frontmatter puts a page in a group, and a page's **path** nests it under the page at its parent path (`theming/token-reference.mdx` under `theming.mdx`), inheriting that parent's group so the levels can't disagree. `src/data/sidebar.json` supplies only the group order.
5. **Component resolution**: `src/components/utils/renderBlock.astro` — the registry. `import.meta.glob("../**/*.{jsx,astro}")` discovers every component; paths are normalized via `pascalToKebab` (a `button/Button.astro` file collapses to the key `building-blocks/core-elements/button`). Each block's `_component` is looked up here; misses log a warning listing all available keys (that warning is your first stop when a section doesn't render).

**Implication**: adding a `.astro` file under `src/components/` in the right directory automatically registers it — for `renderBlock`, for the Visual Editor, and (by filename) as an MDX tag. There is no manual registry. The `_component` string in content must exactly match the kebab-case directory path.

## Documentation shell

- **Three breakpoints, one rule each** (`Docs.astro`): from 1280px the on-this-page rail is its own grid column; below that the same headings become a disclosure above the article, which is why the rail is placed _before_ `.docs-main` in the DOM. Below 1024px the sidebar leaves the grid and becomes a fixed drawer. `Toc.astro` switches presentation at the same 1280px line.
- **The drawer has no JavaScript.** A visually-hidden checkbox in `DocsSidebar` is the state; a `<label for>` in `DocsTopbar` is the trigger. They are coupled by `DOCS_NAV_TOGGLE_ID`, imported by both — the CloudCannon editor doesn't run inline scripts, so a JS drawer would be dead there.
- **Every sticky offset measures from `--docs-topbar-height`**, declared once in `Docs.astro`.

## Code samples

Two paths produce a code block, and they must look identical:

- **Component props** (`CodeBlock`, `CodeTabs`, `CodeAnnotations`) are what all content uses. In MDX, every code component (and `Diagram`) holds its sample in a fence between the tags, which `src/utils/codeFencePlugin.mjs` (a Sätteri mdast plugin registered in `astro.config.mjs`) turns back into the `code` / `tabs` prop. They go through `src/components/utils/highlight.ts` — one cached Shiki highlighter per build — and render inside `CodeBlockSurface.astro`, which owns the shared `.code-surface` chrome.
- **Markdown fences** are unused in `src/content/` (CloudCannon's editor can't round-trip their meta, so `code_block` is off in every rich-text input), but the pipeline remains for Markdown elsewhere. They go through Astro's own Shiki pass, configured in `astro.config.mjs`. Astro handles `title=`; `fenceMetaTransformer` (`src/utils/markdown.mjs`) reads `{1,3-5}` line ranges. A fence is a bare `<pre>`, so `base/_prose.css` grows its panel and filename bar, and `code-block/setup.ts` injects the copy button.

Both import `CODE_THEME` from `src/utils/codeTheme.mjs`. That indirection is the point: two snippets on one page rendering in different palettes reads as two different components.

Astro 7's default Markdown processor doesn't run `rehypePlugins` without `@astrojs/markdown-remark`, so heading anchors are CSS (`_prose.css`) plus a document-level click handler (`navigation/heading-links/setup.ts`) rather than a rehype plugin.

## Diagrams

`Diagram` renders Mermaid in the browser. Mermaid needs a DOM to lay a diagram out, so build-time SVG would mean a headless browser in the build — and CloudCannon's build container is not the place to require one. Instead the source ships inside a `<pre>`, and the SVG replaces it once a dynamic `import("mermaid")` resolves, which happens only on pages that contain a diagram. The trade is explicit: a diagram is not in the search index, and it prints as its source.

## CloudCannon editing layer

Two co-operating systems:

### Structured editing (page builder / data panels)

- `cloudcannon.config.yml` (root) defines collections — `documentation` (`src/content/docs`, content + visual editors), `landing_pages` (`src/content/pages`, visual), `changelog` and `data` — and pulls structures from `.cloudcannon/structures/*.yml`.
- Each `.cloudcannon/structures/*.yml` aggregates per-component files by glob, e.g. `pageSections` ← `/src/components/page-sections/**/*.cloudcannon.structure-value.yml`.
- Form fields are scoped to their own picker by the same mechanism: `formBlocks` ← `/src/components/building-blocks/forms/**/*.cloudcannon.structure-value.yml`, consumed only by the `formBlocks` array input on `form`. They cannot appear in the page-sections picker (that glob matches `page-sections/**` only). Two components are deliberately excluded from the picker — `form` itself (no nested forms) and `segments` — see the comment in `.cloudcannon/structures/formBlocks.cloudcannon.structures.yml`.
- Per component (sibling files, same directory as the `.astro`):
  - `<name>.cloudcannon.inputs.yml` — editor field definitions (`_inputs` syntax).
  - `<name>.cloudcannon.structure-value.yml` — label/icon/description, default `value` (including `_component`), previews, and `_inputs_from_glob` pointing back at the inputs file.
  - `<name>.cloudcannon.snippets.yml` — MDX snippet definition, for any component an author should be able to insert into a documentation page's body. The snippet's `component_name` must match the component's key in `src/components/utils/mdxComponents.ts` (its `.astro` filename).

### Visual (inline) editing

- `@cloudcannon/editable-regions` is wired in `astro.config.mjs`; `live-editing.js` registers every component with the editor using its own `import.meta.glob("./src/components/**/*.astro")`. The kebab-case key derivation is shared with `renderBlock.astro` and `scripts/cms/lint.mjs` via `src/components/utils/componentKey.mjs` — one source of truth, so the registries can't drift.
- Components opt into inline editing via data attributes: `data-editable="text" data-prop="heading"` (single field), `data-editable="array" data-prop="contentSections"` on a container + `data-editable="array-item"` on children (managed by renderBlock), `data-editable="component"` for whole-component bindings. The `useDefaultEditableBinding` prop toggles a component's default binding; `renderBlock` passes it down.
- `editor-live-sync.js` re-initializes interactive components inside the CloudCannon editor (content selector, modal, form validation, video embeds, search, code tabs and copy buttons, diagrams, masonry spans, and the rest) because the editor's renderer doesn't execute inline scripts — component setup logic that must also run in the editor lives in importable modules (see `content-selector/setup.ts` for the pattern).

## Theming

- **Tiers**: `src/styles/variables/*` (primitive tokens: palette, spacing, radius, shadows, fonts, z-layers, animation durations) → `src/styles/themes/_light.css` / `_dark.css` (semantic tokens like `--color-text`, `--color-bg-brand`) → components consume only semantic/primitive tokens in their `<style is:global>` blocks.
- **Layers**: `@layer reset, base, components, page-sections, utils, overrides` — declared in `BaseLayout.astro` before any component CSS. Component styles go in `@layer components`.
- **Dark mode**: inline script (`ThemeToggleScript.astro`) sets `data-theme` on `<html>` pre-paint (no FOUC); sections can pin a scheme via `data-theme` + `data-theme-lock`.
- **Fonts**: `site-fonts.mjs` (root) is the single source of truth — feeds Astro's fonts config in `astro.config.mjs` and the `<Font>` preloads in `src/layouts/SiteFonts.astro`. Provider is `fontProviders.fontsource()` (self-hosted via the installed `@fontsource/*` packages).
- **Reduced motion**: `src/styles/base/_animations.css` globally disables animations/transitions (including `::backdrop` / `::details-content`); JS-driven motion (video autoplay) checks `prefers-reduced-motion` in `video/setup.ts`, since the CSS reset can't reach a `play()` call.

## Flow spacing

- **Documentation prose** is `src/styles/base/_prose.css`, which is bottom-margins only: adjacent margins collapse, so a heading's larger top margin wins over the previous block's bottom margin and a section break is one gap rather than the sum of two. The flow system below governs page-builder blocks, not prose.
- Space **between sibling blocks** is the flow system (`src/styles/utils/_flow.css`): a `.flow` parent margins each child by the child's `--space-before`, first children sit flush, and a Spacer _replaces_ the adjacent gap (its size is the whole gap). Every stackable building block declares a type default in its component CSS (heading loose, text tight, collection wrappers loose); the four role tokens live in `variables/_spacing.css` (`--space-before-{none,tight,default,loose}`) — retune those four lines to retune all page rhythm. Blocks carry no root margins of their own.
- The per-block `spaceBefore` prop rides as `data-space-before` on a **direct child** of the block's root, hoisted to the root by `_flow.css`'s `:has()` rules. Never on the root: CloudCannon's editable-regions re-render keeps the region's root element, so a prop-driven attribute there goes stale in the Visual Editor (the same constraint behind `editor-live-sync.js`'s masonry span sync). Video is the one exception: its media element is the root and has no child to carry the attribute, so it keeps root placement and a live `spaceBefore` edit needs a reload.

## Component harness (`/preview-renders`)

`src/pages/preview-renders/[...slug].astro` emits one bare page per component, rendered from its `structure-value.yml` defaults. The routes exist only when `COMPONENT_PREVIEWS=true` — a production build emits none. Two things use them: `npm run previews:screenshot` (an authoring aid for preview recipes) and `npm run test:smoke`, which is the only way to drive a component that no page happens to compose.

The agent-facing component list lives in `.agents/skills/page-content-authoring/component-catalog.md` and is **generated** from each component's own YAML by `npm run docs:catalog`. `docs:catalog:check` fails on drift, so the list agents read can't rot behind a prop rename.

## Protected patterns (don't "refactor" these)

These are load-bearing decisions, not accidents. Fix problems around them with tooling, not by restructuring them:

- **The three-file component convention** (`.astro` + `inputs.yml` + `structure-value.yml`) and glob aggregation — it scales; fix drift with tooling, not by restructuring.
- **The three-tier token hierarchy** (primitive → semantic → component) and semantic naming.
- **Dark-mode architecture** — the `is:inline` script, `data-theme`, and theme-lock (FOUC-free by construction).
- **CSS-first interactivity** — Popover API modal, `<details>` accordion, `:has()`, `@layer` organization, and the `onPageLoad` + `setup.ts` script lifecycle.
- **The `<details>`-and-checkbox CSS-only interactions** (sidebar groups, the mobile drawer, the content selector) — they are what make the components work inside the CloudCannon editor, which doesn't run inline scripts. `modal/setup.ts` is the reference for the keyboard/ARIA patterns of a JS-driven component.
- **`src/utils/docsNav.ts` as the single navigation derivation** — the sidebar, the pager and the breadcrumbs are one reading order. Splitting them is how they drift.
- **`site-fonts.mjs`** as the font single-source-of-truth.

## Checks

`npm run check` is the gate CI runs; the `check` script in `package.json` is the list of what it chains, and the `test:*` scripts beside it are the test suites. Smoke tests need `COMPONENT_PREVIEWS=true npm run build` first, because they drive components through the `/preview-renders/` routes.

CI is `.github/workflows/test.yml`. The lockfile must be regenerated with `npm run deps:sync`, not plain `npm install` — a macOS install strips the Linux-only optional dependencies (sharp, rollup binaries) that CI needs.
