---
title: 'Getting started with this template'
description: 'A quick tour of how this Astro photography template is organized, and how to make it your own.'
pubDate: 2025-01-15
tags: ['astro', 'guide']
---

Welcome! This is an example post that ships with the template — delete it once
you've had a look. It exists to show how the blog renders Markdown: headings,
lists, quotes, tables, and syntax-highlighted code.

## Where things live

Most of what you'll edit is in a handful of places:

- **`src/config.ts`** — your name, navigation, and social links.
- **`src/assets/digital/` and `src/assets/analog/`** — gallery photos. Drop files
  in and they appear; the filename sets the order and the caption.
- **`src/content/tech/` and `src/content/photography/`** — blog posts like this
  one. Add a Markdown (`.md`) or MDX (`.mdx`) file and it shows up.
- **`astro.config.mjs`** — set `site` to your real domain.

## Add a post

Create a file in either blog folder and start it with frontmatter:

```yaml
---
title: 'A clear, specific title'
description: 'One or two sentences, shown on the index and as the meta description.'
pubDate: 2025-02-01
tags: ['optional', 'tags']
draft: false   # true = hidden from the production build
---
```

Everything below the frontmatter is plain Markdown. Code blocks are highlighted
at build time with Prism:

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet('world'));
```

> Tip: set `draft: true` while you're still writing. Drafts show up in
> `npm run dev` but are left out of the production build.

## Tables work too

| Feature        | Where it lives                       |
| -------------- | ------------------------------------ |
| Galleries      | `src/assets/` + `src/data/`          |
| Blog posts     | `src/content/`                       |
| Styling        | `src/styles/global.css`              |
| SEO / sitemap  | derived from `astro.config.mjs`      |

That's the whole idea: edit text and drop in images, and the site keeps itself
in order. Have fun making it yours.
