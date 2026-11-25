---
title: "An Example Post"
description: "A sample post showing the frontmatter fields and the markdown features this site supports."
date: 2026-01-01
tags:
  - Astro
  - Markdown
draft: false
---

This is an example post. Every post is a markdown file in `src/content/blog/` with four frontmatter fields: `title`, `description`, `date`, and an optional `draft` flag. Set `draft: true` to keep a post out of the build while you work on it.

Posts can also list any number of `tags`. Each tag becomes a chip on the post and links to its own archive page under `/tags/`, alongside the skills marquee at the bottom of the site.

The opening paragraph before the first heading works well as an introduction. It shows up in search results and gives readers a reason to keep going.

## Headings become the table of contents

Every level-two heading in a post is picked up automatically and rendered as the table of contents in the sidebar on wider screens. Keep headings short and descriptive, since they double as navigation.

Regular paragraphs, **bold text**, *italics*, and [links](https://astro.build) all work the way you'd expect from markdown.

## Code blocks

Fenced code blocks get syntax highlighting that follows the active color palette:

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('world'));
```

Inline code like `npm run build` is styled too.

## Lists and more

Unordered lists:

- First item
- Second item
- Third item

Ordered lists:

1. Write a post
2. Preview it locally
3. Publish

> Blockquotes are available for callouts or quoting other work.

## Wrapping up

Delete this file and add your own posts. The newest post automatically gets a "latest" tag on the blog page, and the three most recent posts appear on the home page.
