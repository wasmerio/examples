---
title: "Theming"
date: 2026-09-09
description: "Colours, tiled backgrounds, fonts and overriding templates."
summary: "Every colour and font is a CSS custom property fed from your config, so the whole look changes without touching the stylesheet."
categories: ["Appearance"]
tags: ["theme", "css", "colours", "fonts"]
series: ["Make It Yours"]
cover:
  image: "/images/demo/cover-2.svg"
  alt: "Beveled retro UI buttons"
---


Nothing about the look is hard-coded. Colours, fonts and texture come from
`[params.theme]` as CSS custom properties, so changing one value changes every
button, window title bar and link that uses it.

## Colours

```toml
[params.theme]
  bg          = "#c0c0c0"   # page background
  bgAlt       = "#d4d0c8"   # buttons, bars
  surface     = "#ffffff"   # cards and windows
  surfaceAlt  = "#f4f4f4"
  ink         = "#101010"   # body text
  inkSoft     = "#4a4a4a"   # metadata
  primary     = "#000080"   # window title bars, current nav item
  primaryAlt  = "#008080"   # the other end of the title bar gradient
  accent      = "#ff2d95"   # hover colour, focus rings
  accentAlt   = "#ffcc00"   # highlights
  link        = "#0000ee"
  linkVisited = "#551a8b"
  border      = "#000000"
  bevelLight  = "#ffffff"   # top-left of the 3D bevel
  bevelDark   = "#6e6e6e"   # bottom-right of the bevel
  radius      = "0"         # try "8px" for a softer look
```

Values must be quoted TOML strings. An unquoted `#` starts a comment.

## Background texture

```toml
  tile = "checker"     # none | checker | grid | dots | diagonal | stars
```

These are CSS gradients rather than images, so they cost nothing to download
and stay sharp at any zoom. `stars` also darkens the page and lightens the
window borders to suit.

