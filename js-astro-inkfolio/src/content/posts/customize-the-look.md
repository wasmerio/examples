---
title: Change the look without breaking it
description: Accent colour, dark mode, typography and spacing — where each one lives.
date: 2026-11-14
cover: /og/posts/en/customize-the-look.png
coverAlt: Change the look without breaking it
tags: [design]
categories: ['Design']
---

Inkfolio is deliberately plain: warm paper background, near-black text, one accent colour, a system font stack, and no web font requests. That is a design decision, not an unfinished part.

## The accent colour

One line in `site.config.yaml`:

```yaml
theme:
  accent: '#ff6b01'
```

It feeds the CSS variables `--accent` and `--u`, which drive links, wavy underlines and the active nav item. Dark mode uses the same value; if your colour is too dark on a dark background, pick a lighter one or add an override in `src/styles/global.css`:

```css
:root[data-theme='dark'] {
  --accent: #ff7b1a;
  --u: #ff7b1a;
}
```

## Typography

The font stack is defined once, at the top of `src/styles/global.css`, in `--font` and `--mono`. Two options that keep the site fast:

1. Leave it as the system stack. It renders instantly and looks native on every OS.
2. Self-host a font: drop the `.woff2` files in `public/fonts/`, add an `@font-face` block, and point `--font` at it. Do not add a Google Fonts `<link>` — it costs a connection on every page and leaks visitor IPs to a third party.

## Spacing and width

The content column is `--max-w` (880px for the shell, 632px for running text). Both are CSS variables at the top of the same file. Widen them and long-form posts get harder to read; that is the trade-off, not a bug.

## Dark mode

Visitors get a toggle in the navigation. The choice is stored in `localStorage` under `inkfolio-theme`; with `defaultMode: auto` the first visit follows the operating system. The theme is applied before the page paints, so there is no white flash when someone in dark mode loads a page.

## What to leave alone

The wavy underline on inline links is the theme's one signature move. It is visible at rest on purpose — hover-only affordances disappear on touch screens, which is most of the traffic on a personal site.
