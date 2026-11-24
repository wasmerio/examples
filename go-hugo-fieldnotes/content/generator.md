---
title: "Theme Generator"
---


Pick a preset, a colour scheme (light and dark: the toggle at the top), a font and a background. The page shows it at once, and
below the form are the lines for your `hugo.toml`. To change how things are drawn, download the preset as a copy
under a name of your own and edit it in your site's `assets/css/presets/`. Colours come from the schemes; a scheme
of your own is a small CSS file, see the table below.

{{< generator >}}

## How the files fit together

| File in your site | What it is |
|---|---|
| `hugo.toml` | which preset and scheme the site uses (the lines above) |
| `assets/css/schemes/<name>.css` | a colour scheme: one block for light mode, one for dark mode |
| `data/fieldnotes/schemes/<name>.toml` | its name for menus like this one |
| `assets/css/presets/<name>.css` | a preset: fonts, background, corners, cards, and rules for any part of the page |
| `data/fieldnotes/presets/<name>.toml` | its name, its Google Fonts and its default scheme |

Hugo looks in your site first and in the theme second, so a file of your own with a theme preset's name replaces it,
and a new name adds one. Only the preset and schemes a page uses end up in its stylesheet.

