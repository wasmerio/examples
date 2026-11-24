---
title: "Customizing Your Theme"
date: 2024-01-12
draft: false
---


The Emacs Hugo theme is designed to be easily customizable while maintaining its authentic Emacs look and feel.

## Fonts

The theme ships with [Fira Code](https://github.com/tonsky/FiraCode), a popular monospace font with programming ligatures.

To use a different font:

1. Add your font files to `static/fonts/`
2. Update the `@font-face` declarations in `assets/css/main.css`
3. Change the `font-family` property

## Colors

All colors are defined as CSS custom properties in `assets/css/themes.css`. The main variables include:

- `--bg-main` - Primary background
- `--fg-main` - Primary foreground (text)
- `--bg-active` - Active/selected items
- `--border-color` - Window borders

## Modeline

The modeline at the bottom of each buffer shows:

- Buffer/article name
- Scroll position percentage
- Major mode indicator

You can customize the modeline in `layouts/partials/modeline.html`.

## Menu Bar

The menu bar provides mouse-friendly access to common actions. Customize it in `layouts/partials/menu-bar.html`.

## Echo Area

The echo area at the bottom displays hints and messages. Its behavior is controlled by `assets/js/keyboard.js`.
