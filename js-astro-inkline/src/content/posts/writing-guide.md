---
title: "Writing posts: front matter and formatting"
description: "Every field a post can use, and the formatting that looks best."
pubDate: 2026-10-12
tags: ["guide", "theme"]
---

Each post is a Markdown or MDX file in `src/content/posts/`. The file name becomes the URL, so `my-first-post.md` is served at `/posts/my-first-post/`.

## Front matter

The block at the top of the file is checked at build time, so a typo shows up as a clear error instead of a broken page.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Shown as the page heading |
| `description` | yes | Used for the summary and search engines |
| `pubDate` | yes | `2026-10-12` format |
| `updatedDate` | no | Adds an "Updated" line |
| `tags` | no | A list of words |
| `featured` | no | Pins the post to the top of the home page |
| `draft` | no | Hidden from production builds |

## Formatting

Use `##` and `###` headings. When a post has three or more, a contents list appears at the top.

> Short paragraphs and plain words travel furthest.

### Code

Code blocks are highlighted in both themes and have a copy button.

```js
const words = text.split(/\s+/).length;
console.log(`${Math.round(words / 225)} min read`);
```

### Drafts

Set `draft: true` while you write. Drafts show up when you run `npm run dev` and are left out of `npm run build`.
