---
title: Write with Markdown and MDX
date: '2026-08-24T10:00:00+08:00'
slug: writing
description: Write with Markdown and MDX — a working example for the Astro Solitude theme.
categories:
- Theme guides
tags:
- MDX
- Solitude
series:
- Theme essentials
cover: /img/covers/writing.webp
---

# Write with Markdown and MDX

Welcome to **Astro Solitude**. This sample post is ready to replace with your own story.

## Content and expression

The theme separates content, configuration, and page components. Keep posts in `src/content/posts` and site settings in `site.config.ts`.

> Let your content take center stage.

## Start creating

- Write your story in Markdown.
- Use MDX for callouts, galleries, and media.
- Enjoy the same content in light and dark mode.

```typescript
const message: string = "Hello, Solitude";
console.log(message);
```

### Next steps

Explore the [component showcase](/p/components/) or [all posts](/archives/).

## Math formulas

Inline math $E = mc^2$.

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Long code blocks and copying

Expand code blocks that exceed the configured height. The copy button always copies the complete code.

```ts
const steps = [
  'Create a repository',
  'Install dependencies',
  'Configure the site',
  'Choose a language',
  'Set the time zone',
  'Write a title',
  'Add a description',
  'Choose a cover',
  'Add categories',
  'Add tags',
  'Create a series',
  'Write in Markdown',
  'Use an MDX component',
  'Preview the page',
  'Check the navigation',
  'Check the search',
  'Try dark mode',
  'Try a narrow screen',
  'Check the table of contents',
  'Read the RSS feed',
  'Check old URLs',
  'Configure comments',
  'Verify your service',
  'Run the type checker',
  'Build static files',
  'Run tests',
  'Review the output',
  'Choose a static host',
  'Publish your own site',
];
for (const step of steps) console.log(step);
```
