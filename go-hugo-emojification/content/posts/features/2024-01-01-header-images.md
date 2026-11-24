---
title: Header Images
date: 2024-01-01 12:00:00 +00:00
description: Optional header images with `alt` and `title` attributes.
categories: ["Features"]
url: features/header-images
params:
  featured_image:
    path: images/2011/lanterns.webp
    alt: Paper lanterns in Kyoto at night
    title: Paper lanterns in Kyoto at night
  icon: 🏞️
  theme_color: gold
  uuid: 4199C296-DAEC-4F15-9BBE-2AF80F66CB96
---

The header image is the hero. But because we use emoji as a major design element, which is located above the title, the hero image has to go below. Not perfect.

In this theme it could have been a normal image at the beginning of a post, but the header image is also used for feeds and in SEO tags for richer embeds.

`alt` and `title` attributes are taken into account if they are set in the frontmatter.

This page’s relevant YAML frontmatter:

```yaml
---
params:
  featured_image:
    path: images/2011/lanterns.webp
    alt: Paper lanterns in Kyoto at night
    title: Paper lanterns in Kyoto at night
---
```

