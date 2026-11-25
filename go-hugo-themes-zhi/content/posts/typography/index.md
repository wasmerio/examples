---
title: "Typography Test"
date: 2024-03-10
categories: ["test"]
tags: ["typography", "test"]
description: "Comprehensive typography test covering headings, paragraphs, lists, blockquotes, tables, and inline elements"
---


## Headings

### H3 Heading

This section tests third-level headings and their visual appearance in the TOC.

#### H4 Heading

Fourth-level headings provide additional document structure. The TOC should respect `maxDepth` configuration.

## Paragraphs

This is a standard paragraph with **bold text**, *italic text*, `inline code`, and a [hyperlink](https://example.com). These are the most common inline formatting elements used in technical writing.

A second paragraph to verify spacing. Hugo normalizes Markdown content using Goldmark, which follows the CommonMark specification. Paragraphs separated by blank lines receive proper `<p>` tags.

A paragraph with ~~strikethrough~~ text and superscript^2^ and subscript~n~ notation for technical content.

## Unordered Lists

- First item in the list
- Second item with more detail
  - Nested item under second
  - Another nested item
    - Deeply nested at level three
- Third item
- Fourth item with `inline code` reference

## Ordered Lists

1. First ordered item
2. Second ordered item with a longer description that might wrap to multiple lines to test line height and spacing
3. Third item
   1. Nested ordered item
   2. Another nested ordered item
4. Fourth item

## Mixed Lists
