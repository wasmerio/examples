---
title: "Markdown Showcase"
description: "Everything the theme renders: typography, alerts, tabs, tables, code, galleries, math, and diagrams."
date: 2026-06-26
cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
tags: ["Markdown", "Astro"]
toc: true
math: true
mermaid: true
gallery: true
lightbox: true
---

Write plain Markdown; the theme handles the rest at build time. This post exercises everything it renders.

## Typography

Regular paragraphs with **bold**, *italic*, ~~strikethrough~~, an [inline link](https://astro.build/), `inline code`, and keyboard keys like <kbd>Ctrl</kbd> + <kbd>K</kbd> for search.

> A plain blockquote: for quoted words, not for callouts.

A footnote reference[^1] sits at the end of a sentence.

[^1]: And its note collects at the bottom of the page.

## Lists

- Unordered items
- Nest freely
  - Like this
- Task lists work too:
  - [x] Write the post
  - [ ] Publish it

1. Ordered items
2. Count themselves

## Alerts

GitHub-style callouts, five kinds:

> [!NOTE]
> Useful information that readers should know, even when skimming.

> [!TIP]
> A helpful suggestion for doing something better.

> [!IMPORTANT]
> Key information required to achieve a goal.

> [!WARNING]
> Urgent info that needs immediate attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes.

## Table

| Syntax | Renders as |
| --- | --- |
| `**bold**` | **bold** |
| `` `code` `` | `code` |
| `~~strike~~` | ~~strike~~ |

## Code

Fenced blocks go through Expressive Code — titles, line highlights, and copy buttons included:

```ts title="src/example.ts" {3}
type ColorMode = 'light' | 'dark' | 'auto';

export function setMode(mode: ColorMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}
```

## Tabs

Group alternatives with directives — four colons outside, three inside:

::::tabs
:::tab{title="pnpm"}

```sh
pnpm install
```

:::

:::tab{title="npm"}

```sh
npm install
```

:::
::::

## Images and gallery

A single image stays a figure with a caption. Consecutive images become a gallery with a lightbox:

![A quiet landscape](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80 "A quiet landscape")
![A green forest](https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80 "A green forest")
![A lake and mountain](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80 "A lake and mountain")

## Math

Inline math like $E = mc^2$, and display math:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

## Diagrams

```mermaid
flowchart LR
  A[Markdown] --> B[remark/rehype]
  B --> C[Astro components]
  C --> D[Static site]
```

## Details

<details>
<summary>Collapsed by default</summary>

Anything Markdown can render fits inside, including `code` and lists.

</details>

---

A horizontal rule closes the show.
