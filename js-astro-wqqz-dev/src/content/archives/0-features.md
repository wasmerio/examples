---
title: Markdown features & site guide
description: Every markdown feature available on the site, with all syntax examples shown in one place.
date: 2026-09-01
tags:
  - markdown
  - formatting
  - examples
---

This document shows every markdown feature available on the site.

- Callouts (`> [!TYPE]`), titled code frames, terminal code frames.
- Footnotes, math (KaTeX), tables, task lists, images.
- Tabs, inline code, blockquotes, headings, typography.

> [!TIP]
> Each section shows the **syntax** first, then a **live render** of that exact input. Read the syntax block to learn it; read what follows to see what it produces.

> [!NOTE]
> Everything here is plain markdown or a small `title`/`frame` attribute on a code fence. There is no custom syntax to memorise beyond what is on this page.

---

## 1. Callouts (admonitions)

Write a callout as a blockquote whose first line starts with a type marker. An optional custom title follows the marker on the same line.

````md
> [!SUCCESS] One in, one out
> Every new tool has to replace something. Tool collections grow entropy —
> the stack should get smaller and sharper over time, not wider.
````

**Supported types** (case-insensitive, unknown types render as a normal blockquote):

| Marker | Default title | Accent color |
| --- | --- | --- |
| `[!NOTE]` | Note | blue |
| `[!INFO]` | Info | blue |
| `[!TIP]` | Tip | green |
| `[!SUCCESS]` | Success | green |
| `[!IMPORTANT]` | Important | purple |
| `[!WARNING]` | Warning | amber |
| `[!CAUTION]` | Caution | red |

**Examples:**

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION] Cross-check before merging
> Advises about risks or negative outcomes of certain actions.

Callout bodies are real markdown, so formatting still works:

> [!TIP] Try `pnpm dlx`
> Run one-off binaries without installing them:
>
> - No global install
> - No version conflicts
> - Uses the lockfile when available

---

## 2. Footnotes

Reference a footnote with `[^label]` anywhere in the text, then define it once with `[^label]:` at the end of the file. Definitions render automatically in a numbered **Footnotes** section at the bottom of the page — there is no reference list to maintain by hand.

````md
The claim needs a source.[^rhees]

[^rhees]: Wittgenstein, *Philosophical Investigations* §223. Translated from the German by Rush Rhees.
````

**Example:**

The quote below is attributed to Wittgenstein, and the argument is Nagel's.[^wit]

[^wit]: Wittgenstein, *Philosophical Investigations* §223, translated from the German by Rush Rhees. Nagel, "What Is It Like to Be a Bat?", *The Philosophical Review* 83(4), 435–450 (1974).

> [!NOTE]
> Definitions are renumbered automatically by order of first reference, so you can label them freely (`[^a]`, `[^source-2]`, …) and reorder the prose without renumbering anything. Links, emphasis, and inline code all work inside a definition.

---

## 3. Math (KaTeX)

Inline math uses single dollar signs, display math uses `$$` on its own lines. Both render through KaTeX, so anything KaTeX supports is available.

````md
Inline math puts the result in the sentence: $\ell = 0.3950$.

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$
````

**Example:**

Inline math puts the result in the sentence: $\ell = 0.3950$. The training run stopped at step $46{,}360$.

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

> [!CAUTION]
> A single unpaired `$` in prose will start a math span and swallow text until it finds the next one. Write currency as `\$5`, or wrap it in backticks like `` `$5` ``.

---

## 4. Titled code frames (editor tab)

Add `title="…"` to a fenced code block. A header bar with an accent tab indicator is rendered above the code.

````md
```bash title="daily-drivers.sh"
fzf        # fuzzy-find everything: files, history, branches
ripgrep    # grep, but you never wait for it
```
````

**Example:**

```bash title="daily-drivers.sh"
fzf        # fuzzy-find everything: files, history, branches
ripgrep    # grep, but you never wait for it
```

---

## 5. Terminal code frames & tabs

Add `frame="terminal"` to get a terminal-style window. Combine it with `group="…"` + `tab="…"` on consecutive blocks to group them into an interactive tab widget:

````md
```bash frame="terminal" group="package-manager" tab="pnpm"
pnpm add astro
```

```bash frame="terminal" group="package-manager" tab="npm"
npm install astro
```

```bash frame="terminal" group="package-manager" tab="bun"
bun add astro
```
````

**Example:**

```bash frame="terminal" group="package-manager" tab="pnpm"
pnpm add astro
```

```bash frame="terminal" group="package-manager" tab="npm"
npm install astro
```

```bash frame="terminal" group="package-manager" tab="bun"
bun add astro
```

**Renders as** a window with a tab bar (`pnpm` / `npm` / `bun`); each tab shows one terminal frame. The widget is built entirely server-side with hidden radio inputs — no client script required.

> [!NOTE]
> Tabs need **two or more** consecutive blocks sharing the same `group`. A single block with a `group` is left as a normal code frame rather than rendering an empty tab bar.

---

## 6. Inline code

Inline code is a muted rounded pill:

```md
Run `pnpm astro check` before committing.
```

---

## 7. Blockquotes

Plain blockquotes keep their styling: a left rule, muted text, no italics.

```md
> "Security is a process, not a product."
>
> — Bruce Schneier
```

---

## 8. Tables

Pipe tables with a header row and a `---` separator. Alignment is set with `:` in the separator row.

```md
| Element | Style | Weight |
| --- | :--- | ---: |
| Body | muted | 400 |
| `strong` | foreground | 600 |
```

**Example:**

| Element | Style | Weight |
| --- | :--- | ---: |
| Body | muted | 400 |
| `strong` | foreground | 600 |

> [!TIP]
> Tables are wrapped in a horizontally scrollable container, so a wide table will not break the layout on a phone. Keep the header row short and let the body wrap.

---

## 9. Task lists

Write `- [ ]` for an open item and `- [x]` for a done one.

```md
- [x] Wire up the content collection
- [x] Add callouts and code frames
- [ ] Write the post
```

**Example:**

- [x] Wire up the content collection
- [x] Add callouts and code frames
- [ ] Write the post

---

## 10. Images

Standard markdown image syntax, with alt text:

```md
![Screenshot of the archives page](/preview.png)
```

**Example:**

![Screenshot of the site](/preview.png)

> [!NOTE]
> Put image files in `public/` and reference them with a leading `/`. `public/` is served at the site root, so `/preview.png` resolves to the file as-is.

---

## 11. Strikethrough, autolinks & smart typography

These come from GitHub Flavored Markdown and need no extra syntax.

````md
~~Struck through~~ text.

A bare URL becomes a link: https://astro.build

Straight quotes "like this" and dashes - become "curly" and an em dash.
Ellipses... too.
````

**Example:**

~~Struck through~~ text.

A bare URL becomes a link: https://astro.build

Straight quotes "like this" and dashes - become "curly" and an em dash.
Ellipses... too.

---

## 12. Links

Ordinary inline links, plus a reference-style form when a source repeats:

```md
An [inline link](https://astro.build), or a [reference link][astro].

[astro]: https://astro.build
```

**Example:**

An [inline link](https://astro.build), or a [reference link][astro].

[astro]: https://astro.build

> [!IMPORTANT]
> **Off-site links open in a new tab**, so following a citation never loses your place in a long read. They also get `rel="noopener noreferrer"`, so the opened page cannot reach back into this one via `window.opener`.
>
> Links that stay on this site — the nav bar, archive titles, tag pages, and the little jump-back links under each footnote — keep opening in the same tab, so the back button behaves the way you expect.

---

## 13. Headings & body typography

The prose scale is em-based so it scales with the font size.

| Element | Style |
| --- | --- |
| Body | `line-height: 1.75` |
| `h2` | `1.5em`, margin `2em 0 1em` |
| `h3` | `1.25em`, margin `1.6em 0 .6em` |
| Links | underline, turns accent on hover |
| `strong` | `font-weight: 600` |
| Tables | bordered, `bg-muted` head, scrollable |
| `hr` | `margin: 2.5rem 0` |

---

## 14. Code-block chrome

Code blocks are rendered by **Expressive Code**: syntax highlighting, copy button, line-number gutter, dark panels in both themes.

> Note: code panels intentionally stay dark in light mode. The site uses a single dark syntax theme.

---

## Under the hood

Small remark/rehype steps in `astro.config.mjs` sit on top of Expressive Code:

| Step | Role |
| --- | --- |
| `remarkGfm` | Tables, task lists, strikethrough, autolinks, and footnotes. |
| `remarkMath` + `rehypeKatex` | `$…$` inline and `$$…$$` display math, rendered by KaTeX. |
| `rehypeSlug` | Stable `id` anchors on every heading. |
| `rehypeExternalLinks` | Adds `target="_blank" rel="noopener noreferrer"` to off-site links only. |
| `remarkCodeGroups` (remark) | Reads `group="…"` / `tab="…"` from the fence meta and inserts a group marker. |
| `rehypeCodeTabs` (rehype) | Builds the static `.ec-tabs` widget with shared-name radios. |
| `remarkCallouts` | Converts `> [!TYPE]` blockquotes into styled callout `<aside>` elements. |
| `rehypeExpressiveCode` | Syntax highlighting, copy button, and the `title` / `frame` chrome. |

> [!NOTE]
> `rehypeExternalLinks` runs **before** `rehypeKatex` and `rehypeExpressiveCode` on purpose. It only ever sees links you wrote by hand, never the ones those two generate.

## Verify

```bash
pnpm astro check   # 0 errors
pnpm astro build   # builds all pages
```
