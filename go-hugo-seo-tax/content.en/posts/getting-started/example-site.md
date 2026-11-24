---
title: "Use the Example Site"
date: 2026-01-04
summary: "Run the SeoTax example site locally and use it as a starting point."
categories: ["Guide"]
tags: ["exampleSite", "Hugo", "local server"]
---


## Run It from the Repository

```bash
cd exampleSite
mkdir -p themes
ln -sf ../.. themes/seotax
hugo server --minify
```

This workflow is useful when you are changing the theme and want immediate feedback.

## Update These Values First

- `baseURL`
- `title` and `description`
- `params.author`
- `params.social.github`
- `params.schema.sameAs`

