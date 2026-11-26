---
name: config
description: Full `IntegrationInput` reference for the `eminence()` integration factory.
disable-model-invocation: true
---

# Configuring `eminence()`

The integration is the default export of `eminence-astro-suite`. It accepts a single `IntegrationInput` object.

```ts title="astro.config.mjs"
import { defineConfig } from "astro/config";
import eminence from "eminence-astro-suite";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    eminence({
      headTags: {/* ... */},
      icons: {/* ... */},
      manifest: {/* ... */},
      robotsTxt: {/* ... */},
      securityTxt: {/* ... */},
      sitemap: {/* ... */},
    }),
  ],
});
```

## Top-level `IntegrationInput`

| Option        | Type                          | Default        | Description                                                                                                                                                   |
| ------------- | ----------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headTags`    | `HeadTagsOptions`             | `{}`           | Site-wide defaults consumed by components via the virtual module. See the table below.                                                                        |
| `icons`       | `IconsOptions \| false`       | `undefined`    | Build-time favicon and app icon generation. `false` disables. See [./integration/icons.md](../integration/icons.md).                                          |
| `manifest`    | `WebManifestOptions \| false` | `undefined`    | `manifest.webmanifest` generation. `false` disables. See [./integration/manifest.md](../integration/manifest.md).                                             |
| `robotsTxt`   | `RobotsTxtOptions \| false`   | `undefined`    | `robots.txt` generation. `false` disables and silences the recommendation. See [./integration/robots-txt.md](../integration/robots-txt.md).                   |
| `securityTxt` | `SecurityTxtOptions \| false` | `undefined`    | `.well-known/security.txt` generation. `false` disables and silences the recommendation. See [./integration/security-txt.md](../integration/security-txt.md). |
| `sitemap`     | `SitemapOptions \| false`     | `{}` (enabled) | Forwarded to `@astrojs/sitemap`. `false` disables registration entirely. See [./integration/sitemap.md](../integration/sitemap.md).                           |

Rules:

- All top-level fields are optional. Omitting a field is **not** the same as passing `false`:
  - **Omitting** `robotsTxt` / `securityTxt` / `manifest` triggers a recommendation warning at build time.
  - Passing **`false`** silences the warning and explicitly disables the feature.
  - Omitting `sitemap` is equivalent to `sitemap: {}` (enabled with defaults).
  - Omitting `icons` skips icon generation without a warning.

## `headTags` sub-options

`headTags` only sets defaults — it does not emit tags. Tags are emitted by components (`Head` covers all of them). Per-page props on a component override the matching `headTags` default.

| `headTags.` field   | Type                                                                                                | Component                                             | Default                                 | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `charset`           | `string`                                                                                            | [`Charset`](../components/charset.md)                 | `"utf-8"`                               | Document charset.                                                                             |
| `viewport`          | `string`                                                                                            | [`Viewport`](../components/viewport.md)               | `"width=device-width, initial-scale=1"` | Viewport meta content.                                                                        |
| `titleTemplate`     | `` `${string}%s${string}` ``                                                                        | [`Title`](../components/title.md)                     | `"%s"`                                  | Template with `%s` placeholder.                                                               |
| `base`              | `{ href?: string; target?: string }`                                                                | [`Base`](../components/base.md)                       | —                                       | `<base>` defaults.                                                                            |
| `appleItunesApp`    | `{ content: string }` \| `{ id: string; argument?: string }`                                        | [`AppleItunesApp`](../components/apple-itunes-app.md) | —                                       | Smart App Banner defaults.                                                                    |
| `colorScheme`       | `"normal" \| "light" \| "dark" \| "light dark" \| "dark light" \| "only light"`                     | [`ColorScheme`](../components/color-scheme.md)        | —                                       | Default color scheme.                                                                         |
| `generator`         | `boolean`                                                                                           | [`Generator`](../components/generator.md)             | `true`                                  | Emit the generator meta tag.                                                                  |
| `humansTxt`         | `string \| URL \| boolean`                                                                          | [`HumansTxt`](../components/humans-txt.md)            | `undefined`                             | See [./integration/humans-txt.md](../integration/humans-txt.md) for the three-state behavior. |
| `icons`             | `IconTag[]`                                                                                         | [`Icons`](../components/icons.md)                     | merged from generated icons             | Extra/override `<link>` tags merged over build-generated ones by `href`.                      |
| `manifest`          | `string \| URL \| boolean`                                                                          | [`Manifest`](../components/manifest.md)               | derived when `manifest` option is set   | Manifest URL. `true` derives from `Astro.site`.                                               |
| `openGraphSiteName` | `string`                                                                                            | [`OpenGraph`](../components/open-graph.md)            | —                                       | Default `og:site_name`.                                                                       |
| `robots`            | `RobotsProps`                                                                                       | [`Robots`](../components/robots.md)                   | —                                       | Default robots directives.                                                                    |
| `themeColor`        | `string \| { light: string; dark: string }`                                                         | [`ThemeColor`](../components/theme-color.md)          | —                                       | Default theme color (single or paired).                                                       |
| `verification`      | `{ google?: string; yandex?: string; bing?: string; others?: { name: string; content: string }[] }` | [`Verification`](../components/verification.md)       | —                                       | Search console tokens.                                                                        |
| `extend`            | `{ link?: ExtendLinkTag[]; meta?: ExtendMetaTag[]; custom?: string \| string[] }`                   | [`Extend`](../components/extend.md)                   | —                                       | Default extra tags.                                                                           |

See [./integration/head-tags.md](../integration/head-tags.md) for the per-field resolution semantics (which fields get merged vs. replaced when also set on a page).

## Minimal recommended baseline

```ts
eminence({
  headTags: {
    titleTemplate: "%s | Example",
    openGraphSiteName: "Example",
    themeColor: { light: "#ffffff", dark: "#0b0b0b" },
  },
  icons: { source: "src/assets/logo.svg" },
  manifest: {
    name: "Example",
    short_name: "Example",
    start_url: "/",
    display: "standalone",
  },
  robotsTxt: {
    rules: [{ agent: "*", disallow: "/private/" }],
    sitemap: "/sitemap-index.xml",
  },
  securityTxt: {
    contact: "mailto:security@example.com",
    expires: "1 year",
  },
});
```

## Cross-references

- Each feature has a dedicated page under [./integration/](../integration/).
- Each component that reads a `headTags.*` default links back to this page in its "Integration default" row.
- Output policy and excluded surfaces: [./policies/](../policies/).
