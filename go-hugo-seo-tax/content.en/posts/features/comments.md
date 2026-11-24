---
title: "Comments"
date: 2026-01-14
summary: "Configure Giscus or Disqus comments for individual posts."
categories: ["Features"]
tags: ["giscus", "Disqus", "comments"]
---


## Enable Comments

```yaml
params:
  comments:
    enabled: true
    provider: "giscus"
```

## Giscus

Add your repository and category identifiers.

```yaml
giscus:
  repo: "owner/repo"
  repoId: "R_kgDO..."
  category: "Comments"
  categoryId: "DIC_kwDO..."
  mapping: "pathname"
  inputPosition: "bottom"
```

Use Disqus when you need an existing Disqus installation;
otherwise Giscus is a lightweight GitHub Discussions-based option.

