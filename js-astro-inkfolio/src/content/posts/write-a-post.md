---
title: Write a post, in two languages if you want
description: Post files, frontmatter fields, drafts, and how the bilingual pairing works.
date: 2026-11-13
cover: /og/posts/en/write-a-post.png
coverAlt: Write a post, in two languages if you want
tags: [writing]
categories: ['Writing']
---

Posts are Markdown files in `src/content/posts/`. Create `my-post.md` and it becomes `/posts/my-post/`. The filename is the URL; renaming it later changes the URL, so pick a slug you can live with.

## Frontmatter

```yaml
---
title: A post about something
description: One sentence that shows on the index and in search results.
date: 2026-11-13
tags: [notes]
draft: false
---
```

- `title` and `date` are required. `description` is strongly recommended: it becomes the meta description and the line under the title on list pages.
- `tags` are displayed on the article; they do not create archive pages.
- `draft: true` keeps the file in the repo but out of the lists, the RSS feed and the sitemap.
- `updated` is optional and prints an "Updated" date next to the published one.

## The Chinese version

Create a file with the **same name** in `src/content/posts-zh/`. The two pages then link to each other and emit proper `hreflang` tags. If a post has no Chinese counterpart, nothing breaks — the language switcher on that article simply does not appear, which is better than sending readers to a 404.

You do not have to translate everything. A common setup: short notes in one language, long pieces in both.

## Images

Put images in `public/` and reference them from the Markdown root:

```markdown
![A caption](/images/photo.jpg)
```

The prose styles add a border and rounded corners automatically. Keep files reasonably small — there is no image pipeline in this theme, by design.

## Code blocks

Fenced blocks are styled and horizontally scrollable. Indented code blocks are not, so use fences.

```js
console.log('hello');
```
