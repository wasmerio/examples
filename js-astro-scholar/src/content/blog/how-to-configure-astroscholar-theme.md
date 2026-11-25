---
title: 'How to configure AstroScholar theme'
description: 'A comprehensive guide on configuring the AstroScholar theme.'
pubDate: '2026-04-03'
authors:
  - shravan-goswami
toc: true
tags:
  - astro
  - tutorial
  - theme
---

Configuring the AstroScholar theme is straightforward. In this guide, we'll walk through the `consts.ts` configuration, navigation, and adding content to the various collections.

## Getting Started

First, ensure you have the required dependencies installed by running `npm install`.

Then, open `src/consts.ts` and modify the default site title, description, and social links.

```ts
export const SITE_TITLE = 'My Academic Portfolio';
export const SITE_DESCRIPTION = 'The academic portfolio of John Doe.';
```

## Adding Authors

You can manage authors in the `src/content/data/authors.json` file. Each author should have an `id`, `name`, and optionally an `avatar`, `url`, and `affiliation`.
