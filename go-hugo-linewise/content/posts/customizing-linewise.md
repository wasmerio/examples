---
title: "Customizing Linewise"
description: "Configuration keys and safe override points for the Hugo theme."
date: 2026-06-06
tags: ["reference", "hugo"]
---


Linewise is designed to keep routine customization in Hugo config and site-owned assets. Override templates only when configuration is not enough.

## Public config

Theme-owned options live under `[params.linewise]`.

```toml
[params.linewise]
description = "A personal blog."
author = "Your Name"
locale = "en"
favicon = "favicon.svg"
ogImage = "og.svg"
showExplorer = true
showBufferline = true
```

| Key              | Default                   | Purpose                                                     |
| ---------------- | ------------------------- | ----------------------------------------------------------- |
| `description`    | site description fallback | SEO and Open Graph fallback text                            |
| `author`         | empty                     | Author metadata where templates need it                     |
| `locale`         | site locale               | Theme-owned locale fallback for widgets                     |
| `favicon`        | `"favicon.svg"`           | Favicon path under your site's `static/` directory          |
| `ogImage`        | `"og.svg"`                | Open Graph image path under your site's `static/` directory |
| `showExplorer`   | `true`                    | Render the file explorer and mobile drawer                  |
| `showBufferline` | `true`                    | Render the bufferline above the workspace                   |

To ship a quieter layout, turn off either chrome region:

```toml
[params.linewise]
showExplorer = false
showBufferline = false
```

## Comments

Comments are configured under `[params.linewise.comments]`.
