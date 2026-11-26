---
title: 'Make it yours'
description: 'A quick tour of where to change the name, the colors, and the content of this theme.'
date: 2026-10-30
tags:
  - Guide
  - Astro
draft: false
---

## Start with the site config

Open `src/lib/site.ts`. The name, description, author, and profile links all live there:

```ts
export const SITE_NAME = 'Seasons';
export const AUTHOR_NAME = 'Your Name';
export const SITE_DESCRIPTION = 'A season-aware neobrutalist theme for your blog';
export const SITE_URL = 'https://example.com';
```

Change these and the header, footer, page titles, RSS feed, and search metadata follow. The letter in the header logo comes from the first character of `SITE_NAME`.

## How the seasons work

The site picks a palette from the visitor's local date, and nothing needs rebuilding when a season changes. Every season has a light and a dark variant:

1. Autumn runs from September 22 to December 21.
2. Winter runs from December 22 to March 19.
3. Spring runs from March 20 to June 20.
4. Summer runs from June 21 to September 21.

There is also a **neon** palette that isn't tied to a date. Visitors can pick any of them from the theme picker in the navbar, and the choice is remembered.

## Change the colors

The palettes are defined in `src/styles/palettes.css`, one block per season and mode:

```css
[data-palette='autumn-light'] {
  --bg: #fbf1e1;
  --ink: #2e1c12;
}
```

Edit the values to change a season, or add a new block to create another palette. The `/colors/` page lists every color token, so you can check your changes in one place.

## Write your own posts

Posts are Markdown files in `src/content/blog/`. Delete these two guides when you are ready, and add your own. The [Markdown features](../markdown-features/) post shows everything you can use.

> Keep the first post short. Publishing something small is better than polishing a draft forever.

## Where to go next

- Replace the intro card on the home page in `src/pages/index.astro`.
- Add your own work history on the experience page.
- Swap the social preview image at `public/assets/og.png`.
- Run `npm run build` to check that everything still compiles.
