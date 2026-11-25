---
title: "Dark Mode and Typography"
date: 2024-01-20 08:00:00
draft: false
summary: "Shizuka adapts automatically to your system's color scheme. Here's how it works."
tags:
  - design
  - features
---


Shizuka ships with a carefully balanced color palette for both light and dark modes.

## Automatic detection

The theme reads your OS preference via `prefers-color-scheme` and applies the matching theme instantly — before the page renders, so there's no flash of unstyled content.

## Manual toggle

A small sun/moon icon in the header lets you override the automatic detection. Your preference is saved in `localStorage` and persists across visits.

## Typography choices

The font stack is designed for long reading sessions:

- **Body**: Merriweather — a serif designed for screens, with high legibility at small sizes
- **UI**: Inter — clean sans-serif for navigation and metadata
- **Code**: IBM Plex Mono — monospaced with good vertical rhythm

## Color system

All colors are CSS custom properties, making it straightforward to customize:

```css
:root {
  --color-text: #1a1a1a;
  --color-bg: #fafaf8;
  --color-accent: #2a6496;
}

[data-theme="dark"] {
  --color-text: #e8e6e3;
  --color-bg: #1a1917;
  --color-accent: #7eb8d4;
}
```

To change the accent color, edit `assets/css/main.css` and update these two variables.

