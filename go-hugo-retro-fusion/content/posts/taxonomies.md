---
title: "Taxonomies"
date: 2026-09-01
description: "Categories, tags, and any custom taxonomy you want to add."
summary: "The theme renders any taxonomy generically, so a new one needs no template work — just declare it and use it."
categories: ["Content"]
tags: ["taxonomies", "categories", "tags"]
series: ["Make It Yours"]
---


```toml
[taxonomies]
  category = "categories"
  tag      = "tags"
  series   = "series"
```

Without this block the tag cloud and category list render nothing, because
there are no terms to list.

## What you get for free

For each taxonomy Hugo builds two kinds of page, and the theme styles both:

| Page | Example | Shows |
|---|---|---|
| Terms index | `/tags/` | A cloud sized by post count, plus an A–Z table |
| Term | `/tags/hugo/` | Every post carrying that tag, paginated |

## Adding your own

A custom taxonomy needs no template work at all. Declare it, use it in front
matter, and the theme renders it with the same cloud and table:

```toml
[taxonomies]
  category = "categories"
  tag      = "tags"
  topic    = "topics"
```

```yaml
topics: ["static-sites", "performance"]
```

That is the whole change. The theme reads the taxonomy's own name and plural,
so headings come out as you would expect.

