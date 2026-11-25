---
sections:
  - "5.1 Document Structure"
  - "5.2 Finding Elements"
  - "5.3 Changing the Document"
---

## Document Structure

The browser parses HTML into a tree of nodes called the **DOM** (Document Object Model). Every element, text snippet, and comment becomes a node. The tree starts at `document.documentElement` (the `<html>` tag) and branches out through `childNodes`, `firstChild`, `lastChild`, `parentNode`, and `nextSibling`.

Element nodes have a `nodeType` of 1, text nodes are 3. The DOM is a live representation — change it, and the page changes immediately.

## Finding Elements

**`document.querySelector(selector)`** returns the first matching element. **`querySelectorAll(selector)`** returns a static NodeList of all matches. Both accept CSS selectors, making them far more flexible than the older `getElementById` or `getElementsByClassName`.

`querySelector` is enough for most cases. Only reach for `querySelectorAll` when you actually need multiple elements.

## Changing the Document

**`createElement`** makes a new node. **`appendChild`** attaches it to a parent. **`insertBefore`** places it before a reference node. **`remove()`** detaches a node from the tree. Moving a node automatically removes it from its old position — a node can only exist in one place.

Attributes and properties overlap but aren't identical. Setting `element.href` and `element.setAttribute("href", ...)` usually do the same thing, but custom attributes need `setAttribute`. Touching the DOM triggers **layout and reflow** — batch your changes to avoid performance hits.
