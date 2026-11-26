---
title: "The quick brown fox"
publishDate: 2026-01-05
description: "A short post showing how typography looks across paragraphs, links, and quotes."
tags: [ demo ]
---

The quick brown fox jumps over the lazy dog. The five boxing wizards jump quickly. Pack my box with five dozen liquor
jugs. How vexingly quick daft zebras jump.

These pangrams are useful for sanity-checking that every glyph in the body font renders without falling back. The serif
here is [Newsreader](https://github.com/productiontype/Newsreader) — variable, self-hosted, latin-only by default. Add
more subsets in `src/styles/global.css` if you need them.

## A short paragraph in the middle

Sometimes a post just wants to be one continuous flow with a single section break. The drop cap on the first paragraph
and the quiet hairlines should carry that without much help. Anything more elaborate — multi-column, pull quotes,
marginalia — would be more weight than this template wants to hold.

> Restraint, like everything, is a tool. Use it where it serves the reader.

## Footnotes

Footnotes work via remark-gfm[^1]. They render at the bottom of the post and are linked back to the reference.

[^1]: Like this. Click the back-arrow to return to the citation.

## Inline code & emphasis

You can mix `inline code`, *italics*, **bold**, and ***both*** in the same line. ~~Strikethrough~~ works too.

Delete or replace this file once you've got real posts.
