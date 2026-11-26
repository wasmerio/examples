---
title: Configuring Your Site
date: 2026-08-20T09:00:00Z
description: Set the identity, locale, navigation, and deployment path of an Imprint site.
categories: Guides
tags:
  - Configuration
  - Astro
---

Most site-level decisions live in `src/config.ts`. Keeping them together makes it easier to reuse Imprint without searching through page components.

## Identity and navigation

Change the title, author, description, avatar, hero text, and GitHub link. Static assets such as an avatar belong in `public/`.

## Locale and time zone

The `language` setting selects the interface dictionary. The default is English, and a Chinese dictionary is included. `locale` controls date formatting while `timeZone` determines the calendar date used by archives.

```ts
language: 'en',
htmlLang: 'en',
locale: 'en-US',
timeZone: 'UTC',
```

## Deployment path

Set `url` to the public origin. Keep `basePath` as `/` for a custom domain or user site, and use `/repository-name` for a GitHub Pages project site.
