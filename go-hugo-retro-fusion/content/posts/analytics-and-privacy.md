---
title: "Analytics and Privacy"
date: 2026-08-28
description: "Google Analytics 4, Plausible, your own snippet, and the privacy switches."
summary: "Nothing loads by default, and nothing loads on hugo server at all. Uncomment one block and paste your ID."
categories: ["Integrations"]
tags: ["analytics", "privacy", "ga4", "plausible"]
series: ["Ship It"]
---


Analytics is off until you turn it on, and no third-party request is made
otherwise. `hugo server` never loads analytics either, so previewing your site
does not pollute your own stats.

## Turning it on

Uncomment the block for the service you use and paste your ID in. That is the
whole setup — there is nothing to change in the templates.

```toml
[params.analytics]
  # Google Analytics 4
  # [params.analytics.google]
  #   id = "G-XXXXXXXXXX"

  # Plausible - cookieless, so no consent banner needed
  # [params.analytics.plausible]
  #   domain = "yourdomain.com"
```

The `[params.analytics]` header stays in place so you only need to remove the
`#` from the two lines underneath it.

**Google Analytics 4** loads the standard `gtag.js` snippet. Leave the ID as
`G-XXXXXXXXXX` and nothing is emitted, so the placeholder is safe to leave.

**Plausible** takes a domain and loads the script from
`https://plausible.io/js/script.js`. If you self-host, point `script_url`
somewhere else.

## Something else entirely

A self-hosted counter, a verification tag, a webring script — anything goes in
as raw HTML:

```toml
  [params.analytics.custom]
    head   = "<script>...</script>"
