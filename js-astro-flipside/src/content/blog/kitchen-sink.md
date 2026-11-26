---
title: "Kitchen sink"
description: "Every Markdown feature this template supports, in one post."
pubDate: "2026-01-02"
tags: ["demo", "markdown"]
heroImage: "./hero-desk.jpg"
# heroImage credit: Karola G (Pexels), https://www.pexels.com/photo/wooden-table-with-coffee-and-notebook-with-pen-4195334/
---

A reference post exercising everything the Markdown pipeline renders, so you
can see it once instead of hunting for it in the docs. Open this file in
`src/content/blog/kitchen-sink.md` to compare source to output.

## Code blocks

### Filenames and line numbers

A fence with a `title` gets a filename frame; add `showLineNumbers` to number
the lines.

```ts title="example.ts"
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```ts showLineNumbers
export function add(a: number, b: number): number {
  return a + b;
}
```

### Diffs

A fence tagged `diff` with `lang="…"` highlights `+`/`-` lines as inserted or
deleted while still syntax-highlighting the rest of the line.

```diff lang="ts"
  function total(items: number[]): number {
-   return items.reduce((a, b) => a + b);
+   return items.reduce((a, b) => a + b, 0);
  }
```

## Text

Inline code like `npm run build` sits in a sentence without breaking it.

> A blockquote: everything below the fold is generated from this one
> Markdown file (the theme, the reading time, and the table of contents
> all read the same source).

## Tables

| Feature     | Package                        | Flag               |
| ----------- | ------------------------------ | ------------------ |
| Code blocks | `astro-expressive-code`        | always on          |
| Math        | `remark-math` / `rehype-katex` | `features.math`    |
| Diagrams    | `mermaid`                      | `features.mermaid` |
| Comments    | giscus                         | `features.giscus`  |

## Lists

- [x] Write the kitchen-sink post
- [x] Exercise code, tables, and footnotes
- [ ] Flip on math and mermaid for a real diagram

## Image

<!--
  Colocated assets are Astro's documented pattern for content-collection
  images: a file living next to its Markdown source is picked up by the
  build-time asset pipeline and optimized, hashed and base-prefixed,
  same as an image imported from `src/` (verified: this renders as
  `/astro-flipside/_astro/avatar.<hash>.webp` — Astro's default image
  service re-encodes raster images to webp, unlike the plain-copy
  behavior the old SVG got here). Plain `![](/og.png)`-style absolute paths
  would NOT get this treatment; only `heroImage` in frontmatter (see
  BlogPost.astro) and this colocated relative form are base-prefixed
  automatically. (Photo: Baruk Granda, same avatar as the Life/Work
  cards — https://unsplash.com/photos/OHLRskxOpjI.)
-->

![Flipside's placeholder avatar](./avatar.jpg)

By default an image fills the column's width; add a `width` attribute to
shrink it, like the sized example below.

<!--
  Sizing needs a real `width` attribute, and Markdown's `![]()` syntax has
  no way to set one, so this is raw HTML — which Astro's Markdown pipeline
  passes straight through unprocessed (verified with `npm run build`: the
  `src` comes out byte-for-byte, no hashing, no base prefix). That also
  means the usual root-relative shortcut 404s here (confirmed against
  `npm run preview`): the only `src` that actually resolves is a `public/`
  file with the base prefix spelled out by hand, the same string as
  `SITE.base` in `src/config.ts`.
-->

<img src="/astro-flipside/og.png" width="160" alt="Sized image demo">

## Math and diagrams

`features.math` and `features.mermaid` (in `src/config.ts`) ship **off** by
default, so `$$…$$` and ` ```mermaid ` blocks would render as inert text
rather than a formula or diagram. Shown here as an escaped reference instead
of live, possibly-broken output. Flip the flags on to render them for real.

```text
$$
E = mc^2
$$
```

```text
graph TD
  A[Markdown] --> B[remark-mermaid]
  B --> C[Rendered diagram]
```

## Footnotes

Reading time on this post is computed from the rendered text, CJK included[^1].

[^1]:
    See `plugins/remark-reading-time.mjs`: it counts the `mdast` tree with
    the `reading-time` package, which counts CJK by character rather than by
    word.
