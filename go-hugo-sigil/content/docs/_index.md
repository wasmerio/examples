---
title: "Documentation"
translationKey: "docs"
slug: docs
categories: []
---


# Documentation

Everything you need to make SIGIL your own. This page is the map; the
[configuration examples](../config-example/) are the copy-paste starting points,
and the [API contract](../api/) is the frozen reference. Requirements and
installation are in the
[README](https://github.com/ouatis/hugo-theme-sigil#install).

{{< page-anatomy >}}

## Getting Started

SIGIL runs on Hugo ≥ 0.166 extended with no build step. Set your
`baseURL`, pick a `[params]` block from the examples, and write posts in
Markdown. Out of the box you get Latin typography, sidenotes, search, and
dark mode; CJK needs the optional font subset
(`bash scripts/build-fonts.sh corpus`) if you want it to render in real Plex
rather than the system fallback.

## Writing with the features

Each feature is opt-in per page, so nothing loads unless a post asks for it.
In a post's front matter:

```toml
math    = true   # KaTeX for $...$ and \(...\)
mermaid = true   # Mermaid diagrams from ```mermaid blocks
lightbox = true  # click-to-enlarge images
```

- **Sidenotes** — write a footnote `[^1]` and define it `[^1]: note text`.
  On wide screens it floats to the margin; on narrow screens it collects at
  the end. Same Markdown, no theme-specific syntax.
- **Multilingual** — give translations the same `translationKey`; the language
  switcher jumps to the matching post. Pages without a translation fall back
  to that language's home. Right-to-left languages (Arabic, Persian, Hebrew,
  Central Kurdish) mirror the whole layout — sidenotes, the floating TOC,
  arrows — when the language declares `direction = "rtl"` in your site config.
