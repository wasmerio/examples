---
title: Turn the banner off in one line
description: The ZensInk banner at the top of this theme is optional, dismissible, and removable without touching code.
date: 2026-11-12
cover: /og/posts/en/turn-off-the-banner.png
coverAlt: Turn the banner off in one line
tags: [configuration, banner]
categories: ['Setup']
---

Inkfolio is free and open source. To keep it maintained, the theme ships with a small banner that mentions [ZensInk](https://zens.ink), the SEO toolkit this site was built alongside. You are not stuck with it.

## Remove it entirely

Open `site.config.yaml`, find `promoBanner`, and change one value:

```yaml
promoBanner:
  enabled: false
```

Save. The banner is gone from every page — the HTML is not rendered at all, so there is no hidden element left behind and nothing to click.

## Keep it, but change the words

```yaml
promoBanner:
  enabled: true
  dismissible: true
  text: This site runs on Inkfolio
  link: https://example.com
  linkText: Read more
```

Point the link at your newsletter, your product, or your own project. The banner is a normal config value; it has no special status in the code.

## What "dismissible" does

With `dismissible: true`, visitors get a close button. Once they click it, the choice is saved in `localStorage` under `inkfolio-promo-dismissed`, and the banner stays closed on that browser. Set it to `false` if you want the banner permanent — for example on a site where the banner is a legal notice rather than a promotion.

One detail worth knowing: the banner element starts hidden and is revealed by a few lines of inline JavaScript. That is what stops it from flashing back on every page load after someone closes it. If a visitor has JavaScript disabled, the banner stays hidden rather than showing un-dismissable.
