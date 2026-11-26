---
title: 'Typography for Technical Writing'
description: 'A short guide to typography for technical writing: choosing a readable measure, using monospace and proportional fonts with purpose, and keeping numbers, quotes and dashes consistent.'
pubDate: 2026-09-14
lang: en
tags: [Typography]
category: 设计
---

Technical writing has a particular burden. The reader is often switching between prose, code, tables and diagrams, and they are usually trying to act on what they read. Good typography does not make a document more beautiful for its own sake. It makes the next step easier to find.

## Set the measure first

The **measure** is the length of a line of text. For long-form reading, most designers recommend somewhere between 45 and 75 characters per line, with about 66 as a comfortable target. Lines much longer than that make the eye lose its place when it returns to the left margin. Lines much shorter make the text feel choppy.

In CSS, a common approach is to set the container width in `em` instead of pixels, because `em` scales with the reading font size:

```css
.prose {
  max-width: 42em;
  line-height: 1.7;
}
```

Forty-two `em` at a body size of 16 pixels is about 670 pixels, which lands close to the target range for typical Latin text.

## Use monospace with purpose

Monospace fonts are useful for code, file paths and command names, because the characters align and the reader can tell at a glance which text is literal. They are less useful for running prose. A common mistake is to set entire explanations in monospace because it looks technical. That choice makes the text harder to read and does not add information.

Inline code should be visually distinct from the surrounding text, but not loud. A small size reduction, a faint background and a little padding are usually enough.

## Numbers, quotes and dashes

Small typographic details add up:

- Use **curly quotes** (“ ” and ‘ ’) in prose, and straight quotes only inside code.
- Use an **en dash** (–) for ranges like 2019–2026, and an **em dash** (—) for a break in a sentence.
- Use a **real minus sign** (−) in equations and tables, not a hyphen.
- Use **tabular figures** in tables, so that columns of numbers line up.

> Consistency matters more than any single rule. A reader can adapt to an unusual choice if it is applied everywhere.

## Headings and rhythm

Headings should be spaced to show structure without drawing attention to themselves. Put more space above a heading than below it, so that each heading visually belongs to the section that follows. Avoid using bold text and large sizes at the same time for every heading; a clear hierarchy usually needs only one of those tools at each level.

Paragraphs should be short enough to scan. A paragraph of more than five or six sentences is often a sign that a list, a table or a subheading would serve the reader better.

## Checklist

Before publishing a technical article, check these points:

1. Is the line length in the comfortable range on both a phone and a laptop?
2. Is monospace used only for code, commands and identifiers?
3. Are quotes, dashes and minus signs used consistently?
4. Do tables use aligned numbers, and do their headers stand out?
5. Does every heading describe what the section contains?

Typography is mostly invisible when it works. The goal is for the reader to notice the ideas, and to forget that a font was ever involved.
