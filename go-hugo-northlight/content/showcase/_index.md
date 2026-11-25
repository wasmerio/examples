---
title: "Showcase"
description: "Sites running Northlight. Add yours."
---


Every site below is built with this theme. If yours is too, add it — the list is only
useful if it is other people's work as well as the author's, and seeing a theme running
on real content is worth more than any screenshot.

## Adding your site

Append a block to `exampleSite/data/showcase.toml` in the
[theme repository](https://github.com/mortennordbye/northlight) and open a pull request:

```toml
[[sites]]
  name = "example.com"
  url = "https://example.com"
  author = "Your Name"
  description = "One sentence about what you write about."
```

All four fields are required and the build fails if one is missing, so the pull request
tells you before a reviewer has to. Entries render in file order, so add yours at the
bottom. No image, no analytics, nothing fetched: the card is those four values, which is
why this page costs a reader no third-party request.

Two things are asked of the site: it is yours, and it actually runs Northlight. A fork
with the theme changed beyond recognition is welcome too — say so in the description.

