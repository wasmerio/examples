---
title: "about YACHT"
date: 2025-11-01T12:06:34-08:00
draft: false
---


after spending a lot of time trying to customize other people's themes, i decided to create...

***YACHT** **A**nother **C**ustom **H**ugo **T**heme*

## what is YACHT

***YACHT*** is a punny and recursively named theme for the [Hugo][1] static site generator which uses the [Catppuccin
Palettes][2], the [Tailwind CLI][3], and which aims to be simple, mobile-first, accessible, responsive, and to have minimal external dependencies.

### under construction

## getting your own YACHT

the preferred way of getting your own **YACHT** is by using `Hugo modules` -- in `hugo.yaml`:

```yaml
  ...

build:
  buildStats:
    enable: true
  cachebusters:
  - source: 'assets/notwatching/hugo_stats\.json'
    target: css
  - source: '(postcss|tailwind)\.config\.js'
    target: css

hugoVersion:
   min: "0.166.0"
   extended: true

module:
  mounts:
  - source: assets
    target: assets
  - disableWatch: true
    source: hugo_stats.json
    target: assets/notwatching/hugo_stats.json
