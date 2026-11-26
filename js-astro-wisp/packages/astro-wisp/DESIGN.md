---
name: Wisp
description: A CJK-first technical blog theme typeset like a bound technical reference manual — running heads, chapter numbers, numbered tables of contents, booktabs tables, and code listings.
colors:
  paper: '#fcfcfb'
  paper-dark: '#111214'
  surface: '#f4f4f2'
  surface-dark: '#18191c'
  surface-2: '#ebebe7'
  surface-2-dark: '#202125'
  rule: '#e2e2dd'
  rule-dark: '#2b2d31'
  ink: '#1d1d1f'
  ink-dark: '#e6e6e3'
  muted: '#5c6067'
  muted-dark: '#a0a4ab'
  subtle: '#8b9098'
  subtle-dark: '#6b7078'
  accent: '#0f766e'
  accent-dark: '#4fd1c0'
  accent-fg: '#ffffff'
  accent-fg-dark: '#0b1f1d'
  code-bg: '#f6f6f4'
  code-bg-dark: '#16171a'
  selection: '#ccf0ea'
  selection-dark: '#1d3d39'
typography:
  home-title:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, PingFang SC, sans-serif'
    fontSize: 'clamp(2.5rem, 1.6rem + 3.6vw, 4rem)'
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: '0em'
  chapter-title:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, PingFang SC, sans-serif'
    fontSize: 'clamp(1.75rem, 1.25rem + 1.8vw, 2.25rem)'
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: '0em'
  chapter-number:
    fontFamily: 'Inter Variable, sans-serif'
    fontSize: '1.5em'
    fontWeight: 300
    lineHeight: 1
  h2:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, PingFang SC, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 700
    lineHeight: 1.3
  h3:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, PingFang SC, sans-serif'
    fontSize: '1.1875rem'
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, Wisp CJK Fallback, PingFang SC, HarmonyOS Sans SC, MiSans, Microsoft YaHei, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: '0em'
  section-title:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '1.25rem'
    fontWeight: 700
    lineHeight: 1.35
  lead:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.7
  ui-large:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '0.9375rem'
    fontWeight: 400
    lineHeight: 1.5
  ui:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
  ui-small:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.5
  prose-h1:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '2rem'
    fontWeight: 700
    lineHeight: 1.3
  diagram-label:
    fontFamily: 'Inter Variable, Noto Sans SC Variable, sans-serif'
    fontSize: '14px'
    fontWeight: 600
    lineHeight: 1.4
  code:
    fontFamily: 'JetBrains Mono Variable, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.7
rounded:
  focus: '2px'
  mark: '3px'
  box: '4px'
  scrollbar: '999px'
spacing:
  unit: '4px'
  xs: '8px'
  sm: '12px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  section: '80px'
  measure: '42rem'
  side: '14rem'
  gutter: '4rem'
  header: '56px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.accent-fg}'
    rounded: '{rounded.box}'
    padding: '0 18px'
    height: '44px'
  button-secondary:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.box}'
    padding: '0 18px'
    height: '44px'
  code-listing:
    backgroundColor: '{colors.code-bg}'
    textColor: '{colors.ink}'
    typography: '{typography.code}'
    rounded: '{rounded.box}'
  inline-code:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.mark}'
    padding: '0.125em 0.3em'
  note-block:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.box}'
    padding: '0.125em 1.25em'
  header:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    height: '{spacing.header}'
---

# Design System: Wisp

> This document is the single source of truth for Wisp's visual design. Read it before styling the theme, building components, or overriding layouts in a consuming site.
> Canonical color values live in `design/palette.json` (compiled into `--wisp-*` custom properties via `pnpm tokens`). The YAML frontmatter above mirrors those tokens; if they ever diverge, `palette.json` wins and this file should be updated to match.
> Product-level context (audience, positioning, scope constraints) lives in `PRODUCT.md` at the repository root.

## Overview

**North star: a bound technical reference manual.** Each series functions as a "part" of the manual, and each post is a chapter. Readers orient themselves through numbering: the running head reads `Site / Series · 7 / 23`, each chapter opens with a display chapter number, every body `h2` carries a hierarchical number synced with the right-hand table of contents, the left-hand series rail presents a numbered chapter index, and the home page serves as the master table of contents — complete with dot leaders and reading times in place of page numbers.

Structure belongs to the manual's apparatus while the prose column stays quiet: a `42rem` reading measure, honest contrast, a generous `1.8` line height for Chinese body copy, and zero ornament inside running text. The editorial feel comes exclusively from numbering, hairlines, booktabs three-rule tables, code listing headers, and the running head — never from card shadows, gradients, pill badges, or thick colored accent bars.

**Explicit non-goals:** rounded card grids typical of generic Tailwind blogs, frosted-glass headers, full-bleed hero banners, eyebrows/kickers, emoji or raw Unicode symbols used as UI icons, and dark hacker/terminal clichés.

**Key Characteristics**

- **Numbering is navigation**: chapter numbers, `§` section numbers, and rail entry numbers share one source of truth so any two indicators on screen match identically.
- **Hairline hierarchy**: `1px rule` lines divide peers, while `1px` (or `2px`) `ink` lines frame complete units — tables, changelog logs, home section headers, and chapter endings.
- **Single accent**: teal is reserved strictly for _"you are here"_ and _"this is interactive"_ — active numbers, links, primary buttons, and reading progress.
- **CJK typography as a first-class citizen**: negative letter-spacing is forbidden, Chinese emphasis uses under-dots rather than oblique italics, and `text-autospace` handles CJK–Latin micro-spacing automatically.

## Colors

The site uses a restrained palette: cool paper white paired with charcoal ink and a single teal accent. The eight categorical hues and ML semantic tones appear solely inside diagrams, syntax-highlighted code, and interactive explainers — never in page chrome.

### Primary

- **Manual teal** (`accent` `#0f766e` / dark `#4fd1c0`): indicates current location (`7 / 23` in the running head, active chapter number, active TOC entry, `h2` counters), prose links, primary button fills, the reading progress hairline, and focus rings. Teal occupies no more than 5% of any viewport.

### Neutral

- **Paper** (`paper` `#fcfcfb` / dark `#111214`): page background and interactive explainer stage canvas.
- **Ink** (`ink` `#1d1d1f` / dark `#e6e6e3`): body copy, headings, and framing rules (booktabs top/bottom rules, chapter-end dividers, and `2px` overlines above home section titles).
- **Muted** (`muted` `#5c6067`): metadata, captions, table headers, and inactive TOC labels; maintains ≥ 4.5:1 contrast against `paper`.
- **Subtle** (`subtle` `#8b9098`): strictly non-text cues — dot leaders, code line numbers, list markers, and `/` or `·` delimiters in the running head. Number columns in the home index, archive, series rail, and TOC aid navigation and therefore use `muted`. Because `subtle` does not meet AA body-text contrast, **never use it for readable copy**.
- **Rule** (`rule` `#e2e2dd`): all `1px` dividers and borders.
- **Surface** (`surface` `#f4f4f2` / `surface-2`): note blocks (`blockquote`), inline code chips, and explainer caption wells.
- **Code background** (`code-bg` `#f6f6f4`): fenced code listing blocks.

### Categorical inks (8 hues for diagrams & explainers)

All eight hues are calibrated as **print inks** rather than saturated screen primaries: in OKLCH, strokes sit at L ≈ 0.37–0.51 with chroma ≤ 0.11 (dark mode: L ≈ 0.70–0.85, chroma ≤ 0.10), paired with near-paper tinted washes (L ≈ 0.95, chroma ≈ 0.02; dark mode: L ≈ 0.26). Set beside ink-black prose and manual teal, they read like colored drafting inks rather than neon swatches.

| Hue (semantics)       | Ink tone            | Stroke light / dark | Fill light / dark |
| --------------------- | ------------------- | ------------------- | ----------------- |
| blue (q, active)      | Steel blue          | #2f5783 / #a9cbef   | #e9f2fb / #1a2634 |
| amber (k, highlight)  | Ochre               | #7b5518 / #f2c681   | #fbf2df / #2e2515 |
| green (v, done)       | Moss green          | #2c522d / #84b585   | #e9f5e9 / #1a281c |
| rose (grad, error)    | Brick red           | #984646 / #eda9aa   | #fcedec / #341f1f |
| violet (weight)       | Eggplant            | #4d335c / #bb9ece   | #f5eef9 / #291e2e |
| teal (activation)     | Manual teal         | #0f766e / #7fd3c5   | #e3f5f3 / #112926 |
| orange (bias)         | Rust                | #762f06 / #ce8d66   | #fceee4 / #311f15 |
| slate (mask, visited) | Cool gray (neutral) | #464e57 / #9da7b3   | #eaedf2 / #23272b |

- In light mode, categorical `teal` matches UI `accent` directly so activations share the primary ink; in dark mode, categorical `teal` steps back slightly (`#7fd3c5`) so it does not overpower the other seven hues inside a diagram.
- Every stroke clears ≥ 4.5:1 against both `paper` and its own fill (verified by `pnpm contrast`), ensuring crisp legibility for `1px` lines and diagram labels.
- Potentially close hue pairs (`blue`/`violet`, `green`/`teal`, `amber`/`orange`, `teal`/`slate`) are separated in lightness so they stay distinguishable under red–green and blue–yellow color-vision deficiency simulations, with consistent lightness ordering across themes and no single hue glowing brighter than its peers.

### Named Rules

**One accent color rule.** Teal is the sole UI accent color. Never introduce a second accent color to encode state; convey state through typographic cues (recolored numbers, font weight, `1px`/`2px` border markers) rather than tinted fills.

**Semantic colors belong to content.** `--wisp-sem-*` tokens (Q blue, K amber, V green, weight violet, activation teal, grad rose, bias rust, mask slate, etc.) preserve one consistent meaning across every article, diagram, and explainer site-wide; page chrome may never borrow them for decoration.

**Print-ink rule.** Categorical colors are low-chroma drafting inks, not neon primaries. Any added or overridden hue must stay at OKLCH chroma ≤ 0.11 with a lightly washed fill — never introduce raw saturated Tailwind blue or violet scales.

**At most three hues per diagram.** Diagrams default to neutral surfaces (`surface` fill, `muted`/`fg` `1px` strokes, `fg` text), applying color strictly to the semantic roles under discussion (`slate` is neutral and excluded from the cap). Never color-code parallel sibling nodes just for variety — draw attention with a heavier stroke or `highlight` instead, and keep node labels in `fg`. Diagram rectangles also use a `4px` corner radius (draw.io: `rounded=1;absoluteArcSize=1;arcSize=8`; Excalidraw: `roundness.value: 4`).

**Token-only rule.** All colors must come from `--wisp-*` / `--wd-*` tokens or explainer `Tone` props. Hardcoded hex literals, Tailwind default color palettes, and `dark:` color utilities are banned; mix derived colors from tokens with `color-mix()`.

## Typography

**Prose & headings:** Inter Variable (Latin, numerals) + Noto Sans SC Variable (Hanzi, full-width punctuation). The fallback stack inserts a metric-matched local `@font-face` named **`Wisp CJK Fallback`** (`ascent-override: 116%; descent-override: 28.8%; line-gap-override: 0%` mapped sequentially to local PingFang SC / HarmonyOS Sans SC / MiSans / Microsoft YaHei) so line heights do not shift when webfont slices finish loading.
**Code:** JetBrains Mono Variable, with programming ligatures disabled so readers always inspect exact characters.
**Sketch diagrams:** Excalifont, loaded on demand only on pages that render hand-drawn diagrams with `hasExcalifont` enabled.

All fonts are self-hosted via Astro Fonts API and Fontsource. Inter Latin 400 and JetBrains Mono Latin 400 are preloaded; Noto Sans SC loading is configured via **`fonts.cjkDisplay`** (defaults to **`swap`**, combining `unicode-range` chunking with the metric-matched fallback to prevent vertical shift; also accepts `fallback` or `optional`). Inter enables `"cv11"` and `"ss01"` everywhere.

### Hierarchy

| Role           | Specification                                          | Usage                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| home-title     | `clamp(2.5→4rem)` / 700 / 1.1                          | Site nameplate on the home title page — the largest type on the entire site.                                                                                                                                                                                               |
| chapter-number | `1.5em` of h1 / 300 / teal / tabular                   | Display chapter index in the chapter opener (automatically split from titles starting with `05 `).                                                                                                                                                                         |
| chapter-title  | `clamp(1.75→2.25rem)` / 700 / 1.3                      | Article title; Chinese titles inject `<wbr>` at `Intl.Segmenter` and long-identifier boundaries at build time with `word-break: normal; overflow-wrap: anywhere` so wraps occur cleanly at word boundaries.                                                                |
| h2             | `1.5rem` / 700 / 1.3, `2.5em` top margin, **no rules** | Major sections; CSS counter number `0.8em` / 400 / teal / tabular aligned on the first baseline. At `≥80rem`, hangs in the gutter right-aligned `0.75rem` outside the left prose edge; narrower screens place it in a leading column with hanging indent on wrapped lines. |
| h3             | `1.1875rem` / 600                                      | Subsections; `2.1`-style counter at `0.8em` / muted / tabular with the same gutter-hanging / column-aligned behavior as `h2` (`≥80rem` aligns both `h2` and `h3` titles cleanly on the prose left edge).                                                                   |
| h4             | `1rem` / 600 / muted                                   | Minor run-in/paragraph subheadings, unnumbered.                                                                                                                                                                                                                            |
| body           | `1rem` (16px mobile, 17px `≥768px`) / 400 / 1.8        | Running prose in a `42rem` measure (`714px` at `≥768px`, roughly 42 Hanzi per line — upper bound of CJK comfort to give code, math, and figures room).                                                                                                                     |
| section-title  | `1.25rem` / 700                                        | Home page section titles and archive year headings.                                                                                                                                                                                                                        |
| lead           | `1.125rem` / 1.7                                       | Home page lead description.                                                                                                                                                                                                                                                |
| ui-large       | `0.9375rem`                                            | Primary/secondary buttons, home index entries, and recent changelog rows.                                                                                                                                                                                                  |
| ui             | `0.875rem`                                             | Navigation, running head, rail titles, and figure captions.                                                                                                                                                                                                                |
| ui-small       | `0.8125rem` / 1.5                                      | Rail items, metadata, table headers, and timestamps.                                                                                                                                                                                                                       |
| label          | `0.75rem`                                              | Number columns and code language tags.                                                                                                                                                                                                                                     |
| code           | `0.8125rem` / 1.7                                      | Fenced code listings.                                                                                                                                                                                                                                                      |

### Named Rules

**No negative letter-spacing.** Tight presets tuned for Latin headlines crush Hanzi strokes; keep `letter-spacing: 0` on prose and at most `0.01em` on headings.

**No italics in Chinese.** `em:lang(zh)` switches from italic slant to under-right emphasis dots (`text-emphasis: dot; position: under right`). Latin prose and pure-Latin `em`/`i` spans inside Chinese paragraphs (auto-tagged `lang="en"` by `rehype-a11y`) retain true italic styling.

**Tabular numerals everywhere.** Chapter numbers, dates, reading durations, counts, and table figures always apply `font-variant-numeric: tabular-nums` so number columns align vertically.

**Modern CJK typesetting (progressive enhancement).** Apply `text-autospace: normal`, `text-spacing-trim: trim-start`, `line-break: strict`, `overflow-wrap: anywhere`, and `hanging-punctuation: first allow-end`. Prose paragraphs and list items use greedy wrapping (`text-wrap: wrap`) so lines fill completely before breaking under strict CJK punctuation rules, avoiding `pretty` where it leaves awkward premature rags on Chinese text. Chapter titles, headings, navigation entries, and card titles likewise avoid forcing `balance`, `pretty`, or `keep-all`; instead, build-time transforms insert `<wbr>` at `Intl.Segmenter` CJK word boundaries and long technical identifier boundaries (slash paths, `CamelCase`, `snake_case`, dotted module paths) so titles fill each line before breaking cleanly at semantic boundaries. Authors never need to manually insert spaces between Hanzi and Latin words.

**Monospace strictly for code and data.** Never use monospace fonts as generic "tech aesthetic" decoration — numbers, tags, and navigation always stay in the proportional sans family.

## Layout

| Region                    | Specification                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Outer shell `.wisp-shell` | `measure` (`42rem`) + `2×side` (`14rem`) + `2×gutter` (`4rem`); shared across header, footer, article grid, and home page so outer edges align globally.                                                                                                                                                                                    |
| Page padding              | `20px` mobile, `32px` at `≥768px`.                                                                                                                                                                                                                                                                                                          |
| Header                    | `56px` tall (`--wisp-header-h`), sticky, solid background with `1px rule` bottom border.                                                                                                                                                                                                                                                    |
| Article page `≥60rem`     | Two columns: prose + right TOC; when inside a series, the collapsible series `<details>` sits in the first row of the prose column (above the chapter opener) while the TOC spans both rows and sticks.                                                                                                                                     |
| Article page `≥80rem`     | Three columns (`Series \| Prose \| TOC`) with fixed column tracks so expanding/collapsing the series rail never shifts the prose column; series rail starts collapsed as one toggle row paired with the TOC header; `h2` numbers hang in the left gutter.                                                                                   |
| Article page `<60rem`     | Single column; series (`<details>`) sits above the title and TOC (`<details>`) sits below the opener.                                                                                                                                                                                                                                       |
| Side rails                | Sticky (`header-h + 2rem`). Rail headers stay pinned while the item list scrolls independently; outer edges align flush with `.wisp-shell`. Rail scrollbars are hidden and indicate overflow via top/bottom fade masks. Opening or expanding the series rail auto-scrolls the active chapter to roughly one-third from the top of the rail. |
| Code listings             | Aligned flush with both left and right edges of the prose column.                                                                                                                                                                                                                                                                           |
| Wide content `.wisp-wide` | Expands symmetrically out to `min(100vw - 40px, 64rem)` when no sidebar is present; stays strictly within `100%` of the prose column whenever a TOC or series rail is shown.                                                                                                                                                                |
| Home TOC                  | One row per series: part title column on left (sticky at `≥60rem`) and chapter index on right (two columns at `≥80rem`).                                                                                                                                                                                                                    |
| Vertical rhythm           | Home sections `5rem`; prose `h2` `2.5em` top / `0.75em` bottom (clear grouping by proximity); prose blocks (code, tables, display math, figures, note blocks, explainers) uniformly use `--wisp-block-gap` (`1.75em`, ~30px at body size).                                                                                                  |

**Scrollbars & overflow fades:** On hover-capable Chromium/WebKit desktops, the root document and scrollable regions render arrowless rounded floating thumbs via `::-webkit-scrollbar` (`color-mix(in srgb, var(--wisp-fg) 52%, transparent)` at rest, `72%` on hover for ≥ 3:1 non-text contrast, boosted further under `prefers-contrast: more`; internal scrollers keep `--wisp-sb: transparent` at rest and reveal immediately on hover, focus, or active drag; `scrollbar-color` is intentionally omitted on `html` and containers so Chromium 121+ does not revert to arrowed native scrollbars). Desktop Firefox and touch devices (`hover: none`) fall back to standard `scrollbar-width: thin` / `scrollbar-color`, while `forced-colors: active` defers to system scrollbars. Navigation scrollers (side rails `[data-rail-scroll]` and header `.wisp-nav ul`) keep `scrollbar-width: none` paired with pure-CSS `scroll(self inline/block)` fade masks (`mask: ... no-clip subtract`). All internal scroll containers set `overscroll-behavior` to prevent scroll chaining, and overflowing non-code blocks support 1D/2D pointer drag-panning (the Lightbox uses a dedicated full-viewport zoom/pan canvas). Horizontal overflow containers dynamically gain `tabindex`, `role="region"`, and an accessible label only when they actually overflow.

**Adaptive color & typography hints:** `<head>` emits `<meta name="color-scheme" content="light dark" />` (paired with `light-dark()` tokens across the stylesheet so dark mode follows OS preferences with zero JS) and `<meta name="text-scale" content="scale" />`. No fixed `font-size` is set on `html` (only `1.0625rem` on `body` at `≥48rem`), and `prefers-reduced-motion: no-preference` gates spatial transforms without suppressing helpful color or opacity state feedback.

Spacing steps in `4px` increments: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96`. Breakpoints use Tailwind's standard scale (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280) plus the layout-specific `60rem` and `80rem` thresholds.

## Elevation & Depth

**Zero shadows, no exceptions.** Hierarchy is built strictly through scale, weight, whitespace, and hairlines. Even horizontal overflow cues shun box shadows: overflowing containers (code blocks, tables, display equations, Mermaid diagrams, explainer stages) fade content out over `1.5rem` at whichever edge still has hidden content via background-agnostic `mask-image`. Reaching an edge removes that side's fade, non-overflowing blocks draw none, and keyboard focus clears the fade so the focus ring stays crisp.

### Named Rules

**Rules instead of shadows.** Use `1px rule` to separate peers, `1px ink` to close complete units (booktabs top/bottom rules, recent changelog lists, chapter-end prev/next navigation), and `2px ink` exclusively above home section headings like chapter divider sheets in a printed manual. Never pair borders with drop shadows.

**No frosted glass headers.** The sticky header uses an opaque `paper` fill + bottom hairline; reading progress renders as a `1px teal` line riding directly along that seam.

## Shapes

Only two core corner radii exist (alongside `2px` reserved for focus rings and `999px` for floating scrollbar thumbs):

- **box `4px`**: code listings, note blocks, explainer cards, buttons, figures/images, floating controls, tooltips/popovers.
- **mark `3px`**: inline code chips, `kbd`, `<mark>` highlights, task list checkboxes, small utility buttons (copy, wrap, player step controls).

Never use pill shapes, circular buttons, or any corner radius larger than `4px`.

## Components

### Buttons

- **Primary**: `accent` teal fill with `accent-fg` ink, `44px` height, `18px` horizontal padding, `4px` radius, `0.9375rem` / `500`. Lifts `1px` and mixes 12% toward `ink` on hover; settles and scales to `0.98` on press.
- **Secondary**: `paper` fill, `1px rule` border, `ink` text; border shifts to `muted` on hover.
- Keep at most one primary button per viewport. Icon-only buttons (theme toggle, copy, lightbox close) are `44×44` transparent hit targets with `4px` corners that respond only via color change on hover while preserving a `2px`-radius focus ring.
- **Theme toggle**: a two-state button toggling light and dark directly (synchronizing `<meta name="color-scheme">` and `aria-pressed`, deleting `localStorage('color-scheme')` whenever toggled back to match OS preference to restore native `light dark`). The `sun` / `moon` icon visibility is driven purely by CSS (`:has(> head > meta[name='color-scheme'])` + `@media (prefers-color-scheme: dark)`), eliminating first-paint flicker.
- **Back to top**: a `44×44` `position: sticky` button placed at the end of the article, shown and hidden purely via `@container scroll-state(scrollable: top)` so it parks naturally above the footer; activating it transfers focus cleanly to `h1` / `#main` rather than losing focus to `body`.

### Running head (signature component)

Left side of the header displays the brand mark and site title. On article pages belonging to a series, it appends `/ Series Name · 7 / 23` (counts in `accent` teal with `tabular-nums`), then fades in `· Chapter Title` (`200ms` via `IntersectionObserver`) once the article `h1` scrolls past the viewport. Structural `/` and `·` separators render in `subtle` and are hidden from screen readers. Brand mark, running head, and nav items align on a single baseline, and the series name links to the series overview. At `≥80rem` with JS enabled, `7 / 23` acts as an inline toggle (`1px` underline on hover/open) controlling the left series rail identically to the rail's own header button so readers can open the chapter list from anywhere down the page. Below `60rem`, the running head hides and yields to the in-flow series `<details>` above the title. Custom site headers receive this metadata via the `running` prop (`href` and `position` mark a series entry and render a `[data-series-toggle]` button).

### Chapter opener

Display chapter number (large light-weight teal) + title + single-line metadata (`date · reading time · category`, no icons) + `#tag` row, underscored by a `1px rule`. **Zero eyebrows.** Titles without a leading numeric prefix omit the chapter number cleanly.

### Numbered navigation (series rail & TOC)

Uses a two-column grid: fixed tabular number column (`muted`, darkening to `ink` with title on hover) + hanging-indented title column. Unnumbered entries (such as a series overview post) omit the empty number cell and span cleanly from the left axis. Visually, the two rails serve distinct roles: the left **series rail** is a discrete chapter index with no full-height vertical line — items align flush with the rail header and mark only the active chapter with a short `2px teal` outer tick (number turns `accent`, title turns `ink` bold). The right **TOC** is a continuous in-page scroll track keeping a `1px rule` left guide across all items and highlighting active sections with a `2px teal` segment (weight `500`, `h3` scaled down to `0.78125rem` with widened number track). On `<60rem` viewports, collapsible series and TOC `<details>` blocks mirror the same visual distinction while reserving a `6px` left focus-ring buffer and `44px` touch row height. TOC numbering shares the identical CSS counter algorithm as body `h2`/`h3` headings (active only when top-level headings start at `h2`).

**Series rail (`≥80rem`) defaults collapsed.** At rest it renders one sticky `2.5rem` `<button>`: series title (`0.875rem` / `600` `ink`) + `7 / 10` (`0.75rem` `muted` tabular) + a Lucide chevron inside a `1.75rem` box (down = collapsed, up = open), matching the TOC header bar in font size, height, sticky offset, and baseline so the pair balance across the reading column. Opening reveals the item list in place (`150–200ms` opacity + `0.375rem` translate, disabled under reduced motion, avoiding height transitions) and rotates the chevron `180°`. State lives in `html[data-series="open|collapsed"]`, restored before first paint from `localStorage['wisp-series-open']` with `aria-expanded` / `aria-controls` kept in sync (`title` toggles expand/collapse). Without JS (`html:not([data-toc])` parity), buttons hide and full lists render expanded statically. From `60–80rem` down, series navigation renders as `<details>` above the title with the same `<summary>` composition (`Series Name` + `7 / 23` + trailing chevron).

**TOC header** mirrors the series header (`<button>` label + trailing chevron, `2.5rem` height, right-aligned to `.wisp-shell`); collapsing leaves the labeled row intact and hides only the outline. Collapsible mobile TOC matches this `<summary>`. Parent `h2` rows with subsections place a `1.5rem` chevron (right/down) pinned at the right edge aligned with the first title line. Clicking a TOC link highlights the item immediately; reaching page bottom highlights the final section.

**Keyboard order:** Series rail → TOC → Main prose (DOM matches logical flow while CSS grid controls visual columns). The TOC serves as entry navigation into prose and takes a single Tab stop when collapsed. Rail wrappers are plain `<div>` containers, placing landmark labels solely on their inner `<nav>` (`Table of Contents` / `Series: <name>`).

### Code listing

`1px rule` border, `4px` radius, `code-bg` fill, topped by a `2.125rem` (`2.75rem` on touch) caption bar separated solely by a hairline rule: lowercase language name on the left (`mono` `0.75rem` `muted`), matched icon controls on the right — word-wrap toggle (Lucide `wrap-text`, `aria-pressed`, teal when active, rendered only on blocks that actually overflow horizontally when unwrapped) and copy button (Lucide icon transitioning to `sem-done` with `aria-live` announcement). Line numbers use CSS counters in `subtle` and `user-select: none`. Long listings collapse with a bottom fade and "Expand" button (44px tall at `<64rem` or on touch devices matching the header bar); clicking "Collapse" at the bottom of an expanded block scrolls the block header back below the sticky site header (`scroll-padding-top`, instant under reduced motion) while keeping focus on the toggle button.

**Line wrapping:** Long lines scroll horizontally by default (fade-masked on overflow); sites can opt into default wrapping via `features.codeWrap`. Reader toggles persist in `localStorage` across the page before first paint. Wrapped logical lines display a line number only on their first visual row, indent continuation rows `2ch` past the code origin, and span `diff` highlights across the entire logical line. Print stylesheets always wrap code lines.

### Tables (booktabs three-rule)

`1px ink` top and bottom rules, `1px` `color-mix(45% ink / rule)` header divider, `1px rule` between body rows. Headers render in `0.8125rem` / `600` / `muted`; body cells never bold automatically. Text left-aligns with zero outer indent on the first column; inline code inside cells breaks only at whitespace rather than splitting tokens (`file.py:234-358` stays intact), and descriptive columns (`data-wisp-prose` tagged by `rehype-a11y`) receive a readable `min-width` floor so short numeric columns cannot crush prose cells into narrow strips. Tables sit inside `div.wisp-table` (flush with both edges of the prose measure, breathing gap above the thin horizontal thumb). Overflowing tables stick column 1 to the left (gaining a `1px rule` seam once scrolled) and enable keyboard focus + pointer drag-panning; on narrow viewports (`≤40rem`), inherited `max-width: 100%` relaxes and sticky column + sibling cell max-widths stay capped so every column fits inside the viewport beside sticky column 1 while long code tokens can wrap cleanly.

### Note block / Disclosure

Markdown blockquotes act as manual "Note" callouts: `surface` fill + `1px rule` border (matching code listings, essential in dark mode where `surface` sits close to `paper`) + `4px` radius + body ink text — upright roman type with **no colored left accent bar**. Inline disclosures (`<details>`) share this exact container language (`surface` + `1px rule` + `4px` radius), with a `≥44px` `<summary>` row and trailing Lucide chevron; inline code inside an expanded disclosure switches to `paper` fill for separation. Below `40rem`, both components tighten horizontal padding to `1rem`.

### Figures

**One unified caption model** across draw.io / Excalidraw diagrams, Mermaid diagrams, Markdown images, and `<Figure>`: `<figure class="wisp-figure ...">`, media above, caption below (CJK convention places figure captions below and table captions above). Captions set in `muted` `0.875rem` / `1.6` stay **flush with the prose left margin** even when narrower artwork centers horizontally. When a caption begins with a figure prefix (`图 05-1：`, `图 3:`, `Figure 2.`, `Fig. 2:`), the prefix extracts into `.wisp-fig-no` (`ink`, `600`, tabular); unprefixed captions remain plain prose captions without auto-numbering.

- **Caption + Actions** (e.g., diagram "Source" / "draw.io" links): the caption spans the full `100%` measure with `text-wrap: pretty` so long/short captions never compete with tool buttons. Action links share one hairline toolbar across viewports (solid `paper` fill, `1px rule` border, `4px` radius, zero shadow, `1px rule` vertical divider between items, `0.75rem` `muted` transitioning to `accent` on hover, Lucide icon + terse label with descriptive `aria-label` / `title`). On hover-capable wide screens (`≥40rem`, `hover: hover`, `pointer: fine`), the bar floats top-right over the diagram (`opacity: 0` at rest) and fades in over `150ms` on hover or focus-within; accessible figure names bind solely to the caption text via `aria-labelledby`.
- **Actions only:** floats top-right identically on desktop. **Caption only:** renders caption alone. Neither present: bare diagram frame.
- **Touch or `<40rem`:** the action toolbar renders statically below the caption (or figure) flush left, preserving a `≥44px` hit target via expanded transparent link insets while keeping its visual bar compact; actions hide in print.
- **Markdown images:** standalone paragraph images with a title (`![alt](./x.webp '图 05-3：…')`) are promoted into figures by `rehype-figure`, moving `title` into the visible caption and stripping duplicate `img[title]` browser tooltips; untitled inline images remain untouched, and Astro image optimization works seamlessly. Mermaid diagrams accept captions via fenced metadata (` ```mermaid caption="图 3：…" `).
- **Artwork framing:** bitmap images and standalone `.svg` figures inside a figure receive a crisp `1px rule` hairline border in both themes so white-background illustrations separate cleanly from dark paper without filters or color inversion.

Artwork scales down proportionally to container width and never scales past its natural dimensions in-flow; on narrow screens (`≤40rem`), standard (non-`.wisp-wide`) figures bleed `0.5rem` outward on each side for breathing room while captions remain flush with the prose column. `.wisp-diagram-body` shares Mermaid's legible minimum-width floor (`min(var(--wd-w), max(100%, min(31rem, calc(var(--wd-w) * 0.72))))`), scrolling horizontally inside the figure (with drag-pan and keyboard focus) rather than shrinking labels below legibility.

Clicking any image/diagram directly — or activating its corner trigger `<button data-wisp-lightbox-trigger>` (revealed on hover/focus on desktop, always visible on touch) — opens the **full-viewport Lightbox inspector** on a solid `paper` canvas:

- Inline SVGs auto-fit to a comfortable viewport proportion (capped at `1.65×` so crisp diagrams never overwhelm small screens or stay tiny on wide monitors); bitmaps open at `min(fit, 1:1)`.
- Supports cursor-anchored scroll-wheel zoom, trackpad pinch zoom and two-finger 2D pan, immediate and zoomed 2D pointer/touch free dragging across **all** media types (bitmaps, Mermaid, draw.io, and Excalidraw alike — clamped with safe visibility margins so at least one corner always remains inside the viewport), two-finger touch pinch zoom, double-click / double-tap zoom toggle & reset, and full keyboard navigation (`+` / `=` / `-` / `_` / `0` / `1` / Arrow keys / `Esc`). Inline SVGs commit crisp vector width/height attributes once wheel/pinch/drag interaction settles so text labels and `<foreignObject>` KaTeX/MathJax formulas stay razor sharp at any zoom level.
- A fixed `44×44` close button stays anchored top-right. The bottom-centered hairline toolbar (`- | % | + | reset`, `4px` radius, `1px rule` border and dividers, `tabular-nums`) and caption echo stay hidden at rest and fade in only when the pointer moves, focus enters the toolbar, the screen is tapped, or the view differs from its initial fit/scale (deep zoom suppresses the caption echo to keep artwork unobstructed). Clicking empty canvas or pressing `Esc` closes the dialog and restores focus to the trigger.

**Never display scale percentages or magnification badges inline on figures or captions:** diagrams should be authored cleanly for the `42rem` column (`640–700px` natural width) rather than drawn oversized and pushed onto the viewer to zoom. Math expressions (`math="1"`) inside draw.io labels render inline. Mermaid caps minimum inline downscaling at `75%` before falling back to horizontal container scroll.

### Explainer (interactive diagrams)

Designed as an inline interactive derivation plate in the manual, using a 3Blue1Brown-inspired HTML + SVG hybrid choreography powered by Motion (`motion/react`), never a video player bar. Matches the prose column width by default (`wide = false`; opt into `wide` strictly for genuinely wide multi-column stages). Framed cleanly by one `1px rule` outline, `4px` radius, and `paper` stage background from top to bottom:

- **Header toolbar**: Left title reusing static-caption syntax when prefixed with a figure number (`图 2：`, `Figure 2:` — `.wisp-fig-no` `ink` `600` tabular, remainder `muted` regular). Right cluster groups the step counter (`3 / 6`, `muted` tabular reserved to widest count width) and borderless `34×34` (`44×44` on coarse pointers) Lucide icon buttons: Previous (`←`), Next (`→`), Replay (`rotate-ccw`, `R`), calm Auto Walkthrough (`play`/`square`, `3.6s` default dwell, active state flips to solid `accent` teal), and Fullscreen Expand (`maximize-2`, `F`). When `title` is omitted, the step counter anchors the header left.
- **Top stage navigation**:
  - **≤ 8 steps**: a single-row `surface` stage tab bar (`role="tablist"`) displaying tabular step numbers (`01`, `02`, …) and optional short semantic `Step.label` titles, separated by hairline vertical ticks; the active tab resets to `paper` background and carries a bottom `2px accent` bar animated smoothly with Motion `layoutId`. Below `40rem`, labeled tabs wrap into a clean 3-column grid so labels never truncate or collide.
  - **> 8 steps**: collapses into the header bottom `1px rule` scrub rail (thickening to `2px accent`, `1×7px` discrete ticks up to 24 steps, invisible `<input type="range">` hit band with square `3px`-radius hover/focus thumb).
- **Stage & Choreography**: `paper` canvas receiving `(step, index, { replayKey, expanded, reducedMotion, total })`. Complex explainers combine semantic HTML Flex/Grid math blocks (`<RichText>` KaTeX, `layout` / `layoutId` shared element continuity) with crisp inline SVG brackets and connectors (`pathLength` stroke drawing) rather than crowding multi-stage mechanics into one tiny SVG canvas. Stage height uses a minimum-height ratchet — growing monotonically at a given width and resetting on viewport or fullscreen changes — and accepts an optional desktop `stageMinHeight` lock (`--wisp-explainer-stage-min-h`, relaxed to `auto` below `40rem`) so multi-stage explainers stay 0px-jittered from the first step. Step 0 mounts cleanly without entrance replay (`initial={false}` matching SSR), while explicit Replay (`replayKey`) or step changes trigger choreographed beats.
- **Fullscreen `<dialog>` theater**: clicking Expand (`F`) opens a native modal `<dialog>` (`min(94vw, 1120px)` width, fixed `min(84dvh, 720px)` desktop theater height relaxing to `auto` on `<40rem`, `1px rule` border, `4px` radius, `paper` canvas, semi-opaque ink backdrop) while holding an inline height placeholder in the article so scroll position never jumps. React step, walkthrough, and component state stay live across expand and close; pressing `Esc` or clicking the backdrop returns focus cleanly to the Expand button.
- **Caption well**: `surface` background separated by a `1px rule` top border, `ink` text at `0.9375rem` / `1.65` (`0.875rem` on mobile), supporting inline KaTeX (`$…$`). Every step's caption occupies the same CSS grid cell inside CaptionGhosts so height stays locked to the tallest step, with the active sentence in `aria-live="polite"`.
- **Accessibility & Motion**: disabled boundary Previous/Next buttons keep `aria-disabled="true"` instead of `disabled` so keyboard focus stays put; system `prefers-reduced-motion: reduce` respects `<MotionConfig reducedMotion="user">` while preserving full manual and walkthrough controls; strictly zero shadows, gradients, frosted glass, pill capsules, or `rx="2"`.

### Citations

Authors write standard GFM footnotes (`[^key]`), rendered like formal engineering citations:

- **In-text markers**: true superscripts in `accent` teal, weight `500`, `tabular-nums`, enclosed in square brackets `[1]` (GB/T 7714 sequential citation style, unambiguous next to mathematical exponents); adjacent markers merge cleanly (`[1, 2]`). Underlines appear only on hover. A `~24px` hit target preserves zero marker line-height so cited and uncited prose share identical leading, and non-breaking attachment keeps markers from stranding at line starts.
- **Click & focus behavior**: footnote links and backlinks smooth-scroll (jumping instantly under `prefers-reduced-motion: reduce`) and flash a `2s` highlight; footnote `<li>` items and `h2–h6` headings carry `tabindex="-1"` so focus lands on the target rather than resetting to `body`.
- **Hover preview**: declaratively driven by build-time `<div popover="hint" role="tooltip">`, `interestfor`, `aria-describedby` (pointing to the matching note card), and CSS Anchor Positioning (`position-area` + `position-try-fallbacks`); dismisses immediately on `Esc` or pointer leave.
- **Reference list**: section title (`References` / `参考与注释` in `0.875rem` / `600` `ink`, excluded from `h2` numbering and TOC), separated from prose by a `1px rule` (leaving the single `1px ink` closing rule to the Prev/Next divider below). Uses bracketed `[n]` numbers aligned flush with the heading in a fixed `muted` tabular track and hanging-indented `0.875rem` `muted` note text; inline code inside notes keeps softer contrast on `code-bg` and long URLs wrap inside the column. Each entry ends with one subtle Lucide `arrow-up` backlink (hover `accent`) rather than repeating trailing backlink counters.

### Prev / Next (chapter end)

A single `1px ink` closing rule caps the article, followed by two side-by-side columns: small `muted` directional label with arrow icon + `ink` chapter title; hover shifts both label and title to `accent` teal and nudges the arrow outward by `3px`. Never boxed as cards.

### Home (title page & master TOC)

Title section: site nameplate (`home-title`), lead description, edition metadata line (`2 series · 33 posts · updated ...`), primary CTA (`Start reading "..."`) + secondary action. Below follows: **Contents** (one block per series: teal part number + series title, subtitle, blurb, entry count & date on the left; full numbered index on the right with `number · title · dot leader · reading time`, fixed `muted` tabular numbers, hanging-indented titles, dot leaders extending from the final line of each title to baseline-aligned reading times like printed book pages) → **Other essays** (standalone posts outside any series) → **Changelog** (booktabs log of `date | number | title | series`, preserving fixed number columns for numbered posts and collapsing on `<40rem` to `date · series` above a full-width `number + title` line so series context stays intact). Under `pointer: coarse`, index and changelog rows ensure `≥44px` link hit heights without enlarging type or line-height. Only the home title block plays a one-shot entrance (`520ms` rise, `60ms` stagger); nothing else animates on entry.

### Archive / Tags

Archive organizes posts into one booktabs table per year (`MM-DD | number | title | series`). Leading `05 ` prefixes extract into the fixed `muted` tabular number column matched to the home TOC; whenever at least one post is numbered, every row reserves the column so titles align vertically across mixed entries. Below `40rem`, non-empty series names render as a secondary line aligned beneath the title so chapters from different series stay clear. Tag and category indexes display plain text links (`#tag` + `muted` tabular count, hover `accent`) without pill backgrounds. Tag, category, and paginated archive pages reuse the standard page header (`title` + `description` + `1px rule`), separating posts with `1px rule` hairlines. On touch devices and viewports `<48rem`, full-row links (archive/changelog rows), index links, pagination controls, collapsible TOC/series links, metadata links, and footnote backlinks enforce `≥44px` hit areas, while inline chip/tag links keep `≥32px` height with `≥8px` separation.

### Icons

Strictly Lucide icons (inlined SVG at build time via `Icon.astro`, or lightweight path helpers like `PlayerIcon.tsx` in React), `stroke-width: 2`, `1em` box, colored with `currentColor`. **Never use emoji or raw Unicode glyphs (`▶`, `⏮`, `✓`, `←`, etc.) as UI icons.**

## Do's and Don'ts

### Do:

- **Do** keep every number unified across the interface: chapter openers, `§` headings, TOC entries, and series rail items must derive from one data model.
- **Do** establish hierarchy with hairlines and whitespace: `1px rule` between peers, `1px ink` to close units, `2px ink` exclusively above home section titles.
- **Do** set all numbers in `tabular-nums` inside fixed-width columns with hanging-indented titles.
- **Do** reference internal theme components via `virtual:wisp/components/<Name>`, and place CSS rules in their proper cascade layer (`components` for chrome, `utilities` for prose content).
- **Do** craft native browser surfaces with equal care: text selection highlight, focus rings (`2px` teal, `2px` offset), floating scrollbars, and `text-underline-offset: 0.25em`.
- **Do** disable all transitions and entrance animations cleanly under `prefers-reduced-motion: reduce`.
- **Do** author figures for the `42rem` prose measure (`640–700px` natural width, vertical flow preferred); excessively wide horizontal diagrams become illegible when scaled down.
- **Do** keep diagram nodes visually neutral by default and reserve categorical hues (`≤ 3` per diagram, `slate` excluded) strictly for active semantic distinctions, using heavier strokes for emphasis.

### Don't:

- **Don't** build lists out of shadowed cards, nest cards inside cards, or float navigation cards on hover.
- **Don't** place eyebrows or kickers above titles.
- **Don't** draw colored left bars (`> 1px`) beside blockquotes, callouts, or list items.
- **Don't** use frosted glass, background/text gradients, or glowing outlines.
- **Don't** substitute emoji or Unicode symbols for vector icons.
- **Don't** apply negative letter-spacing or oblique italics to Chinese text.
- **Don't** leak monospace type into body copy, headings, or navigation chrome.
- **Don't** pull categorical or semantic diagram hues into page chrome, or introduce any second UI accent alongside teal.
- **Don't** use corner radii larger than `4px` or pill capsules — including inside diagram nodes.
- **Don't** color-code sibling diagram nodes solely for contrast, dye node text to match stroke colors, or introduce saturated colors outside the ink palette.
