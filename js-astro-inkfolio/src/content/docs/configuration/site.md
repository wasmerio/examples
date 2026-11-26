---
title: Site settings
order: 1
description: Name, tagline, author, language and the canonical URL — all in one block.
---

```yaml title="site.config.yaml"
site:
  name: Inkfolio
  nameZh: Inkfolio
  tagline: Write it down, ship it
  taglineZh: 写下来，做出来
  description: One sentence about the site.
  url: https://example.com
  author: Your Name
  email: you@example.com
  defaultLanguage: en
  showLanguageSwitcher: true
```

## Which keys do what

- `name` / `nameZh` — navigation brand and the `<title>` suffix. The Chinese name is only used on `/zh/` pages.
- `tagline` / `taglineZh` — the sentence under the headline on list pages.
- `description` / `descriptionZh` — meta description and the paragraph under the home headline.
- `url` — canonical, sitemap, RSS. No trailing slash.
- `author` / `authorZh` — byline on every article.
- `email` — optional, appears in the footer only when set.
- `defaultLanguage` — `en` or `zh`; decides which tree sits at `/`.
- `showLanguageSwitcher` — `false` hides every language link at once.

> [!NOTE]
> There is no separate “site title” for search engines: `name` is used for both. If you want a different browser-tab title, per-page titles already override it.

## Chinese pages

Every optional `*Zh` key falls back to the English value when omitted, so a single-language site is just `showLanguageSwitcher: false` and no `*Zh` keys.

## Weather and local time

The footer can show the reader's clock and current conditions. It is off unless `weather.enabled` is `true`.

```yaml
weather:
  enabled: true
  mode: visitor        # visitor = the reader's location · fixed = the address below
  units: celsius       # celsius | fahrenheit
  geoEndpoint: ''      # visitor mode only; '' uses ipwho.is
  fallbackLatitude: 31.2304
  fallbackLongitude: 121.4737
  label: Shanghai
  labelZh: 上海
  latitude: 31.2304
  longitude: 121.4737
  timezone: Asia/Shanghai
```

The clock ticks to the second in the reader's own timezone. In `visitor` mode weather follows a keyless IP lookup, with the fallback coordinates used only if that fails. Set `mode: fixed` to report one address instead: then `label`, `latitude`, `longitude` and `timezone` are what the widget uses. No API key is involved — Open-Meteo needs none, and `geoEndpoint` lets you route the lookup through your own proxy. Weather is cached for 30 minutes; if everything fails the weather halves disappear and the clock stays.

Three unrelated geolocation services are tried in order — your `geoEndpoint` first if set, then `ipwho.is`, `get.geojs.io` and `ipapi.co`, each with a four-second deadline — because extensions, corporate networks and some countries block any single one of them. When all of three fail, the fallback coordinates are used and the widget shows their label, so a temperature is never reported for an unnamed place.
