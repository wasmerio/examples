---
title: "Designing a token system that survives dark mode"
date: 2026-09-02
description: "Four tiers per hue, and why a value tuned as a background is unreadable as text."
categories: ["Theming"]
tags: ["tokens", "dark-mode", "css"]
cover: "images/covers/theming.svg"
featured: true
---


## Why tiers

A colour is not one value. The blue that fills a button is not the blue that
reads as text on grey, and using either in the other's place is how a design
system ships something illegible.

## The four tiers

Fill, on-fill, on-surface, and states. Every hue carries all four.

```css
:root {
  --retro-primary: #0000aa;
  --retro-primary-fg: #ffffff;
  --retro-primary-text: #000080;
}
```

## What it buys you

One class sets both a fill and the text colour that survives on it.

