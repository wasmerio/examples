---
title: Languages
order: 8
description: "How the theme publishes more than one language, and how to switch the whole layer off."
---

## What ships

English at `/`, Simplified Chinese at `/zh/`, Traditional Chinese at `/zh-Hant/`. Each language is a full set of routes, not a runtime translation.

```yaml
i18n:
  enabled: true
  defaultLanguage: en        # en | zh | zh-hant
  languages: [en, zh, zh-hant]
  detectBrowserLanguage: false
```

- `enabled: false` turns the layer off: other-language pages emit `noindex` plus a redirect stub, and the switcher disappears.
- `languages` decides what is published; drop one and its routes are not offered by the switcher or `hreflang`.
- `detectBrowserLanguage` sends a first visit from a Chinese browser to `/zh-Hant/` (zh-TW/HK/MO) or `/zh/`. A manual pick is remembered and detection stops.

## Adding a language

1. Add an entry to `src/lib/langs.ts` — key, prefix, BCP-47 tag, content suffix.
2. Create `src/i18n/locales/<key>.ts` with the UI dictionary and add it to `t()`.
3. Mirror the pages under `src/pages/<prefix>/`, passing `lang`.
4. Content collections follow the suffix: `posts/`, `posts-zh/`, `posts-zh-hant/`.

`hreflang` is emitted only for pairs that really exist, so a Chinese-only article never claims an English twin.

## Naming

Simplified is `zh-Hans`, Traditional is `zh-Hant` — never a region code like `zh-TW`, which is where a reader lives, not which script they read.
