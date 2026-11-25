---
title: 'Dynamic OG image generation in AstroPaper blog posts'
description: 'An overview of generating dynamic Open Graph images in Astro.'
pubDate: '2026-04-02'
authors:
  - simone-de-beauvoir
toc: true
tags:
  - astro
  - SEO
---

Open Graph images are vital for social media sharing. AstroScholar can automatically generate these for you!

## How it works

When a blog post does not have a `heroImage` explicitly defined in its frontmatter, AstroScholar will fall back to dynamically generating an image based on the post's title and metadata.

This ensures every single post looks great when shared on platforms like Twitter, LinkedIn, or Facebook.
