---
title: "Appearance"
description: "The seed color system, the Dock's picker and sliders, and hard-coding your own theme."
date: 2026-06-27
order: 3
tags: ["Guide", "Design Tokens"]
toc: true
---

The whole palette is mixed from three colors: shared `--paper` and `--ink` (which flip with dark mode) plus one `--seed`. Every token — canvas, borders, hover, links — derives from them with `color-mix(in oklch, …)`, so any seed stays in tune.

## The Dock display panel

The settings button on the Dock opens the display panel (the Dock sits on the right on wide landscape screens and at the bottom elsewhere):

- **Color mode** — light, auto, or dark. Auto follows the OS and updates live.
- **Theme color** — preset swatches plus hue, chroma, and lightness sliders for a custom seed. The picker covers the full hue circle and a usable chroma range, with lightness clamped to 30–70% so any seed keeps readable accents and links; the first swatch restores the monochrome default. Choices persist per visitor.
- **Frosted glass** — blur strength of the context bar, Dock, and floating panels.
- **Grain** — a film-grain overlay on the page, off by default.
- **Page width** — adjusts the reading column around your `contentWidth`.

## Hard-code a theme

To ship your own default color, declare a seed recipe in `src/styles/tokens.css` and point `defaultTheme` in `src/config/theme.ts` at it:

```css
[data-theme='teal'] {
  --seed-recipe-l: 0.58;
  --seed-recipe-c: 0.17;
  --seed-recipe-h: 190;
}
```

Set the recipe channels rather than `--seed` itself, so color schemes can still re-tune chroma on top. Solid-accent text is picked natively with `contrast-color()`, and accent text is a mode-adaptive transform of the seed via relative color syntax — darker in light mode, lifted in dark mode — so seeds across the picker's 30–70% lightness range stay readable. The shipped monochrome default (`ink`) additionally binds the solid accent to the ink itself:

```css
[data-theme='ink'] {
  --seed-recipe-l: 0.3;
  --seed-recipe-c: 0.01;
  --seed-recipe-h: 285;
  --accent: var(--fg);
  --accent-contrast: var(--canvas);
  --accent-text: var(--fg);
}
```

## Type and spacing

Font sizes and spacing come from fluid [Utopia](https://utopia.fyi) scales (`--step-*`, `--space-*`) defined in the same file, exposed as Tailwind utilities (`text-step-1`, `p-fl-m`). One `--radius` rounds every box; alert callouts, code blocks, and tables all draw from the same tokens.
