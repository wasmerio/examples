---
title: site.config.yaml reference
order: 1
description: Every key, its type and its default. This is the page to search when something looks off.
---

One file controls the site. Types below are YAML types; “—” means the key has no default and is simply absent when you omit it.

## site

| Key                    | Type         | Default                          |
| ---------------------- | ------------ | -------------------------------- |
| `name`                 | string       | —                                |
| `nameZh`               | string       | falls back to `name`             |
| `tagline`              | string       | `""`                             |
| `taglineZh`            | string       | falls back to `tagline`          |
| `description`          | string       | `""`                             |
| `descriptionZh`        | string       | falls back to `description`      |
| `url`                  | string       | `https://example.com`            |
| `author`               | string       | `""`                             |
| `authorZh`             | string       | falls back to `author`           |
| `email`                | string       | `""`                             |
| `telegram`             | string       | `""`                             |
| `contactEndpoint`      | string       | `""` (form falls back to mailto) |
| `greeting`             | string       | `""`                             |
| `greetingZh`           | string       | falls back to `greeting`         |
| `avatar`               | string       | `""`                             |
| `defaultLanguage`      | `en` \| `zh` | `en`                             |
| `showLanguageSwitcher` | boolean      | `true`                           |

## nav and navCta

| Key                        | Type   | Default                            |
| -------------------------- | ------ | ---------------------------------- |
| `nav[].label`              | string | —                                  |
| `nav[].labelZh`            | string | — (item hidden on `/zh/`)          |
| `nav[].href`               | string | —                                  |
| `nav[].items[]`            | list   | — (turns the item into a dropdown) |
| `nav[].items[].sub`        | string | `""`                               |
| `navCta.label` / `labelZh` | string | `""`                               |
| `navCta.href`              | string | `""` (no button when empty)        |

## footerColumns and footer

| Key                                 | Type                    | Default              |
| ----------------------------------- | ----------------------- | -------------------- |
| `footerColumns[].title` / `titleZh` | string                  | —                    |
| `footerColumns[].links[]`           | list of `{label, href}` | —                    |
| `footer.note` / `noteZh`            | string                  | `""`                 |
| `footer.copyrightName`              | string                  | `site.name`          |
| `footer.authorUrl`                  | string                  | `""`                 |
| `footer.authorLabel`                | string                  | `""`                 |
| `footer.artLight` / `artDark`       | string                  | `""` (1600×529 WebP) |

## theme, promoBanner, analytics, seo

| Key                                       | Type                        | Default              |
| ----------------------------------------- | --------------------------- | -------------------- |
| `theme.accent`                            | string                      | `#ff6b01`            |
| `theme.defaultMode`                       | `auto` \| `light` \| `dark` | `auto`               |
| `theme.radius`                            | string                      | `12px`               |
| `promoBanner.enabled`                     | boolean                     | `true`               |
| `promoBanner.dismissible`                 | boolean                     | `true`               |
| `promoBanner.text` / `textZh`             | string                      | `""`                 |
| `promoBanner.link`                        | string                      | `""`                 |
| `analytics.umami.enabled`                 | boolean                     | `false`              |
| `analytics.umami.scriptUrl` / `websiteId` | string                      | `""`                 |
| `analytics.googleAnalytics.enabled`       | boolean                     | `false`              |
| `analytics.googleAnalytics.measurementId` | string                      | `""`                 |
| `analytics.clarity.enabled`               | boolean                     | `false`              |
| `analytics.clarity.projectId`             | string                      | `""`                 |
| `consent.enabled`                         | boolean                     | `true`               |
| `consent.storageKey`                      | string                      | `inkfolio-consent`   |
| `consent.text` / `textZh`                 | string                      | `""`                 |
| `consent.link`                            | string                      | `""`                 |
| `consent.accept` / `reject`               | string                      | `Accept` / `Decline` |
| `seo.titleTemplate`                       | string                      | `{title}`            |
| `seo.defaultDescription`                  | string                      | `site.description`   |
| `seo.ogImage`                             | string                      | `""`                 |
| `seo.twitterHandle`                       | string                      | `""`                 |
| `seo.structuredData`                      | boolean                     | `true`               |
| `seo.robots`                              | string                      | `index,follow`       |

## mcp

| Key                                 | Type    | Default                                    |
| ----------------------------------- | ------- | ------------------------------------------ |
| `mcp.enabled`                       | boolean | `false` (env `MCP_ENABLED=true` overrides) |
| `mcp.endpoint`                      | string  | `""` → `https://<site.url host>/mcp`       |
| `mcp.name`                          | string  | `<site.name> MCP`                          |
| `mcp.sources[].host`                | string  | —                                          |
| `mcp.sources[].items`               | number  | — (renders a dash)                         |
| `mcp.sources[].desc.en` / `desc.zh` | string  | —                                          |
| `mcp.tools[].name`                  | string  | —                                          |
| `mcp.tools[].args`                  | string  | `""`                                       |
| `mcp.tools[].desc.en` / `desc.zh`   | string  | —                                          |

## Files the config does not cover

| File                     | What it holds                 |
| ------------------------ | ----------------------------- |
| `src/data/projects.yaml` | project cards                 |
| `src/data/tools.yaml`    | the `/nav/` directory         |
| `src/data/friends.yaml`  | blogroll                      |
| `src/data/log.json`      | activity heatmap (generated)  |
| `public/icons/*.svg`     | icons referenced by filename  |
| `public/footer/*.webp`   | footer illustration, 1600×529 |
