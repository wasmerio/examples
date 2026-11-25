+++
title = "Dark Mode, Done Quietly"
date = 2026-01-20
tags = ["dark mode", "demo"]
summary = "How Notebook handles theming: CSS variables, a no-flash init, and a persisted toggle."
+++

Notebook ships with a dark mode that's driven entirely by CSS variables. Every
surface — the dotted paper, cards, the spine line, code panels — recolors from one
small block of overrides.

A tiny inline script sets the theme **before the page paints**, reading your saved
choice from `localStorage` and falling back to the site's `defaultTheme`. That means
no flash of the wrong theme on load.

Toggle it from the button at the bottom of the nav rail. Your choice sticks across
pages and visits.

Want a different default? Set it in your config:

```toml
[params]
  defaultTheme = "dark"
```
