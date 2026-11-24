---
title: Choosing and Applying Colors
date: 2024-01-07 21:00:00 +00:00
description: Only named colors and hex codes are supported
categories: ["Manuals"]
url: manuals/choosing-and-applying-colors
params:
  icon: 🎨
  theme_color: hotpink
  uuid: 4029A474-A526-40FC-84BF-6EC064408E38
---

Applying different a different color is very simple. Just add `theme_color: hotpink` to the page’s frontmatter.

This page’s relevant YAML frontmatter:

```yaml
---
params:
  theme_color: hotpink
---
```

Or the whole site can have the same color declared in the site’s `hugo.toml`.

This site’s relevant TOML config:

```toml
[params]
  theme_color = "yellowgreen"
```

But for this to work, the colors have to be defined beforehand. This theme has a couple defined, and they can be extended pretty easily.

This page’s `hotpink.css`:

```css
@import "base/black-white.css";

@media (prefers-color-scheme: light) {
  :root {
    --bg-color: hsl(330 100% 71%);
    --pre-bg-color: hsl(330 100% 76%);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: hsl(330 100% 5%);
    --pre-bg-color: hsl(330 100% 10%);
    --fg-color: hsl(330 100% 71%);
