---
title: "Design Notes"
date: 2026-08-22
description: "Why the theme is small, and why some things are missing on purpose."
summary: "The early web was fast, legible and a bit strange. This theme keeps those parts and leaves the rest."
categories: ["Notes"]
tags: ["design", "philosophy", "minimal"]
---


Retro Fusion is inspired by early web culture — the period when a page was a
document, a site was somebody's project, and nobody had yet worked out that you
could put an advertisement between two paragraphs.

The look borrows from that era: beveled borders, tiled backgrounds, window
chrome, high contrast. The engineering does not. Underneath is semantic HTML5,
CSS Grid, fluid type and a small script that only ever enhances what already
works.

## Things that are missing on purpose

If a feature you expected is not here, it was probably left out rather than
forgotten.

**No shortcodes.** Nothing to learn beyond Markdown and front matter.

**No comment system.** A blog without comments is a blog. If you want them,
wire up a service you control.

**No contact form.** A form that silently drops submissions is worse than an
email address.

**No search.** It needs either a service or a build-time index, and both are
more machinery than a small site justifies. There is a `searchURL` setting if
you want to point at your own.

**No cookie banner.** The theme sets no cookies and makes no third-party
requests, so there is nothing to consent to. That changes the moment you add
analytics — which is why it is off by default.

**No dark mode toggle.** The palette is a config value. Set it to something
dark and you have dark mode.

## Things it does keep

**It works without JavaScript.** With the script blocked, the site still
navigates, the carousel still scrolls, the FAQ still opens, and the visitor
counter still shows a server-rendered number. Nothing below the fold depends on
