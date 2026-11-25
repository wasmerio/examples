---
title: "Hello, world"
publishDate: 2026-03-01
description: "A first post — and a quick tour of what the writing template can render."
tags: [ intro, demo, guide ]
---

Welcome. This is the first post in your new blog. Replace it (or delete it) when you write your first real post.

## Headings, lists, links

The body uses Newsreader for serif text and JetBrains Mono for code. Lists work the way you'd expect:

- A bullet
- Another bullet
- Yet another

Numbered lists too:

1. First item
2. Second item
3. Third item

Inline links — like [Astro's docs](https://docs.astro.build) — are styled subtly, hover to confirm.

## Code

Fenced code blocks are rendered by [Expressive Code](https://expressive-code.com), with syntax highlighting, a copy
button on hover, and a `min-light`/`min-dark` theme that follows the toggle:

```ts
function greet(name: string): string {
    return `Hello, ${name}!`;
}
```

```bash
# CLI blocks render as terminals.
pnpm install
pnpm dev
```

## Math

[KaTeX](https://katex.org) is wired up. Inline like $E = mc^2$ and as a display:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Quotes & emphasis

> A blockquote sits with a left rule, in italics, slightly muted.
>
> Multiple paragraphs work.

You can use *emphasis* and **strong** the usual way.

## What's next

- Edit `src/site.config.ts` with your name, profile, and (optionally) Giscus and analytics IDs.
- Replace `src/content/page/about.md` with your own bio.
- Drop new posts into `src/content/post/` — the filename becomes the URL slug.
- See the README for full setup and customization steps.
