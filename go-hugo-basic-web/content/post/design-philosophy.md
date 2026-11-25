+++
title = "Design Philosophy"
date = 2026-01-01T00:00:00Z
draft = false
tags = ["overview"]
SubTitle = "Why the column is 500px and why that's not a bug."
+++

The column is 500px wide on desktop — roughly the width of a mobile screen, and close to the optimal line length for reading (65–70 characters per line). On mobile it fills the viewport. Nothing competes for the reader's attention.

This is a deliberate constraint, not a limitation to work around.

### What the theme does not have

- No sidebar
- No card grid
- No hero image
- No navigation bar
- No JavaScript

### What it does have

- One column
- A header that links home
- A footer with your navigation
- Dark mode via `prefers-color-scheme`
- System fonts (no web font loading)
- Tables, code blocks, blockquotes

### The navigation model

There is no top nav bar. Navigation lives in the footer. The header is a logo or site name that always links back to `/`. Every page has the same chrome:

```
[header — links home]
[hr]
[your content]
[hr]
[footer — nav links + last-updated date]
```
