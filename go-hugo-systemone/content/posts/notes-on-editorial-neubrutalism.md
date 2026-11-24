---
title: "Notes on editorial neubrutalism"
date: 2026-02-03
description: "Nine signatures, and what immediately breaks the style — a heading-heavy post for testing the table of contents in a later stage."
tags: ["design-system", "typography"]
---


Editorial neubrutalism is the umbrella term Systemone's design spec uses for
its own visual grammar: oversized display type, monospace utility text,
square geometry, thin ink rules, and occasional hard-offset shadows on warm
paper. This post walks through the nine signatures and a few of the things
that break them, mostly as a fixture for headings — this page has enough
`h2`/`h3` structure to be a realistic candidate for a future table of
contents component.

## Square boxes

Zero radius on every authored component and pseudo-element. Buttons, inputs,
checkboxes, images, code, tags, menus, focus rings, and avatars are all
square. There is no authored exception.

### Where this shows up

Every interactive control in the theme inherits `--radius: 0px` from the
token sheet, rather than each component declaring its own value.

### What it rules out

Rounded cards, pill tags, and circular avatar crops are all explicitly out
of bounds.

## Paper and ink

Large, quiet, nearly monochrome surfaces — not a collection of colored
cards. Lime and pink are reserved for principal signals and editorial
interruptions, not decoration.

### Contrast discipline

Every permitted foreground/background pair in the spec is independently
verified against the WCAG relative-luminance formula, rounded to two
decimals.

## Oversized display typography

