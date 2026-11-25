---
title: 'Markdown Showcase: Code Blocks, Tables, Lists, and More'
description: 'A reference post for the Academic Portfolio blog that demonstrates the markdown features supported by this Astro setup.'
pubDate: '2026-04-05'
updatedDate: 'Apr 07 2026'
authors:
  - shravan-goswami
  - friedrich-nietzsche
  - simone-de-beauvoir
toc: true
---

This post is a live markdown reference for the `Academic-Portfolio` blog. If you mainly want to inspect how code blocks look, jump straight to the "Code Blocks" section below.

## Headings and Inline Formatting

Markdown handles **bold text**, *italic text*, ***combined emphasis***, ~~strikethrough~~, and inline code like `npm run build`.

Standard inline links work, like [Astro](https://astro.build/), and reference-style links also work well in longer writing, like [the Astro docs][astro-docs]. Bare URLs such as https://docs.astro.build are also rendered as links in this setup.

## Quote Blocks

> Markdown works best when the source stays readable and the rendered page stays pleasant to scan.
>
> That makes it especially useful for technical notes, academic writing, changelogs, and tutorials.
>
> <cite>Academic Portfolio markdown showcase</cite>

## Callout Blocks

These callouts use lightweight HTML inside markdown, which works nicely when you want richer editorial UI than plain markdown provides.

<div class="callout" data-callout="note">
  <p><strong>Note:</strong> Use this for neutral side context, assumptions, or editorial notes that should not interrupt the main flow too much.</p>
</div>

<div class="callout" data-callout="info">
  <p><strong>Info:</strong> Great for factual context, references, or quick implementation details that help readers orient themselves.</p>
</div>

<div class="callout" data-callout="tip">
  <p><strong>Tip:</strong> Ideal for shortcuts, best practices, and little quality-of-life suggestions that save readers time.</p>
</div>

<div class="callout" data-callout="success">
  <p><strong>Success:</strong> Useful for confirmations, completed outcomes, or happy-path instructions after a task works.</p>
</div>

<div class="callout" data-callout="warning">
  <p><strong>Warning:</strong> Use this when something may fail, behave unexpectedly, or require extra care before readers continue.</p>
</div>

<div class="callout" data-callout="danger">
  <p><strong>Danger:</strong> Reserve this for destructive actions, irreversible steps, or high-risk mistakes.</p>
</div>

## Lists

### Unordered and Ordered Lists

- Draft the post content in `src/content/blog`.
- Add headings so the table of contents has useful anchors.
- Review the rendered output in the browser.

1. Write the article frontmatter.
2. Add sample markdown blocks.
3. Build the site and confirm the page renders cleanly.

### Nested Lists

- Markdown can also handle nested structure.
  - This is useful for outlines.
  - It also helps when documenting steps with sub-points.
- The goal here is simply to make the rendering easy to inspect.

### Task Lists

- [x] Add a sample blog post
- [x] Include fenced code blocks
- [x] Include a markdown table
- [ ] Replace the placeholder content with a real article later

## Tables

| Feature | Example | Supported here |
| :-- | :-- | :-: |
| Inline code | `` `astro dev` `` | Yes |
| Code fence | ```` ```ts ```` | Yes |
| Task list | `- [x] done` | Yes |
| Footnote | `[^1]` | Yes |

## Images and Horizontal Rules

The image below uses standard markdown image syntax with a local asset from the repo:

![Academic portfolio placeholder image](../../assets/blog-placeholder-about.jpg)

---

## Code Blocks

The following examples make it easy to compare different fenced code block styles in the current theme. Each block now shows a language pill on the left and a copy button floating at the top-right edge.

```bash
npm install
npm run dev
npm run build
```

```ts
type Publication = {
  title: string;
  year: number;
  tags: string[];
};

const recentPublications = (items: Publication[]) =>
  items.filter((item) => item.year >= 2024);
```

```astro
---
const highlights = ['Markdown', 'Shiki code blocks', 'Generated TOC'];
---

<ul>
  {highlights.map((item) => <li>{item}</li>)}
</ul>
```

```diff
- Browser defaults can be hard to scan.
+ Template-aware prose styles make the showcase easier to review.
```

## HTML Inside Markdown

Raw HTML is also available when you need something markdown alone does not express cleanly.

<details>
  <summary>Expandable note</summary>
  <p>This is useful for disclosures, FAQ sections, or optional implementation notes inside a post.</p>
</details>

## Footnotes

Footnotes are handy for citations, side comments, or quick clarifications.[^1]

[^1]: This template is using Astro's markdown pipeline, which in this version supports GitHub-flavored markdown features by default.

[astro-docs]: https://docs.astro.build
