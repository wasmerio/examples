---
title: "A zero-build CSS pipeline for Hugo"
date: 2026-01-14
description: "How Systemone assembles hand-written CSS with Hugo Pipes alone, no Node build step required."
tags: ["css", "hugo", "build"]
---


Systemone ships hand-written plain CSS. There is no Sass, no PostCSS, no
Tailwind, and no Node build dependency — `resources.Concat`, `resources.Minify`
and `resources.Fingerprint` are the only build tooling, and Hugo is already
running them.

The theme's `head.html` partial assembles the final stylesheet from an
ordered list of files:

```go-html-template
{{- $cssFiles := slice "css/reset.css" "css/tokens.css" "css/base.css" "css/prose.css" "css/a11y.css" -}}
{{- $cssResources := slice -}}
{{- range $cssFiles -}}
  {{- with resources.Get . -}}
    {{- $cssResources = $cssResources | append . -}}
  {{- end -}}
{{- end -}}
{{- $css := $cssResources | resources.Concat "css/systemone.css" -}}
{{- if hugo.IsProduction -}}
  {{- $css = $css | minify | fingerprint -}}
{{- end -}}
```

A small generated stylesheet, built from validated `design.*` params, is
appended last so a site's `hugo.toml` can override a handful of tokens
without touching the theme's own CSS files:

```toml
[design]
  appearance = "auto"
  lime = "#d4ff3f"
  pink = "#ee5ba6"
  containerMax = "1160px"
```

## Why this matters

A user should be able to clone the theme, point Hugo at it, and read the
site without running `npm install` first. That constraint shapes everything
