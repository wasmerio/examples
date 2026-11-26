# Theming

How to rebrand the hub with your own colors and fonts.

## The one file to edit

**[`src/styles/theme.css`](./src/styles/theme.css)** is the single source of truth
for the site's brand: page colors, the accent color, fonts, and the dark-mode
overrides. Edit it to rebrand.

It defines two blocks:

- `:root` - the light (default) theme.
- `:root[data-theme='dark']` - overrides the same tokens for dark mode.

Change a token in `:root` to rebrand light mode; mirror the change in the dark
block if you want dark mode to follow. Structural tokens (spacing, radius,
shadows, transitions) live in [`src/styles/global.css`](./src/styles/global.css)
and rarely need changing.

## What's in `theme.css`

| Token group | Tokens | What they control |
|--------------|--------|-------------------|
| Page surfaces | `--color-bg`, `--color-bg-alt`, `--color-surface`, `--color-border`, `--color-border-light` | Page background, alt sections, cards, borders |
| Dark surfaces | `--color-bg-dark`, `--color-on-dark` | Code blocks, primary buttons, the CTA box (intentionally dark in **both** themes); `--color-on-dark` is the light text on them |
| Text | `--color-text`, `--color-text-secondary`, `--color-text-muted` | Body, secondary, and muted text |
| Accent | `--color-accent`, `--color-accent-hover`, `--color-accent-2`, `--color-accent-3`, `--color-accent-subtle` | The brand color; `accent-2`/`accent-3` are the gradient stops |
| Fonts | `--font-sans`, `--font-mono` | Body and code fonts |

## Common rebrands

**Change the brand color.** Edit `--color-accent` (light) and `--color-accent`
(dark block). Update `--color-accent-hover`, `--color-accent-subtle`, and the
gradient stops `--color-accent-2` / `--color-accent-3` to match.

**Change the page palette.** Edit the `--color-bg*` / `--color-surface` /
`--color-border*` tokens, and the corresponding `--color-text*` so contrast is
preserved.

**Change the fonts.** Edit `--font-sans` / `--font-mono`. The font `<link>` tags
are in [`src/components/Layout.astro`](./src/components/Layout.astro) (`<head>`)
- swap the Google Fonts there too.

**Keep dark mode working.** The dark block must override the **same token names**
as the light block. The toggle (`ThemeToggle.astro`) and the no-FOUC script (in
`Layout.astro` `<head>`) only flip `data-theme` on `<html>` - they don't need to
know your values.

## A note on dark surfaces

`--color-bg-dark` and `--color-on-dark` are for elements that are **dark in both
themes** (code blocks, primary buttons, the CTA box). They are deliberately not
overridden in the dark block - a code block is dark whether you're in light or
dark mode. If you rebrand to a light-on-dark identity, you may not need
`--color-bg-dark` at all; if you keep it, ensure `--color-on-dark` stays
readable against it.

## Beyond tokens

- **Markdown typography** is the single `.prose` class in `global.css`. It uses
  the tokens above, so rebranding tokens cascades into rendered Markdown.
- **Site name, UI strings, and landing copy** are in
  [`src/lib/i18n.ts`](./src/lib/i18n.ts) - replace the sample copy with yours.
- Components already use `var(--color-*)`, so they pick up your token changes
  automatically - no component edits needed.

## Per-product themes

A product can ship its own color theme (e.g. a "green" product) that applies
to its landing page **and** every `/<slug>/docs/...` subpage, including the
global header and footer. This is independent of the site theme above.

**How it works.** Product routes emit `data-product="<slug>"` on `<html>` (via
the `productSlug` prop on `Layout` / `DocsLayout`). A per-product CSS file
overrides the **same token names** as `theme.css`, scoped to
`html[data-product="<slug>"]`, so the override cascades into every descendant
(header, footer, prose, code blocks) automatically - no component edits.

**To theme a product:**

1. Create `src/styles/product-themes/<slug>.css`. Copy `vite.css` (a full
   worked demo) as a starting point, and change the two selectors
   (`html[data-product="<slug>"]` and its `[data-theme='dark']` twin) to your
   slug.
2. Add `@import './<slug>.css';` to `src/styles/product-themes/index.css`.

That's it. The theme applies only on that product's pages; the rest of the
site keeps the default theme. `Nav` and `Footer` need no changes - they
already use `var(--color-*)`.

**Two depths, same mechanism.** Override only `--color-accent*` for a light
touch (accent-colored buttons/links on the existing surfaces), or override the
surfaces and text too for a full rebrand (as `vite.css` does).

**`vite.css` is a demo**, not Vite's real brand - it exists to show the full
cascade (header + footer + landing + docs). Delete it (and its `@import` line)
to remove the demo, or rename it to theme another product.

## Sample themes

[`src/styles/themes/`](./src/styles/themes) holds ready-to-try theme files. Each
is a drop-in override of the same token names as `theme.css`.

| File | Look |
|------|------|
| [`openai.css`](./src/styles/themes/openai.css) | "OpenAI"-inspired: clean neutrals + a vivid emerald-teal accent, near-black canvas. |

**To try a sample theme**, swap one line in
[`src/styles/global.css`](./src/styles/global.css):

```css
@import './themes/openai.css';   /* was: './theme.css' */
```

Revert the line to return to the default. (You can also copy a sample file
over `src/styles/theme.css` if you'd rather keep the import pointing at
`theme.css`.)
