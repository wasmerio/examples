# Frontmatter Reference

Every Markdown (`.md`) or MDX (`.mdx`) file in `content/` starts with a YAML frontmatter block enclosed by `---`. All four content types require a **`title`**. Posts also require a publication date in `date`, `published`, or `pubDatetime`.

## Shared Fields (All Four Content Types)

These fields work across `posts`, `pages`, `categories`, and `tags`:

| Field             | Type                                    | Default                      | Description                                                                                                                         |
| ----------------- | --------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                | _(Required)_                 | Display title of the post, page, category, or tag.                                                                                  |
| `slug`            | `string`                                | Filename / folder name       | Custom URL slug (without locale suffix).                                                                                            |
| `description`     | `string`                                | `''`                         | Short summary used in list previews, search results, and SEO `<meta>` tags.                                                         |
| `image` / `cover` | `string`                                | —                            | Cover image path (relative bundle path like `./cover.jpg` or root path `/img/cover.jpg`).                                           |
| `coverStyle`      | `'thumbnail' \| 'fade' \| 'background'` | Site default                 | Visual style when rendering the cover image in cards and headers.                                                                   |
| `draft`           | `boolean`                               | `false`                      | When `true`, excludes the entry from production builds (`pnpm build`).                                                              |
| `hidden`          | `boolean`                               | `false`                      | Keeps the page accessible by direct URL while hiding it from lists and navigation.                                                  |
| `math`            | `boolean`                               | `article.math`               | Enable or disable KaTeX math rendering for this specific entry.                                                                     |
| `mermaid`         | `boolean`                               | `article.mermaid`            | Enable or disable Mermaid diagram rendering for this specific entry.                                                                |
| `lightbox`        | `boolean`                               | `article.lightbox`           | Enable or disable image zoom/lightbox for this specific entry.                                                                      |
| `callouts`        | `boolean`                               | `article.callouts`           | Enable or disable GitHub-style callout blocks for this specific entry.                                                              |
| `toc`             | `boolean`                               | `article.toc.enabled`        | Show or hide the table of contents for this specific entry.                                                                         |
| `shareCover`      | `boolean`                               | `article.shareCover.enabled` | Enable or disable automatic Open Graph cover generation for this entry.                                                             |
| `display`         | `Partial<ArticleDisplay>`               | `article.display`            | Override visibility of metadata elements (`author`, `published`, `readingTime`, `updated`, `tags`, `share`, `navigation`, `title`). |

## Date Fields (Posts & Pages)

To make migrating from other blog frameworks painless, BlogGPT accepts common aliases for publication and update dates:

| Field     | Accepted Aliases           | Description                                                                                                                                                  |
| --------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `date`    | `published`, `pubDatetime` | Publication date, required for posts and optional for standalone pages (`YYYY-MM-DD` or ISO 8601 timestamp). Priority: `date` > `published` > `pubDatetime`. |
| `updated` | `modDatetime`, `lastmod`   | Last modified date. Priority: `updated` > `modDatetime` > `lastmod`.                                                                                         |

## Post-Specific Fields (`content/posts/`)

| Field                     | Type                 | Default | Description                                                         |
| ------------------------- | -------------------- | ------- | ------------------------------------------------------------------- |
| `categories` / `category` | `string \| string[]` | `[]`    | One or more category slugs (e.g., `[tech, astro]`).                 |
| `tags`                    | `string \| string[]` | `[]`    | One or more tag slugs (e.g., `[guide, markdown]`).                  |
| `featured`                | `boolean`            | `false` | Pins the post to the featured section in the sidebar and home view. |

## Complete Example

```yaml
---
title: Hello World
slug: hello-world
date: 2026-03-29
updated: 2026-04-02
description: A quick tour of BlogGPT frontmatter options and Markdown features.
categories: [general]
tags: [intro, bloggpt]
featured: true
image: ./cover.webp
math: true
mermaid: true
---
```
