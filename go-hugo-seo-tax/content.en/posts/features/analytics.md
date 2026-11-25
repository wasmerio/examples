---
title: "Analytics"
date: 2026-01-30
summary: "Connect Google Analytics and review visitor activity."
categories: ["Features"]
tags: ["GA4", "Analytics", "statistics"]
---


## Google Analytics

Configure your measurement ID under `params.GoogleAnalytics`.

```yaml
params:
  GoogleAnalytics:
    tagId: "G-XXXXXXXXXX"
```

SeoTax adds the tracking script only when a tag ID is present.
Test the production build before relying on live traffic data.

