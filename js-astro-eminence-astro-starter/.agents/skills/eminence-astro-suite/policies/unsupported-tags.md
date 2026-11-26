# Unsupported tags

The integration intentionally does not emit the tags listed below — no component exists for them, and you should not add them via [`Extend`](../components/extend.md) either. Use the modern alternative.

## Apple "standalone mode" web app tags

- `meta name="apple-mobile-web-app-title"`
- `meta name="apple-touch-startup-image"`
- `meta name="apple-mobile-web-app-capable"`
- `meta name="apple-mobile-web-app-status-bar-style"`

**Reason:** legacy Apple-specific surface, superseded by the Web App Manifest. [`AppleItunesApp`](../components/apple-itunes-app.md) is intentionally narrow (Smart App Banner only).

**Use instead:** [`manifest`](../integration/manifest.md) and [`icons`](../integration/icons.md).

## `meta name="application-name"`

**Reason:** superseded by `name` / `short_name` in the manifest.

**Use instead:** [`manifest`](../integration/manifest.md).

## `meta name="author"`

**Reason:** not used as a ranking signal by major search engines. Hidden metadata is a weaker signal than visible bylines and structured data.

**Use instead:**

- visible bylines and linked author profile pages,
- Schema.org JSON-LD (`Article`, `BlogPosting`, `Person`, etc.) via [`JsonLd`](../components/json-ld.md),
- Open Graph `article.authors` via [`OpenGraph`](../components/open-graph.md).

## `meta name="creator"`

**Reason:** administrative; no meaningful browser, SEO, or social impact.

**Use instead:** visible attribution and Schema.org JSON-LD (`Organization`, `Person`, `CreativeWork`).

## Feed discovery alternates

- `<link rel="alternate" type="application/rss+xml">`
- `<link rel="alternate" type="application/atom+xml">`

**Reason:** [`LanguageAlternates`](../components/language-alternates.md) is scoped strictly to `hreflang` localization to keep its responsibility narrow.

**Use instead:** emit feed alternates manually with [`Extend`](../components/extend.md), or use dedicated feed-generation tooling.

## `<link rel="archives">`, `<link rel="bookmarks">`, `<link rel="assets">`

**Reason:** no meaningful modern browser or crawler behavior. `rel="assets"` is non-standard.

**Use instead:**

- `nav` landmarks for navigation,
- `rel="preload"` / `rel="prefetch"` for asset hints,
- sitemap for archive discoverability.

## Facebook admin metadata

- `meta property="fb:app_id"`
- `meta property="fb:admins"`

**Reason:** proprietary platform metadata outside the standards-first scope.

**Use instead:** standards-based metadata via [`OpenGraph`](../components/open-graph.md) and Schema.org JSON-LD.

## `meta name="pinterest-rich-pin" content="false"`

**Reason:** niche Pinterest-specific opt-out. Most sites benefit from Rich Pins.

**Use instead:** add manually via [`Extend`](../components/extend.md) only for the specific project that needs it.

## App Links metadata

- `meta property="al:ios:url"`, `al:ios:app_store_id`
- `meta property="al:android:url"`, `al:android:package`
- `meta property="al:web:url"`, `al:web:should_fallback`

**Reason:** legacy deep-linking convention. Modern platforms use verified domain association (Universal Links, Android App Links) instead.

**Use instead:**

- iOS: `apple-app-site-association`,
- Android: `assetlinks.json`,
- standard web fallback routing in your app/site logic.

## Twitter / X namespace (`twitter:*`)

**Reason:** modern Twitter/X reads `og:` tags. Maintaining a parallel namespace duplicates metadata and risks drift.

**Use instead:** [`OpenGraph`](../components/open-graph.md). For card-type-specific overrides (e.g. `summary_large_image`), add them manually via [`Extend`](../components/extend.md).

## Cross-references

- Unsupported files companion: [./unsupported-files.md](./unsupported-files.md).
- When you need a one-off tag the suite doesn't cover: [`Extend`](../components/extend.md).
