# Visual Design

[< Development guide](index.md)

Nayuta pairs compact, monospace interface elements with larger reading text.
Use restrained borders, muted metadata, and clear spacing to keep articles and
personal content prominent. Color accents identify links and interaction states.

The current visual reference is
[global.css](../../src/assets/styles/global.css), the
[theme palettes](../../src/assets/styles/themes/),
[frame.astro](../../src/layouts/frame.astro), and
[Prose.astro](../../src/layouts/components/Prose.astro).

## Color and Surfaces

The five bundled palettes are selected through `theme` in `src/config.ts`:

| Palette         | Appearance                                                                   |
| --------------- | ---------------------------------------------------------------------------- |
| `nayuta`        | Charcoal surfaces, pale text, and blue accents; the checked-in site default. |
| `nayuta-aqua`   | Deep blue surfaces with cyan accents.                                        |
| `midnight-blue` | Near-black navy surfaces with blue accents.                                  |
| `sakura-pink`   | Dark plum surfaces with pink accents.                                        |
| `oled-dark`     | Black and grayscale surfaces, text, and accents.                             |

Each palette defines the same color variables; typography and layout come from `global.css`.

| Token                                                   | Visual role                                 |
| ------------------------------------------------------- | ------------------------------------------- |
| `--ny-color-bg`                                         | Page background.                            |
| `--ny-color-surface`                                    | Cards and drawers.                          |
| `--ny-color-surface-container`                          | Controls and code backgrounds.              |
| `--ny-color-surface-elevated`                           | Raised surfaces and table headers.          |
| `--ny-color-text`                                       | Primary reading text and labels.            |
| `--ny-color-text-muted`                                 | Supporting descriptions and metadata.       |
| `--ny-color-text-subtle`                                | Low-emphasis labels and separators.         |
| `--ny-color-primary`                                    | Primary accent and selected fills.          |
| `--ny-color-primary-hover`, `--ny-color-primary-active` | Accent interaction states.                  |
| `--ny-color-primary-text`                               | Text on primary fills.                      |
| `--ny-color-danger`                                     | Red image-failure indicators.               |
| `--ny-color-border`                                     | Quiet boundaries and dividers.              |
| `--ny-color-outline`                                    | Link hover, focus, and highlighted details. |
| `--ny-color-shadow`                                     | Theme-specific shadow color.                |

The drawer mask and sticky header use `--ny-color-mask` and
`--ny-color-header-bg`, mixed from the page background at 80% and 85% opacity.
Retain sufficient contrast for reading, controls, and focus across all palettes.
Use labels, shape, or position alongside color to communicate state.

## Typography

`--ny-font-ui` uses JetBrains Mono, Fira Code, `ui-monospace`, and `monospace` in
that order. `--ny-font-prose` and `--ny-font-code` currently share this stack.
The fonts are loaded from Google Fonts, with system monospace fallbacks.

| Role                              | Size token                   | Current size                              | Line height        |
| --------------------------------- | ---------------------------- | ----------------------------------------- | ------------------ |
| Body prose and post summaries     | `--ny-font-size-prose`       | `1rem`                                    | `1.75`             |
| Page titles and prose `h1`        | `--ny-font-size-title`       | `1.75rem`; `1.5rem` at widths up to 768px | `1.2`              |
| Prose `h2` and post-list titles   | `--ny-font-size-heading`     | `1.375rem`                                | `1.4`              |
| Prose `h3`                        | `--ny-font-size-subheading`  | `1.125rem`                                | `1.4`              |
| Prose `h4`–`h6`                   | `--ny-font-size-prose`       | `1rem`                                    | `1.4`              |
| Tables, code blocks, and captions | `--ny-font-size-prose-small` | `0.875rem`                                | `1.6`              |
| Reading metadata and pagination   | `--ny-font-size-meta`        | `0.8125rem`                               | Component-specific |
| Default interface text            | `--ny-font-size-ui`          | `0.8125rem`                               | `1.5`              |
| Small interface labels            | `--ny-font-size-ui-small`    | `0.75rem`                                 | Component-specific |
| Sidebar metadata and breadcrumbs  | `--ny-font-size-ui-meta`     | `0.6875rem`                               | Component-specific |
| Footer and micro labels           | `--ny-font-size-ui-micro`    | `0.625rem`                                | Component-specific |
| Profile name                      | `--ny-font-size-ui-title`    | `1.25rem`                                 | Inherited          |

The corresponding line-height tokens are `--ny-line-height-prose`,
`--ny-line-height-title`, `--ny-line-height-heading`, `--ny-line-height-compact`,
and `--ny-line-height-ui`. Interface letter spacing is `-0.01em`.
The special `.post-heading-huge` treatment uses `--ny-font-size-display`
(`2.5rem`), uppercase text, and a tight `1.1` line height.

Keep the compact UI scale separate from the reading scale. Prose paragraphs have
a `1.125em` bottom margin. Level-two headings use 32px above, 12px below, and a
thin bottom divider; level-three headings use 24px above and 8px below. Levels
five and six are progressively muted, with uppercase treatment at level six.
Inline links, emphasis, and code retain the surrounding text size.

## Spacing and Shape

The shared spacing scale is `--ny-space-1` through `--ny-space-6`: 4, 8, 12, 16,
20, and 24px. Radius tokens run from `--ny-radius-xs` through `--ny-radius-xl`:
2, 4, 8, 12, and 16px. Cards and reading images generally use the medium radius;
compact controls use small or extra-small radii.

Favor thin borders and whitespace over large shadows. Sidebar sections use a
compact header and bottom divider. Buttons have a 28px base height, a subtle
surface fill, and a primary fill on hover. The current styles use local shadow
and transition values; there is no shared shadow, timing, or z-index token scale.

## Responsive Composition

The frame has a flexible main column, an optional 250px left column
(`--ny-layout-left-width`), and an optional 200px right column
(`--ny-layout-right-width`). Outer inline padding is `clamp(24px, 5vw, 64px)`,
block padding is `clamp(28px, 6vh, 56px)`, and column gaps are
`clamp(24px, 4vw, 48px)`.

`--ny-layout-page-max-width` is 1920px; the frame adds gaps and outer padding to
its container limit. The main region is capped at 1670px, or 1470px when the right
column is visible. Although `--ny-layout-main-width` is declared as
`minmax(0, 680px)`, the current frame does not use it.

| Viewport width | Composition with drawer enhancement enabled                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Above 1120px   | Left and optional right columns flank the main region; breadcrumbs appear above the body.                                                                                             |
| 769–1120px     | Left column remains visible; right content moves to a drawer opened by the floating control. A 48px sticky header holds breadcrumbs.                                                  |
| Up to 768px    | Single column with 24px block / 20px inline padding and 24px row gaps. Left widgets use the menu drawer; the profile stays above the body. The footer appears below the main content. |

At small widths the profile keeps its vertical arrangement. Right drawers exist
only when the page has right-side content. Without JavaScript, sidebar content
remains in the page flow. The frame uses literal 1120px and 768px media queries;
the friends template also has a local 640px adjustment.

Drawers are at most 300px wide and leave at least 32px of viewport space. A
translucent, blurred backdrop separates them from the page. The floating context
control respects bottom and right safe-area insets.

## Reading Elements and Controls

- Links use text color with an underline in prose, changing to the outline color
  on hover. Secondary navigation can omit underlines until hover or focus.
- Blockquotes use an accent left border, muted italic text, and a lightly tinted
  background. Nested quotes remain visually distinct.
- Images stay within the reading region and retain their aspect ratio. Captions
  are smaller, muted, centered, and italic.
- Post copyright cards sit after article prose in a quiet bordered surface with
  compact UI text. Their metadata and links must wrap on narrow viewports.
- Tables and code blocks scroll horizontally within their own region. Table
  headers use an elevated surface; code uses a container surface and quiet border.
- Pagination is left-aligned, compact text: `[prev] 1 [2] 3 [next]`. Only the
  current number is bracketed and bold. Avoid filled page-number buttons.
  Narrow selectors retain available previous/next links; without JavaScript,
  controls can wrap. Empty or single-page lists have no selector.
- Search uses the archive's post summaries and pagination, with no separate result
  card design. Highlighted title or excerpt text uses `<mark>` with
  `--ny-color-primary` and `--ny-color-primary-text`. Long queries and excerpts
  wrap within the reading column. The sidebar search widget is a single compact
  input with an accessible label and the shared input focus treatment.
- Draft labels use the plain `[draft]` treatment, and drawer close controls use
  `[Close]`. These controls share the theme's understated bracket notation.
- Icons use Font Awesome 6 or SVGs that inherit text color. Keep icons aligned
  with labels and retain a visible focus indicator on interactive elements.

Use the typography sample at `/posts/typography-test`, post summaries, the friends
page, and `/demo` as visual references. Compare wide desktop, the 1120px and 768px
transitions, and a narrow phone viewport when adjusting shared styles.

## Image Loading and Viewer

Image placeholders use the surface-container color mixed with the current primary
color. The mix cycles from 8% to 22% and back over two seconds with `ease-in-out`.
After full decoding, the image fades from zero to full opacity over 180ms with
`ease-in`. Error states stop the pulse and center a 32px crossed-circle SVG using
`--ny-color-danger`. Reduced-motion preferences disable both animations.

The PhotoSwipe viewer is scoped under `.pswp--nayuta`. Its opaque background color
comes from `--ny-color-bg`, with opacity applied by the library. Controls use the
UI font with transparent backgrounds and no borders. White text uses `difference`
blending on the entire top bar (including the counter) and each navigation button
to invert the pixels underneath, including images during zoom and pan. Hover adds
an underline; focus rings use the same adaptive color. Keep `[Original]`, `[Zoom]`,
`[Close]`, `[Prev]`, and `[Next]` labels consistent with the theme's bracket notation.
Mobile controls have a minimum 44px height. Captions wrap and scroll within their allotted region;
controls and captions respect safe-area insets. The viewer reserves space above
and below the image so controls do not cover it.
