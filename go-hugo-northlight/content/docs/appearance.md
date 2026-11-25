---
title: "Appearance"
description: "Palettes, colour modes, your own CSS, custom fonts and logos."
weight: 5
date: 2026-07-27
---


The theme is named after north light: the soft, even, neutral light from a north-facing
window that has no glare and stays consistent all day. That is the whole design brief.

## Colour modes

Two modes, designed separately rather than one inverted into the other. Mode switching
uses `color-scheme` plus the CSS `light-dark()` function, so each mode-dependent colour
is declared once with both values rather than being repeated in an override block.

A reader with JavaScript disabled still follows their operating system, because that
mechanism is pure CSS. The toggle in the header only exists to override it, and it
removes the stored preference when your choice matches the system again, handing control
back rather than freezing the page.

> [!NOTE]
> There is no flash on load. A small render-blocking script in `<head>` pins the mode
> before first paint. It is the only script the theme loads that way, and it is worth
> the cost precisely once.

## Palettes

Six, set with `colorScheme`:

| Value | Character |
|---|---|
| `periwinkle` | The default. Cool, quiet blue-violet. |
| `sage` | Muted green. |
| `clay` | Warm terracotta. |
| `plum` | Deep purple. |
| `slate` | Desaturated blue. |
| `rose` | Muted pink-red. |

### Your own icons

Drop `name.svg` into your site's `assets/icons/` and call it by name — `{{</* icon "name" */>}}`,
or `partial "icon.html" "name"` from a template. A site file wins over a built-in of the
same name, so this overrides as well as adds.

