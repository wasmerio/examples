---
title: GFM Syntax
categories: [Theme Introduction]
cover: /cover/20e6c8ef356dd961.avif
description: Markdown Syntax
date: 2026-06-30 12:58:33
---

Astro natively supports basic Markdown usage, as follows:

## Lists

### Task List

- [x] Supports task list
- [ ] Not completed yet

### Ordered List

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

### Unordered List

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

## Table

| Field | Value |
| --- | --- |
| Version | Tailwind v4 |
| Plugin | @tailwindcss/typography |

## Strikethrough

~~Deleted text~~

## Footnote

There is a footnote[^1] here.

## Code

```javascript
console.log(' fenced code 支持高亮按你的主题来 ');
```

## Alert

> [!NOTE]
> This is the note alert content.

> [!TIP]
> This is the tip content.

> [!IMPORTANT]
> This is the important content.
> Lowercase markers should be recognized too. **Bold**

> [!WARNING]
> This is the warning content.

> [!CAUTION]
> This is the caution content.