# `Head`

Renders a complete `<head>` element composing every metadata sub-component in fixed order. **Default choice for almost every page.**

```astro
---
import { Head } from "eminence-astro-suite/components";
---

<Head title="Home" description="Welcome to Example" />
```

## Import

```ts
import { Head, type HeadProps } from "eminence-astro-suite/components";
```

## Props

| Prop                 | Type                                                 | Default                                                       | Required | Sub-component                                    |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | -------- | ------------------------------------------------ |
| `title`              | `string`                                             | —                                                             | **yes**  | [`Title`](./title.md)                            |
| `description`        | `string`                                             | —                                                             | **yes**  | [`Description`](./description.md)                |
| `titleTemplate`      | `` `${string}%s${string}` ``                         | `headTags.titleTemplate` ↦ `"%s"`                             | no       | [`Title`](./title.md)                            |
| `charset`            | `string \| false`                                    | `headTags.charset` ↦ `"utf-8"`                                | no       | [`Charset`](./charset.md)                        |
| `viewport`           | `string \| false`                                    | `headTags.viewport` ↦ `"width=device-width, initial-scale=1"` | no       | [`Viewport`](./viewport.md)                      |
| `base`               | `BaseProps \| false`                                 | `headTags.base`                                               | no       | [`Base`](./base.md)                              |
| `appleItunesApp`     | `AppleItunesAppProps \| false`                       | `headTags.appleItunesApp`                                     | no       | [`AppleItunesApp`](./apple-itunes-app.md)        |
| `extend`             | `ExtendProps`                                        | `headTags.extend`                                             | no       | [`Extend`](./extend.md)                          |
| `canonical`          | `string \| URL \| false`                             | derived from `Astro.site`                                     | no       | [`Canonical`](./canonical.md)                    |
| `colorScheme`        | `ColorSchemeContent \| false`                        | `headTags.colorScheme`                                        | no       | [`ColorScheme`](./color-scheme.md)               |
| `generator`          | `boolean`                                            | `headTags.generator` ↦ `true`                                 | no       | [`Generator`](./generator.md)                    |
| `humansTxt`          | `string \| URL \| false`                             | `headTags.humansTxt` (resolved)                               | no       | [`HumansTxt`](./humans-txt.md)                   |
| `icons`              | `Record<string, IconTag \| false> \| false`          | `headTags.icons` (merged from build)                          | no       | [`Icons`](./icons.md)                            |
| `jsonLd`             | `Record<string, unknown> \| string`                  | —                                                             | no       | [`JsonLd`](./json-ld.md)                         |
| `languageAlternates` | `Record<string, string \| URL>`                      | —                                                             | no       | [`LanguageAlternates`](./language-alternates.md) |
| `manifest`           | `string \| URL \| false`                             | `headTags.manifest`                                           | no       | [`Manifest`](./manifest.md)                      |
| `openGraph`          | `OpenGraphProps`                                     | —                                                             | no       | [`OpenGraph`](./open-graph.md)                   |
| `robots`             | `RobotsProps`                                        | `headTags.robots`                                             | no       | [`Robots`](./robots.md)                          |
| `themeColor`         | `string \| { light: string; dark: string } \| false` | `headTags.themeColor`                                         | no       | [`ThemeColor`](./theme-color.md)                 |
| `verification`       | `VerificationProps \| false`                         | `headTags.verification`                                       | no       | [`Verification`](./verification.md)              |

`Head` also accepts a default slot — content rendered between `<title>` and `<Extend>` for one-off tags that do not fit a prop.

## Examples

### Typical page

```astro
---
import { Head } from "eminence-astro-suite/components";
---

<html>
  <Head
    title="Home"
    description="Welcome to Example"
    canonical="https://example.com/"
    openGraph={{
      title: "Home",
      siteName: "Example",
      image: {
        src: "https://example.com/og.png",
        width: 1200,
        height: 630,
        alt: "Banner",
      },
    }}
  />
  <body>...</body>
</html>
```

### Article page with JSON-LD

```astro
---
import { Head } from "eminence-astro-suite/components";
import type { WithContext, BlogPosting } from "schema-dts";

const article: WithContext<BlogPosting> = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Article title",
  datePublished: "2026-06-15",
  author: { "@type": "Person", name: "Author" },
};
---

<Head
  title="Article title"
  description="Article overview"
  openGraph={{
    title: "Article title",
    article: { publishedTime: "2026-06-15T00:00:00Z" },
  }}
  jsonLd={article}
/>
```

### Suppress an inherited integration default for one page

```astro
<Head
  title="Internal only"
  description="..."
  robots={{ noindex: true, nofollow: true }}
  verification={false}
/>
```

## Composition order (fixed)

`<head>` → `Charset` → `Viewport` → `Base` → `Title` → `<slot />` → `Extend` → `AppleItunesApp` → `Canonical` → `ColorScheme` → `Description` → `Generator` → `HumansTxt` → `Icons` → `JsonLd` → `LanguageAlternates` → `Manifest` → `OpenGraph` → `Robots` → `ThemeColor` → `</head>`.

This order is intentional and not configurable. To inject something outside this order, build your own custom shell composing the sub-components directly.

## Rules

- `title` and `description` are always required.
- Direct props override integration `headTags` defaults.
- `false` suppresses the tag even when an integration default exists.
- For sub-components that use the `hasAnyProp` rule (`Base`, `AppleItunesApp`, `Extend`, `Robots`, `ThemeColor`, `Verification`), passing partial props means the integration default is **ignored** entirely — see [../usage/SKILL.md](../usage/SKILL.md#6-integration-fallback-rule-for-object-props-hasanyprop).
- Use [`Layout`](./layout.md) when you also want the `<html>` / `<body>` shell.

## Cross-references

- Document shell: [./layout.md](./layout.md).
- Integration defaults: [../config/SKILL.md](../config/SKILL.md).
- Mandatory usage rules: [../usage/SKILL.md](../usage/SKILL.md).
