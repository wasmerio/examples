---
title: "Sidebar Navigation"
date: 2026-01-27
summary: "Configure the profile, categories, recent posts, and language menu."
categories: ["Features"]
tags: ["sidebar", "table of contents", "toolbar", "navigation"]
---


## Sidebar Options

```yaml
params:
  menu:
    profileImage: "/profile.svg"
    categories: true
    recentPosts: true
```

## Category Order

Use `params.menu.categoryOrder` to place important categories first.
The same ordering rule applies to parent and child categories.

## Languages

When multiple Hugo languages are configured,
SeoTax adds a language menu to the sidebar.

