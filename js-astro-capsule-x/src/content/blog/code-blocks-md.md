---
title: "Code Block Enhancements (MD)"
description: "Showcasing enhanced code blocks in Markdown files"
pubDate: 2026-07-04T12:00:00
tags: ["tutorial", "components"]
---

## Code Block Enhancements (MD)

This guide shows enhanced code blocks in Markdown (.md) files.

> **Note:** For MDX files, see [Code Block Enhancements (MDX)](/code-blocks-mdx).

### Basic Code Block

A simple code block with syntax highlighting:

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

### With Filename

Add a filename label using the `title` attribute:

```ts title="src/utils.ts"
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

```py title="main.py"
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))
```

### Diff Syntax

Show code changes with diff syntax:

```diff
 function greet(name: string): string {
-  return `Hello, ${name}!`;
+  return `Hi, ${name}!`;
 }

-console.log(greet('World'));
+console.log(greet('Astro'));
```

```diff
- oldFunction();
+ newFunction();

+ const added = true;
  const unchanged = false;
- const removed = true;
```

### Filename + Diff

Combine filename with diff syntax:

```diff title="src/config.ts"
 export const config = {
-  theme: 'light',
+  theme: 'dark',
   lang: 'en',
 };
```

### Copy Button

Hover over any code block to see the copy button. Click it to copy the code to your clipboard.

```js title="src/index.js"
// Try copying this code!
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```

### Multiple Languages

Code blocks support various programming languages:

```css title="styles.css"
.capsule-nav {
  border-radius: 9999px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
}
```

```html title="index.html"
<nav class="capsule-nav">
  <a href="/" class="nav-logo">Logo</a>
  <div class="nav-links">...</div>
</nav>
```

### Features

- **Filename labels** — Show the file name above the code
- **Diff syntax** — Highlight added/removed lines
- **Copy button** — One-click copy to clipboard
- **Syntax highlighting** — Support for 100+ languages
- **Dark mode** — Automatic theme switching

### MD vs MDX

| Feature | MD (.md) | MDX (.mdx) |
|---------|----------|------------|
| Filename | `title="file.ts"` | `title="file.ts"` |
| Diff | `+`/`-` prefixes | `+`/`-` prefixes |
| Copy button | Auto-injected | Auto-injected |
| Custom components | No | Yes |
