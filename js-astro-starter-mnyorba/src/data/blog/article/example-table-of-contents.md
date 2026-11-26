---
title: Advanced Markdown Demo for Table of Contents
publishDate: 2025-09-10 12:00:00
draft: false
description: |
  A comprehensive Markdown article with many sections and subsections for testing Table of Contents (TOC) rendering and anchor navigation in Astro.
image:
  src: /images/blog/image-blog-5.webp
  alt: A stack of books and a glowing lamp on a desk
category:
  - Markdown
  - Demo
  - TOC
tag:
  - Astro
  - Markdown
  - TOC
author: m-nyorba
---

# Advanced Markdown Demo

> This article is intentionally long and structured to test Table of Contents (TOC) generation and anchor navigation in Astro projects.

---

## Table of Contents

<!-- toc -->

---

## Introduction

Welcome to this advanced Markdown demonstration article.  
It is designed to showcase a wide variety of Markdown features and to provide a robust test for Table of Contents (TOC) navigation.

---

## Getting Started

To use this article for TOC testing, simply render it in your Astro project and verify that all anchor links in the TOC work as expected.

---

## Headings

### Subheading Example

This is a subheading under Headings.

#### Deep Subheading

This is a deeper subheading for anchor testing.

---

## Text Formatting

### Emphasis

_Italic text_  
**Bold text**  
**_Bold and italic_**  
~~Strikethrough~~

### Blockquotes

> This is a blockquote.
>
> > Nested blockquote for demonstration.

---

## Lists

### Unordered Lists

- Apple
- Banana
- Cherry

### Ordered Lists

1. First
2. Second
3. Third

### Nested Lists

- Item 1
  - Subitem 1.1
    - Subitem 1.1.1
  - Subitem 1.2
- Item 2

---

## Links and Images

[Astro Official Site](https://astro.build)

![Data Visualization](./images/blog/image-blog-6.webp "Data Visualization Example")

---

## Code Examples

### Inline Code

Use `npm run dev` to start the development server.

### Code Blocks

```js
function sum(a, b) {
  return a + b;
}
console.log(sum(2, 3));
```

```bash
git clone https://github.com/withastro/astro.git
cd astro
npm install
```

---

## Tables

| Feature     | Supported | Example       |
| ----------- | --------- | ------------- |
| Headings    | Yes       | `## Heading`  |
| Lists       | Yes       | `- Item`      |
| Code Blocks | Yes       | `js ... `     |
| Images      | Yes       | `![alt](url)` |

---

## Horizontal Rules

---

## Task Lists

- [x] Write a long article
- [x] Add many sections
- [ ] Test TOC navigation

---

## Footnotes

Here is a reference to a footnote.[^1]

[^1]: This is the footnote content.

---

## Admonitions

> **Note:** This is a note admonition.

> **Warning:** This is a warning admonition.

---

## Math

Inline math: $a^2 + b^2 = c^2$

Block math:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

---

## Conclusion

This article demonstrates a wide range of Markdown features and provides a thorough test for Table of Contents (TOC) anchor navigation in Astro.  
Use it to verify that your TOC works correctly with many sections and subsections.

---
