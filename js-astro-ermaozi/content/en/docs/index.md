---
title: Documentation
description: Learn how to configure ermaozi and use its content model.
permalink: /en/docs/
translationOf: /docs/
type: doc
group: Overview
order: 1
badge: Start
icon: material-symbols:docs-outline
createTime: 2026-08-05
tags: [Astro, Documentation]
---

# Documentation

::: warning Testing stage
The `0.2` series is still in prerelease. Features and configuration are not fully stable, and later versions may contain breaking changes. Pin the version during testing and read the GitHub Release notes before upgrading.
:::

The theme supports blogs and product documentation. Pages under `content/en/docs/` automatically receive a documentation sidebar, a mobile outline, and previous/next navigation.

::: card-grid cols="2"
- **Configuration driven**

  Site identity, navigation, languages, and optional services live in one configuration file.

- **Content first**

  Markdown controls routes, order, groups, tags, and page behavior.
:::

## Start here

1. Follow the [beginner quick start](/en/docs/guide/getting-started/) to set the site identity and publish a first post.
2. Use [site configuration](/en/docs/guide/configuration/) and [content features](/en/docs/guide/content/) when more control is needed.
3. Remove unwanted examples and run `pnpm validate`.

## Current compatibility

- Node.js 22.12 or newer
- Astro 7.1
- Vue 3.5
- npm, pnpm, or Yarn
