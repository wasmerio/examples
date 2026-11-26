---
title: Getting started with ermaozi
description: Install dependencies, configure the site, and publish your first post.
permalink: /en/blog/getting-started/
lang: en-US
translationOf: /blog/getting-started/
createTime: 2026-08-05
updateTime: 2026-08-05
tags: [Astro, Getting Started, Configuration]
sticky: 10
cover: /img/logo.svg
coverStyle:
  layout: top
  ratio: 16/9
---

# Getting started with ermaozi

You only need Node.js, pnpm, and a text editor to start using this theme.

<!-- more -->

## Install and run

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts Astro's hot-reloading development server. Run `pnpm build && pnpm preview` when checking the Pagefind index and production output.

## Configure the site

Open `site.config.mjs` and update the origin, site name, author details, and navigation. Comments and engagement services stay unloaded until configured.

## Add a post

Create a Markdown file under `content/en/blog/category/` with a title, description, permalink, date, and tags. Run `pnpm validate` before publishing.
