---
title: "First Post: Building a Pixel-Style Hugo Theme from Scratch"
date: 2026-09-18
draft: false
tags: ["Hugo", "Theme", "Frontend"]
summary: "The story of this pixel-retro blog theme: why build one from scratch, how the design language was decided, and what the project structure looks like."
cover: "images/og-demo.png"
---


After trying every ready-made Hugo theme out there, I still decided to write my own. This post records the process and the thinking behind it.

## Why build a theme from scratch

Ready-made themes have two problems:

- **The aesthetics never fit**: no matter how long you browse the theme gallery, nothing feels quite right;
- **Customizing them is a detour**: to change one small detail, you first have to read through hundreds of lines of someone else's templates before you can even override it.

The essence of a Hugo theme is actually very simple — **HTML templates + CSS**. No frameworks, no build toolchain. A minimal usable theme needs just three files.

## Design language

The overall look is inspired by pixel / 8-bit retro style:

- Colors come from the classic **Sweetie 16** pixel-art palette
- Zero border radius, 2px solid borders, and **solid offset hard shadows**
- Headings use a **stitched pixel font** while body text stays sans-serif for readability

## Project structure

The theme is split into clear layers to make iteration easy:

```
themes/pixel-blog-hugo/
├── assets/
│   ├── css/        # tokens / base / layout / components / markdown / home
│   └── js/         # light-dark toggle, mobile menu, back to top
├── i18n/           # UI strings in Chinese and English
├── layouts/        # templates and partials
└── theme.toml
```

Styles are concatenated, minified and fingerprinted via **Hugo Pipes**; theme details are carried by CSS custom properties, so the light and dark palettes only require toggling a class on the root element.

The homepage copy (`params.hero`), the header name and logo (`params.identity`), and the featured work section (`params.works`) all live in `hugo.toml` — you can change content without touching templates.

> The goal: **change one color value, and the whole site follows.**
