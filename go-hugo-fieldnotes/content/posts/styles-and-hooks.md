---
title: "Styles and Hooks"
date: 2026-10-10
summary: "How to change the look of Fieldnotes with a few settings, and where to add your own HTML, CSS and scripts."
---


There are two ways to make Fieldnotes yours. Settings in `hugo.toml` cover the look: a preset and a colour scheme,
then fonts and background on top. Hooks are files of your own that the theme picks up, for everything the settings don't cover.
The playground on the [home page]({{< relref "/" >}}) tries the settings out live.

## Settings

```toml
# How it's drawn: fieldnotes, minimal, editorial, cinematic,
# brutalist or terminal; its colours, light and dark
# (empty: the preset's own)
[params.style]
  preset = "terminal"
  scheme = "catppuccin"

# light, dark or auto (the visitor's system); without the toggle,
# a light-only or dark-only site
[params.mode]
  default = "auto"
  toggle = true

# Any Google Fonts family, instead of the preset's
[params.fonts]
  body = "Lora"

# grid, dots, none, or an image in assets/, like an SVG tile
[params.background]
  light = "grid"
  dark = "none"
```

The preset is how the site is drawn: fonts, background, corners, cards and decoration like the fieldnotes preset's
tape. The scheme is its colours, with a light and a dark version, any scheme with any preset. A page can
pick its own look with the same names in its front matter (`style:`), as the pages in [Presets]({{< relref "/presets" >}}) do.

Presets and schemes are plugins: a CSS file and a small data file each, which your site can add or replace. The
[theme generator]({{< relref "/generator" >}}) explains them and downloads a preset as a copy to change.

## Hooks
