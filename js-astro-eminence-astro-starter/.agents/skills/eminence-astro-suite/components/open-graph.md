# `OpenGraph`

Renders complete Open Graph metadata. Type-safe, namespace-aware, with discriminated unions enforcing one canonical `og:type` per page.

## Import

```ts
import {
  OpenGraph,
  type OpenGraphProps,
} from "eminence-astro-suite/components";
```

## Top-level props

| Prop              | Type                      | Default                                 | Required | Description                                                        |
| ----------------- | ------------------------- | --------------------------------------- | -------- | ------------------------------------------------------------------ |
| `title`           | `string`                  | —                                       | **yes**  | `og:title`.                                                        |
| `type`            | `string \| false`         | inferred (see below)                    | no       | Override the inferred type, or `false` to omit `og:type` entirely. |
| `url`             | `string \| URL`           | derived from `Astro.url` + `Astro.site` | no       | `og:url`.                                                          |
| `description`     | `string`                  | —                                       | no       | `og:description`.                                                  |
| `siteName`        | `string`                  | `headTags.openGraphSiteName`            | no       | `og:site_name`.                                                    |
| `locale`          | `string`                  | —                                       | no       | `og:locale` (e.g. `"en_US"`).                                      |
| `localeAlternate` | `string[]`                | `[]`                                    | no       | One `og:locale:alternate` per entry.                               |
| `image`           | `OpenGraphImageProps`     | —                                       | no       | Image metadata.                                                    |
| `audio`           | `OpenGraphAudioProps`     | —                                       | no       | Audio metadata.                                                    |
| `video`           | `OpenGraphVideoProps`     | —                                       | no       | Video metadata.                                                    |
| `article`         | `OpenGraphArticleProps`   | —                                       | no       | Article metadata (type-driving).                                   |
| `book`            | `OpenGraphBookProps`      | —                                       | no       | Book metadata (type-driving).                                      |
| `profile`         | `OpenGraphProfileProps`   | —                                       | no       | Profile metadata (type-driving).                                   |
| `music`           | `OpenGraphMusicProps`     | —                                       | no       | Music metadata (type-driving).                                     |
| `videoType`       | `OpenGraphVideoTypeProps` | —                                       | no       | Video sub-type metadata (type-driving).                            |
| `business`        | `OpenGraphBusinessProps`  | —                                       | no       | Business namespace tags (does not change `og:type`).               |
| `place`           | `OpenGraphPlaceProps`     | —                                       | no       | Place namespace tags (does not change `og:type`).                  |
| `product`         | `OpenGraphProductProps`   | —                                       | no       | Product namespace tags (does not change `og:type`).                |

## `og:type` inference

The component picks the first match in this order:

1. Explicit `type` prop (any string, or `false` to omit).
2. `article` → `"article"`
3. `book` → `"book"`
4. `profile` → `"profile"`
5. `music` → `"music.<music.subtype>"`
6. `videoType` → `"video.<videoType.subtype>"`
7. Fallback → `"website"`

`business`, `place`, and `product` emit namespace-specific tags only; they keep `og:type` as `"website"` (or whatever a type-driver above set).

## Type-driving variants are mutually exclusive

`article`, `book`, `business`, `music`, `place`, `product`, `profile`, and `videoType` are a TypeScript discriminated union — you can pass at most **one** of them per render. Mixing them is a type error.

## `url` derivation

When `url` is omitted, the component computes `new URL(Astro.url.pathname + Astro.url.search + Astro.url.hash, Astro.site)` and uses that as the absolute URL. Returns nothing if `Astro.site` is not configured.

## Media sub-shapes

```ts
type OpenGraphImageProps = {
  src: string;
  secureUrl?: string;
  type?: string; // inferred from src extension when omitted
  width?: number;
  height?: number;
  alt?: string;
};

type OpenGraphAudioProps = {
  src: string;
  secureUrl?: string;
  type?: string; // inferred from src extension when omitted
};

type OpenGraphVideoProps = {
  src: string;
  secureUrl?: string;
  type?: string; // inferred from src extension when omitted
  width?: number;
  height?: number;
};
```

## Type-driving sub-shapes

### `OpenGraphArticleProps`

| Field            | Type       | Notes                               |
| ---------------- | ---------- | ----------------------------------- |
| `publishedTime`  | `string`   | ISO 8601.                           |
| `modifiedTime`   | `string`   | ISO 8601.                           |
| `expirationTime` | `string`   | ISO 8601.                           |
| `authors`        | `string[]` | Each emits an `article:author` tag. |
| `section`        | `string`   | Top-level section.                  |
| `tags`           | `string[]` | Each emits an `article:tag` tag.    |

### `OpenGraphBookProps`

| Field         | Type       | Notes                        |
| ------------- | ---------- | ---------------------------- |
| `authors`     | `string[]` | One `book:author` per entry. |
| `isbn`        | `string`   |                              |
| `releaseDate` | `string`   | ISO 8601.                    |
| `tags`        | `string[]` | One `book:tag` per entry.    |

### `OpenGraphProfileProps`

| Field       | Type     | Notes |
| ----------- | -------- | ----- |
| `firstName` | `string` |       |
| `lastName`  | `string` |       |
| `username`  | `string` |       |
| `gender`    | `string` |       |

### `OpenGraphMusicProps`

Drives `og:type` as `music.<subtype>`.

| Field                          | Type                                                 | Notes                                  |
| ------------------------------ | ---------------------------------------------------- | -------------------------------------- |
| `subtype`                      | `"song" \| "album" \| "playlist" \| "radio_station"` | Required — determines `og:type` value. |
| (plus subtype-specific fields) | —                                                    | See upstream Open Graph spec.          |

### `OpenGraphVideoTypeProps`

Drives `og:type` as `video.<subtype>`.

| Field                          | Type                                           | Notes                         |
| ------------------------------ | ---------------------------------------------- | ----------------------------- |
| `subtype`                      | `"movie" \| "episode" \| "tv_show" \| "other"` | Required.                     |
| (plus subtype-specific fields) | —                                              | See upstream Open Graph spec. |

## Namespace-only sub-shapes

These do **not** change `og:type`.

### `OpenGraphBusinessProps`, `OpenGraphPlaceProps`, `OpenGraphProductProps`

Each emits namespace-prefixed tags (`business:`, `place:`, `product:`). Shape mirrors the Open Graph spec; consult the underlying `.astro` files in `package/components/openGraph/` for the exact prop list, or use TypeScript autocomplete.

## Examples

### Website (default)

```astro
<OpenGraph
  title="Home"
  siteName="Example"
  image={{
    src: "https://example.com/og.png",
    width: 1200,
    height: 630,
    alt: "Banner",
  }}
/>
<!--
<meta property="og:type" content="website">
<meta property="og:title" content="Home">
<meta property="og:url" content="https://example.com/">
<meta property="og:site_name" content="Example">
<meta property="og:image" content="https://example.com/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Banner">
-->
```

### Article (type-driven)

```astro
<OpenGraph
  title="My Article"
  description="Article overview"
  url="https://example.com/posts/1"
  article={{
    publishedTime: "2026-01-01T00:00:00Z",
    authors: ["https://example.com/author"],
    section: "Tech",
    tags: ["astro", "seo"],
  }}
/>
<!--
<meta property="og:type" content="article">
<meta property="og:title" content="My Article">
<meta property="og:description" content="Article overview">
<meta property="og:url" content="https://example.com/posts/1">
<meta property="article:published_time" content="2026-01-01T00:00:00Z">
<meta property="article:author" content="https://example.com/author">
<meta property="article:section" content="Tech">
<meta property="article:tag" content="astro">
<meta property="article:tag" content="seo">
-->
```

### Music album

```astro
<OpenGraph
  title="The Album"
  music={{ subtype: "album", musician: ["https://example.com/artist"] }}
/>
<!-- og:type = music.album -->
```

### Multiple locales

```astro
<OpenGraph title="Inicio" locale="es_ES" localeAlternate={["en_US", "fr_FR"]} />
```

## Rules

- One type-driving variant at a time. TypeScript will reject combinations.
- `type={false}` omits `og:type` entirely (rarely correct — most consumers expect at least `website`).
- For `siteName`, prefer setting `headTags.openGraphSiteName` once at the integration level rather than per page.
- Open Graph is the canonical social-preview surface in this suite — there is no separate `twitter:` namespace. Modern Twitter/X reads `og:` tags. See [../policies/unsupported-tags.md](../policies/unsupported-tags.md).

## Cross-references

- Composed inside [`Head`](./head.md) via the `openGraph` prop.
- Integration default for `siteName`: [`headTags.openGraphSiteName`](../integration/head-tags.md).
- Sub-component source for namespace prop shapes: `package/components/openGraph/*.astro`.
