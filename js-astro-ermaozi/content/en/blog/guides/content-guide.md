---
title: Content and bilingual routing
description: Understand content folders, permalinks, categories, tags, and translation links.
permalink: /en/blog/content-guide/
lang: en-US
translationOf: /blog/content-guide/
createTime: 2026-08-04
updateTime: 2026-08-05
tags: [Content, Internationalization, SEO]
cover: /img/logo.svg
coverStyle:
  layout: odd-left
  ratio: 3/2
  width: 180
---

# Content and bilingual routing

Content folders define categories, while frontmatter defines public routes and metadata.

<!-- more -->

## Folders become categories

The file `content/en/blog/guides/content-guide.md` belongs to the `guides` category. Category, tag, and archive pages are generated at build time.

## Keep public URLs stable

Give each post a `permalink`. Moving the Markdown source later will not change its public URL.

## Connect translations

Set `translationOf` on the English post to the Chinese route. The theme then produces a language switcher, `hreflang`, and matching sitemap entries.

::: tip Writing guidance
Use the title to name the topic, the description to state the reader benefit, and the body to deliver only useful details.
:::
