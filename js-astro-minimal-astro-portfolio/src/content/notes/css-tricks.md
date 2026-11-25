---
title: "Modern CSS Tricks"
description: "Useful CSS snippets and modern techniques"
publishedAt: 2024-01-05
category: "CSS"
---

Some modern CSS tricks I use frequently:

## Container Queries

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}
```

## Custom Properties with Fallbacks

```css
.element {
  background: var(--custom-bg, #ffffff);
  color: var(--custom-color, var(--fallback-color, #000000));
}
``` 