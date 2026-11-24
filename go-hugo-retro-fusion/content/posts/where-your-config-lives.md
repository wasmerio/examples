---
title: "Where Your Config Lives"
date: 2026-09-21
description: "theme.toml, hugo.toml, and the config/_default directory."
summary: "Two files with similar names do very different jobs. Also: Hugo merges config found inside a theme, which surprises people."
categories: ["Setup"]
tags: ["config", "hugo.toml"]
series: ["Start Here"]
---


Two files are easy to confuse:

| File | Lives in | What it is |
|---|---|---|
| `theme.toml` | the **theme** folder | Metadata for the Hugo themes showcase — name, licence, `min_version`. Never read as configuration. |
| `hugo.toml` | **your site** root | Your actual settings. |

You never need to edit `theme.toml`. Everything you configure goes in your
site's config.

## One file or a config directory

Both work. A single `hugo.toml` is simpler; the directory is nicer once you have
a lot of settings or more than one person editing them.

```
your-site/
├── config/
│   └── _default/
│       ├── hugo.toml        baseURL, title, theme, taxonomies
│       ├── params.toml      everything under [params]
│       └── menus.toml       menu definitions
├── content/
└── themes/retro-fusion/
```

The one gotcha when splitting: **each file's contents are that section's
top-level keys**, so the wrapper disappears.

```toml
# hugo.toml (single file)        # config/_default/params.toml (split)
[params]                         mode    = "blog"
  mode = "blog"                  author  = "Ada Lovelace"
  author = "Ada Lovelace"
```

Same for menus — `[[menus.main]]` in a single file becomes `[[main]]` in
`menus.toml`.
