# `LanguageAlternates`

Renders one `<link rel="alternate" hreflang>` tag per entry for localized page variants.

## Import

```ts
import { LanguageAlternates } from "eminence-astro-suite/components";
```

## Props

| Prop        | Type                            | Default | Required | Description                            |
| ----------- | ------------------------------- | ------- | -------- | -------------------------------------- |
| `languages` | `Record<string, string \| URL>` | —       | **yes**  | Map of hreflang code to alternate URL. |

## Examples

```astro
<LanguageAlternates
  languages={{
    "en-US": "https://example.com/en-us",
    es: new URL("https://example.com/es"),
    "x-default": "https://example.com",
  }}
/>
<!--
<link rel="alternate" hreflang="en-US" href="https://example.com/en-us">
<link rel="alternate" hreflang="es" href="https://example.com/es">
<link rel="alternate" hreflang="x-default" href="https://example.com">
-->
```

## Rules

- `languages` is required — there is no integration-level fallback.
- Insertion order is preserved in the output.
- Scoped to hreflang localization. Do **not** use this for other `rel="alternate"` uses (feeds, print stylesheets, etc.). Feed discovery is out of scope — see [../policies/unsupported-tags.md](../policies/unsupported-tags.md).
- Include `"x-default"` to designate the locale-neutral fallback.
- All URLs should be absolute. Astro does not auto-resolve relative hreflang URLs.

## Cross-references

- Composed inside [`Head`](./head.md) via the `languageAlternates` prop.
- Companion: [`Canonical`](./canonical.md) for the canonical URL of the current variant.
