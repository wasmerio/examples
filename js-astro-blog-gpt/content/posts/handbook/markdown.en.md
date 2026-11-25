---
title: 'Markdown typography: text, tables and code'
slug: 'markdown'
date: 2026-09-17
description: 'See typography for text, links, lists, tables, code and images.'
categories: ['writing']
tags: ['markdown']
image: '/images/covers/writing-typography.webp'
---

Markdown provides basic formatting for text, lists, tables and code. See how each appears in an article below.

## Text and links

Use **bold**, _italic_, ~~strikethrough~~ and `inline code`.

Links can point to an [article on this site](../welcome/) or an external page such as the [Astro documentation](https://docs.astro.build/).

## Lists

### Ordered and unordered lists

1. State a specific question.
2. Explain the process with examples.
3. Add sources to the conclusion.

- Apples
- Bananas
- Oranges

### Task lists

- [x] Finish the article
- [x] Check internal links
- [ ] Read it once on a narrow screen

## Quotations and separators

> Quoted text is supported,
>
> > including nested quotations.

Separators are also supported.

---

## Tables

| Content     |    Syntax    |            Purpose |
| :---------- | :----------: | -----------------: |
| Heading     | `## Heading` |  Organize sections |
| Quotation   |   `> Text`   |        Add context |
| Inline code |  Backticks   | Identify variables |

Wide tables scroll horizontally within their own area.

## Expressive Code blocks

```ts title="greeting.ts" {2,5}
type Reader = { name: string };
const reader: Reader = { name: 'BlogGPT' };

function greeting({ name }: Reader) {
  return `Hello, ${name}!`;
}
```

```sh title="Terminal"
pnpm check
pnpm build
```

Code blocks support syntax highlighting, filenames, line markers and copying. Configure light/dark code themes and line numbers in `appearance`.

## Images

![Blue and cyan watercolor](/images/illustrations/blue-flow.webp)

Insert images with `![description](path)`. See [Content organization](../content-bundle/) for files and attachments, and [Article enhancements](../article-enhancements/) for math, diagrams and interactive components.
