---
layout: ../layouts/NotionPage.astro
title: Writing in Markdown
description: Point a Markdown file at the layout and its prose is styled automatically.
icon: 📝
width: default
---

This whole page is a Markdown file. The only setup is the frontmatter at the top:

```yaml
---
layout: ../layouts/NotionPage.astro
title: Writing in Markdown
icon: 📝
width: default
---
```

`width: default` gives Notion's narrower 708px page. Leave it out for full width.

## Everything you'd expect

Headings, **bold**, *italic*, `inline code`, [links](https://astro.build), and lists are
all styled to match the rest of the theme.

- Bulleted lists
- With several items
  - And nested ones

1. Numbered lists
2. Also work

> Blockquotes pick up the same left rule as the Quote component.

| Column | Column |
| --- | --- |
| Tables | are styled |
| with | the same borders |

```js
// Code blocks are highlighted at build time — no client-side JavaScript.
export const theme = 'notion';
```

## Mixing in components

Rename the file to `.mdx` and install `@astrojs/mdx` to use the components inside
Markdown:

```mdx
import Callout from '../components/Callout.astro';

<Callout icon="💡" color="blue">Works inside MDX.</Callout>
```

That step is optional — plain Markdown needs no extra dependencies.
