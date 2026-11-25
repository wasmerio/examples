+++
title = "Header and Navigation"
date = 2026-01-03T00:00:00Z
draft = false
tags = ["setup", "navigation"]
SubTitle = "The header links home. Everything else lives in the footer."
+++

### The header

The header is configured once in `hugo.toml` under `[params]`. You have two options:

**Text header**

```toml
[params]
  HeaderText = "My Site"
```

Renders as an `<h1>` linked to `/`. Simple, fast, no assets required.

**Image header**

```toml
[params]
  HeaderImage = "/assets/images/header.svg"
```

Renders as an `<img>` linked to `/`. SVG works best — it scales cleanly to any column width without going blurry or needing `@2x` variants.

Put your image in `static/assets/images/`. Hugo serves everything in `static/` from the site root, so `static/assets/images/header.svg` becomes `/assets/images/header.svg`.

A page can override the site header with its own `HeaderText` or `HeaderImage` front matter param, but this is rarely useful — the header is intentionally the same on every page.

### The footer menu

All navigation lives in `[[menu.main]]` entries in `hugo.toml`. The footer renders them as inline links, followed by a "last updated" timestamp.

```toml
[[menu.main]]
