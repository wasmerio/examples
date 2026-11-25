---
title: "Integrations"
description: "Comments, analytics, feeds, search, and the two escape hatches for everything else."
weight: 6
date: 2026-07-27
---


The theme makes **no third-party requests by default**. Fonts are self-hosted, there are
no CDN scripts and nothing calls home. Everything below is opt-in, and a site that
configures none of it ships a page that talks to nobody.

## Comments

giscus is built in, driven entirely by params. Comments are GitHub Discussions, so
moderation, threading and reactions are GitHub's rather than yours to run.

```toml {file="hugo.toml"}
[params.article]
  showComments = true

[params.comments.giscus]
  repo = "you/your-repo"
  repoId = "R_..."             # from giscus.app
  category = "Announcements"
  categoryId = "DIC_..."       # from giscus.app
  mapping = "pathname"         # optional
  reactionsEnabled = "1"       # optional
```

Leave any of the four required keys out and nothing loads. A comment system is a
third-party script, and no theme should load one by surprise.

> [!TIP]
> The widget follows **this site's** appearance toggle, not just your operating system.
> giscus renders in a cross-origin iframe that no stylesheet here can reach, so the
> theme messages it directly whenever the mode changes. Without that, switching to dark
> on a light-mode machine leaves a bright comment box under a dark article.

Using utterances, Cusdis, Remark42 or a static form instead? Copy
`layouts/_partials/comments.html` into your own site and replace it wholesale.

## Analytics

**Nothing is sent unless you configure a provider.** With none set the theme makes no
third-party request at all, and that is the shipped default.
