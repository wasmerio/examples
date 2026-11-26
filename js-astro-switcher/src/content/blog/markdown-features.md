---
title: "Markdown Features in Astro"
description: "Explore the powerful Markdown features available when writing blog posts in Astro."
pubDate: "2024-01-25"
heroImage: "3.jpg"
tags: ["markdown", "astro", "mdx"]
author: "Astro Theme Switcher"
---

Astro supports rich Markdown features out of the box, and with MDX enabled, you can even use React components!

## Standard Markdown

You can use all standard Markdown syntax:

### Headings

Use `#` for headings of different levels.

### Lists

- Unordered lists
- With multiple items
- And nested items
  - Like this one

1. Ordered lists
2. Are also supported
3. With numbers

### Code Blocks

You can include code blocks with syntax highlighting:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

### Links and Images

- [Links](https://astro.build) work as expected
- Images can be included: ![Alt text](/favicon.svg)

### Blockquotes

> This is a blockquote. Use it for quotes, callouts, or important notes.

## MDX Features

Since MDX is enabled, you can use React components directly in your Markdown:

```jsx
import { MyComponent } from '../components/MyComponent.astro';

<MyComponent />
```

This makes your blog posts incredibly flexible and powerful!

## Typography

The Tailwind Typography plugin provides beautiful default styles for all Markdown content, making your posts look great without additional styling.
