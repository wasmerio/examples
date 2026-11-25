---
title: "Modus Themes: Accessible Colors"
date: 2024-01-13
draft: false
---


This theme uses color schemes based on the [Modus Themes](https://protesilaos.com/emacs/modus-themes) by Protesilaos Stavrou.

## Why Modus?

Modus themes are designed with accessibility in mind. They conform to the highest standard for color contrast (WCAG AAA), making them:

- Easy on the eyes for extended reading
- Accessible to users with visual impairments
- Consistent across different displays

## Two Variants

### Modus Vivendi (Dark)

The default dark theme features a deep background with carefully selected foreground colors that maintain excellent contrast without being harsh.

### Modus Operandi (Light)

For those who prefer light themes, Modus Operandi offers a clean, paper-like background with equally accessible dark text.

## Toggle Anytime

Press `t` to instantly switch between dark and light modes. Your preference is saved in your browser's local storage.

## Customization

The theme colors are defined as CSS custom properties in `assets/css/themes.css`. You can customize them to match your preferences while maintaining the accessibility standards.

```css
:root {
  --bg-main: #1e1e1e;
  --fg-main: #ffffff;
  /* ... */
}
```

