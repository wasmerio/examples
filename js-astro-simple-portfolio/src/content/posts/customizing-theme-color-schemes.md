---
author: VicBox
publishDate: 2024-12-20T15:20:35Z
title: Customizing color schemes of Astro Simple Portfolio
tags:
  - color-schemes
  - docs
description:
  A complete guide on how to customize user information in this Astro Simple Portfolio theme.
cover:
  src: './images/customizing-theme-color-schemes/cover.webp'
  alt: 'Customizing color schemes'
---

Astro Simple Portfolio provides a straightforward way to adapt to your system’s light and dark mode preferences. By default, when a user’s device is set to dark mode, the site will load in dark mode—otherwise, it displays in light mode.

> **Note:** This guide assumes you have a basic understanding of Tailwind CSS and how it’s configured in Astro.

## Table of Contents

1. [Introduction to System-Preferred Light & Dark Mode](#introduction-to-system-preferred-light--dark-mode)
2. [Enabling or Disabling Dark Mode Support](#enabling-or-disabling-dark-mode-support)
3. [Updating Tailwind Config](#updating-tailwind-config)
4. [Testing Your Changes](#testing-your-changes)
5. [Additional Tips & Best Practices](#additional-tips--best-practices)

---

## Introduction to System-Preferred Light & Dark Mode

By default, **Astro Simple Portfolio** detects your system preference using the `prefers-color-scheme` media query. This means:

- If your device is set to **light mode**, the site appears in light mode.
- If your device is set to **dark mode**, the site appears in dark mode.

No extra toggle or button is included in this template—**the theme switch happens automatically** based on the user’s system settings.


## Updating Tailwind Config
Tailwind uses color variables to define how your site looks in light and dark mode. You can modify these variables in tailwind.config.mjs. Below is an example snippet:

```js
// file: tailwind.config.mjs
colors: {
// Light mode colors
'light-theme': '#E9EBEC',
'primary-light': '#FBD144',
'primary-hover-light': '#FFE071',

// Dark mode colors
'dark-theme': '#0C151D',
'primary-dark': '#FFE071',
'primary-hover-dark': '#FBD144',

// Neutrals
'n900': '#222222',
'n700': '#171F26',
'n500': '#555555',
}
```
### Changing the Default Palette
1. Choose which colors to modify
   - Want a new background color? Update light-theme or dark-theme.
   - Want to tweak highlights or accents? Change primary-light, primary-hover-light, primary-dark, and primary-hover-dark.
   
2. Replace the color values
   For instance, if your brand color is teal, you might set primary-light to #3AB7BF and primary-hover-light to #37A1A8.

3. Save and rebuild
Tailwind will regenerate the necessary utility classes when you save and restart your Astro development server.

---

## Testing Your Changes
1. Local Development Preview
Run your local dev server with npm run dev or yarn dev.
   - Switch your system settings between light and dark mode to ensure the site updates automatically.

2. Cross-Browser Checks
Test your portfolio in multiple browsers (Chrome, Firefox, Safari, Edge) and devices (desktop, mobile) to confirm everything looks consistent.

3. Accessibility & Contrast
   - Use tools like WebAIM Contrast Checker to verify your text has high enough contrast against the background.
   - Ensure buttons, links, and icons remain visible and legible in both modes.