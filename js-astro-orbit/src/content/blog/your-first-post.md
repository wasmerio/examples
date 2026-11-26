---
title: Your first post
description: A one-line summary used on the writing index, in search results and in the RSS feed.
date: 2026-01-01
tags:
  - Notes
---

Write in Markdown. Headings, tables, lists, blockquotes and fenced code blocks
are all styled by the `.prose` rules in `src/styles/global.css`.

## Code blocks

Syntax highlighting is handled by Astro's built-in Shiki integration:

```ts
export const withBase = (path: string): string => {
  const prefix = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
};
```

## Tables

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Shown as the page heading |
| `description` | yes | Used in listings, search and RSS |
| `date` | yes | Drives ordering, newest first |
| `updated` | no | Displayed alongside the original date |
| `tags` | no | Indexed for search |
| `draft` | no | `true` hides the post everywhere |

## Drafts

Set `draft: true` to keep a post out of the index, the sitemap, the search
index and the feed while you work on it.
