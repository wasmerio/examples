---
title: "Markdown Features and Typography"
description: "Explore the markdown features and typography options available in this theme"
published: true
date: 2024-01-10
author: "amirdaraee"
keywords: ["markdown", "typography", "formatting", "writing"]
photo: "/sample-2.jpg"
imgCredit: "Photo by Sample Image 2"
language: "en"
---

# Markdown Features and Typography

This post demonstrates the various markdown features and typography styles available in this theme.

## Headings

You can use headings from H1 to H6:

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Text Formatting

You can make text **bold**, *italic*, ***bold and italic***, ~~strikethrough~~, or `inline code`.

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

### Ordered Lists

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

## Blockquotes

> "The best way to predict the future is to invent it."
>
> — Alan Kay

> **Note**: Blockquotes can contain other markdown elements like **bold text** and `code`.

## Code Blocks

Here's a Python code example:

```python
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

# Generate first 10 Fibonacci numbers
result = fibonacci(10)
print(result)
```

## Links and Images

You can add [links](https://astro.build) to your content.

Images are supported through the `photo` frontmatter field for cover images, or inline in your markdown.

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Dark Mode | ✅ | Toggle in header |
| SEO | ✅ | Built-in meta tags |
| Syntax Highlighting | ✅ | Prism with GitHub Dark |
| Mobile Responsive | ✅ | Mobile-first design |

## Horizontal Rule

You can add horizontal rules to separate content:

---

## Conclusion

This theme supports all standard markdown features, making it easy to write rich, formatted content for your blog.
