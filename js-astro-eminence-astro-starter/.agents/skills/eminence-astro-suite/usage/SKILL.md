---
name: eminence-usage
description: MANDATORY usage rules for `eminence-astro-suite` components and integration.
disable-model-invocation: true
---

# Eminence Astro Suite usage rules

## 1. Integration first, components second

- The integration distributes defaults via the Vite virtual module `virtual:eminence-astro-suite/head-tags`.
- Configure site-wide values (title template, OG site name, theme color, verification tokens, robots defaults) in `headTags` so individual pages stay minimal.
- See [../config/SKILL.md](../config/SKILL.md) for the full options surface.

## 2. `Head` is usually enough

- For 95% of pages, the only component you need is [`Head`](../components/head.md).
- `Head` composes all other tag components in the correct order.
- Drop down to individual sub-components only when:
  - you are passing custom markup inside `Head`'s default slot, or
  - you are building a custom shell that does not use `Head`.
- For a full document shell (`<html>` + `<body>` + slots), use [`Layout`](../components/layout.md), which wraps `Head`.

## 3. Import paths

| What                             | Where to import from                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| The integration (default export) | `eminence-astro-suite` (use only in `astro.config.mjs`)                                   |
| Any component                    | `eminence-astro-suite/components`                                                         |
| Component prop types             | `eminence-astro-suite/components` (named exports like `HeadProps`, `OpenGraphProps`, ...) |

Never import components from `eminence-astro-suite` root and never import the integration from `eminence-astro-suite/components`.

## 4. Required vs optional props

- `Head` and `Layout` always require `title` and `description`. There is no integration-level fallback for these — they are intentionally per-page.
- Every other prop is optional and falls back to integration defaults where applicable. See each component doc for the exact fallback chain.

## 5. The `... | false` suppression pattern

Many props accept `... | false`:

- `false` **suppresses** the corresponding tag, even when the integration provides a default.
- Omitting the prop **uses** the integration default (or built-in default).
- Passing a value **overrides** the integration default for this page.

Example:

```astro
<!-- Use integration default viewport -->
<Head title="Home" description="..." />

<!-- Override viewport for this page -->
<Head
  title="Home"
  description="..."
  viewport="width=device-width, initial-scale=1, maximum-scale=5"
/>

<!-- Suppress the viewport tag entirely (rarely correct) -->
<Head title="Home" description="..." viewport={false} />
```

## 6. Integration fallback rule for object props (`hasAnyProp`)

Components whose props are objects (`Base`, `AppleItunesApp`, `Extend`, `Robots`, `ThemeColor`, `Verification`) use an all-or-nothing fallback:

- If you pass **any** prop on that component (even a single one), the integration default for that component is **ignored entirely** — no merging.
- To use the integration default, pass no props.
- To opt out completely on a single page where `Head` is involved, pass `false` (where the prop accepts `false`).

This means you cannot pass `verification={{ bing: "..." }}` on a single page and expect the integration's `google` token to also render. Either configure both tokens at the integration level, or pass both tokens on the page.

## 7. `Astro.site` derivation

Several components derive absolute URLs from `Astro.site` when their `href` / `url` prop is omitted:

- [`Canonical`](../components/canonical.md) → `new URL(Astro.url.pathname, Astro.site)`
- [`HumansTxt`](../components/humans-txt.md) → `Astro.site + "/humans.txt"` (via integration config)
- [`Manifest`](../components/manifest.md) → `Astro.site + "/manifest.webmanifest"` (via integration config when `manifest` is enabled)
- [`OpenGraph`](../components/open-graph.md) → `new URL(Astro.url.pathname + search + hash, Astro.site)`

Set `site` in `astro.config.mjs` whenever the project has a public URL.

## 8. Required vs optional output files

- The integration generates `manifest.webmanifest`, favicons, `robots.txt`, `security.txt`, and `sitemap.xml` (via `@astrojs/sitemap`).
- It does **not** generate `humans.txt` — you author that file in `public/`. The integration only adds the discovery link tag and emits a build-time recommendation if the file is missing.
- See per-feature pages in [../integration/](../integration/) for the full behavior.

## 9. Title template literal type

`titleTemplate` has the literal type `` `${string}%s${string}` ``. The `%s` placeholder is mandatory. TypeScript will reject templates that omit it.

## 10. Component composition order in `Head`

Order is fixed and intentional:

`charset` → `viewport` → `base` → `<title>` → component slot → `Extend` → `appleItunesApp` → `canonical` → `colorScheme` → `<meta description>` → `generator` → `humansTxt` → `icons` → `jsonLd` → `languageAlternates` → `manifest` → `openGraph` → `robots` → `themeColor`.

Do not try to reorder by composing sub-components manually unless you have a specific reason.

## 11. JSON-LD safety

[`JsonLd`](../components/json-ld.md) accepts either a serialized string or a plain object and escapes `<`, `>`, `&` as `\u003c`, `\u003e`, `\u0026` to prevent HTML injection. Prefer passing an object (or a `schema-dts` typed value) — never hand-construct a string that mixes user data with raw HTML.

See [../guides/json-ld-with-schema-dts.md](../guides/json-ld-with-schema-dts.md) for the type-safe pattern.

## 12. Do not add unsupported surfaces

Before reaching for any of the following, read [../policies/unsupported-tags.md](../policies/unsupported-tags.md) and [../policies/unsupported-files.md](../policies/unsupported-files.md):

- `apple-mobile-web-app-*` meta tags → use the manifest instead.
- `meta name="author"` → use visible bylines and JSON-LD `author`.
- `meta name="application-name"` → use manifest `name` / `short_name`.
- `browserconfig.xml` → use the manifest plus the generated icon set.
- Feed discovery `<link rel="alternate" type="application/rss+xml">` → out of scope; add manually.
- A separate `twitter:` namespace → not generated; modern Twitter/X reads Open Graph.

## 13. Do not hand-write `<head>` when `Head` covers it

If the markup you would write maps onto a `Head` prop, use the prop. Hand-written tags inside the slot bypass the integration's defaults and ordering.

## 14. Trust the type errors

`OpenGraph` type-driving variants, `Robots` content-vs-directives variants, `AppleItunesApp` content-vs-id variants, `ThemeColor` single-vs-pair variants, and `WebManifestOptions` `prefer_related_applications: true` are all enforced as TypeScript discriminated unions or `never` constraints. If TypeScript complains, the suite is telling you the combination is invalid — do not paper over with `as any`.
