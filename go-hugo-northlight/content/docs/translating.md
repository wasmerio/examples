---
title: "Translating"
description: "Every string the theme puts on screen lives in one file. Translating it means copying that file."
weight: 7
date: 2026-07-27
---


No user-facing string is hardcoded in a template. They all live in `i18n/en.toml`, so
translating the theme means copying that file to your language code and translating the
values. Nothing else changes.

```bash {file="terminal"}
cp themes/northlight/i18n/en.toml i18n/nb.toml
```

Then set the language:

```toml {file="hugo.toml"}
locale = "nb"
defaultContentLanguage = "nb"
```

Your site's `i18n/` wins over the theme's, and any key you leave out falls back to the
theme's English, so a partial translation degrades one string at a time rather than
producing blanks.

## Several languages at once

Translating the chrome is one thing; running the site in more than one language is another,
and Hugo does most of it. Declare the languages and the theme supplies the rest — a
switcher in the header, `hreflang` alternates in `<head>`, a search index per language, and
per-language date formats.

```toml {file="hugo.toml"}
[languages]
  [languages.en]
    label = "English"
    weight = 1
    [languages.en.params]
      displayName = "English"

  [languages.nb]
    label = "Norsk bokmål"
    weight = 2
    [languages.nb.params]
