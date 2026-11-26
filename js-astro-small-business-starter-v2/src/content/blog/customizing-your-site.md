---
title: How to Customise Your Site
description: Learn how to personalise every aspect of this template — from branding and colours to content and layout.
author: Team
date: 2026-02-01
tags: [guide, customisation]
draft: false
---

One of the best things about this template is how easy it is to make it your own. No need to dig through dozens of files — all the important settings are centralised.

## The One File That Matters Most

Open `src/data/siteData.ts` and you will find every piece of business information in one place:

- **Business name and tagline**
- **Phone, email, and address**
- **Business hours**
- **Services you offer** (title and description for each)
- **Customer reviews** (quote, name, location, rating)
- **Team members** (name, role, and photo URL)
- **Navigation links** (add, remove, or reorder pages)
- **Trust bar items** (the badges shown on the homepage)
- **Social media links** (set to empty string to hide any)

## Changing Colours

Open `src/styles/theme.css` and edit the `@theme` block — this is the single source of truth for colours, border radius, type scale, and spacing. Tailwind v4 reads these values and auto-generates utility classes (`bg-primary`, `text-accent`, `rounded-md`, etc.).

For example, to change the primary colour from navy to teal, update `--color-primary: #1B3A6B` to your new hex value. No other file needs to change.

## Changing Fonts

Fonts are loaded through Astro's built-in font optimizer. To swap fonts:

1. Update the font names in `src/config/brand.ts`
2. Update the `fonts` array in `astro.config.mjs` to match

The template ships with Oswald for headings and Inter for body text, but any Google Font works.

## Adding Pages

To add a new page, create a `.astro` file in `src/pages/`. For example, `src/pages/faq.astro` would be available at `/faq`. Then add it to the `nav` array in `siteData.ts` to include it in the navigation.

## Writing Blog Posts

Add a new Markdown file to `src/content/blog/`. Each post needs frontmatter with `title`, `description`, `date`, and `tags`. The filename becomes the URL slug.

Make it yours and ship it!
