---
title: "Right-to-left"
description: "One config line mirrors the layout — and one thing deliberately does not mirror."
weight: 50
---


```toml
[languages.ar]
  languageName = "العربية"
  direction = "rtl"
  weight = 2
```

The theme emits `dir` on `<html>`, and RetroCSS positions everything with
logical properties, so spacing, alignment and start/end positioning mirror with
nothing to import.

## What does not mirror

The bevels. In the Win9x visual language the light source is fixed at the
top-left, and Windows keeps it there in RTL; flipping the raised and sunken
edges would make every button read as sunken on the wrong side. Only the
semantic accents move — an alert's stripe, a blockquote's rule — because those
mark where a line of text begins.

