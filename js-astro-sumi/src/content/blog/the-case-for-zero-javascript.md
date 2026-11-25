---
title: "The Case for Zero JavaScript"
description: "An article page is a solved problem. Every kilobyte of script you add to one is a bet that you can rebuild the browser's own behaviour better than the browser does."
pubDate: 2026-06-30
tags: ["performance", "astro", "craft"]
---

A blog post is text, some headings, a few links, and possibly a picture. The browser has shipped a highly optimised renderer for exactly this document since 1994. It handles selection, find-in-page, reader mode, translation, printing, screen readers, and back-button restoration without being asked.

Every script you put on that page is a wager that you can improve on it.

## What the scripts are usually for

Look at what actually loads on a typical content site and the list is short and repetitive:

- A theme toggle
- Syntax highlighting
- A table of contents that follows the scroll
- Analytics
- Comments
- A cookie banner apologising for the analytics

Three of those can be done at build time, one is a few hundred bytes inline, and two are decisions about the business rather than the page.

**Syntax highlighting** does not need a runtime. Shiki runs during the build and emits coloured `<span>` elements. The output is slightly larger HTML in exchange for zero parse, zero execution, and correct colours before the first paint. The browser was going to render those spans anyway.

**A table of contents** is derived from the headings, which are known at build time. It needs script only if you want the current section to highlight as you scroll — and that is what `IntersectionObserver` is for, in about fifteen lines, if you decide the effect is worth it. Often it isn't.

**A theme toggle** genuinely needs client code, because the choice has to persist and it has to apply before paint. It also needs about six hundred bytes:

```html
<script>
  const stored = localStorage.getItem("theme");
  if (stored) document.documentElement.dataset.theme = stored;
</script>
```

Inline it in the head and the cost is one render-blocking script that runs in under a millisecond, with no extra request.

## The number that matters is not the transfer size

Compressed JavaScript looks cheap. A 40 KB bundle sounds like nothing next to a photograph.

But a photograph is decoded on a background thread by dedicated hardware. JavaScript has to be decompressed, parsed, compiled, and executed on the main thread — the same thread that is trying to lay out and paint the page. On a mid-range Android phone, that 40 KB can cost more than a 400 KB image.

This is why Lighthouse scores fall apart on real devices while looking fine on a developer's laptop. The laptop has a fast single-core score and a warm cache. The reader has neither.

## Hydration is the expensive part

The framework cost is rarely the framework. It is the reconstruction.

To make an interactive component work after server rendering, the client has to rebuild the component tree, re-run the render, and attach listeners — for markup that is already sitting correct in the DOM. You pay to arrive at the state you were already in.

Islands architecture is a straightforward answer: hydrate the components that need it, leave the rest as HTML. The interesting part is how few components turn out to need it. On this theme, the only client code on an article page is that theme toggle. The ink simulation, which is the most expensive thing here by an order of magnitude, ships exclusively on the front page.

## What you get back

A page with no scripts has properties that are hard to buy any other way.

It works while it is still downloading. It works on a browser two years out of date. It works when the CDN hosting your bundle has an outage. It is trivially cacheable. It cannot leak the reader's behaviour, because there is nothing running to observe it.

And it is fast on the devices where speed actually decides whether someone reads the thing — which is the entire point of publishing it.
