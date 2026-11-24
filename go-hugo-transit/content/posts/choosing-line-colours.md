---
title: "Choosing Line Colours"
date: 2020-03-14
description: "Palettes, pinned colours and two-letter codes."
tags: ["transit", "design", "css"]
---


Lines take their colours from a palette, in order of how busy they are. The default palette has ten colours, each dark enough to carry white text on a line bullet.

```toml
[params.transit]
  palette = ["#C62828", "#1565C0", "#2E7D32"]
  [params.transit.colors]
    golang = "#00796B"
  [params.transit.codes]
    golang = "GO"
```

Pin a colour to a tag when you want it to stay the same as your site grows. Codes are worked out from the tag name, but you can set your own.

