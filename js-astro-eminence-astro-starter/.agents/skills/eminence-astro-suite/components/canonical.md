# `Canonical`

Renders `<link rel="canonical">`.

## Import

```ts
import { Canonical } from "eminence-astro-suite/components";
```

## Props

| Prop   | Type            | Default                                   | Required | Description                 |
| ------ | --------------- | ----------------------------------------- | -------- | --------------------------- |
| `href` | `string \| URL` | `new URL(Astro.url.pathname, Astro.site)` | no       | Canonical URL for the page. |

## Examples

```astro
<Canonical href="https://example.com/docs/page" />
<!-- <link rel="canonical" href="https://example.com/docs/page"> -->

<Canonical href={new URL("https://example.com/docs/page")} />

<Canonical />
<!-- Auto-derives from Astro.site + Astro.url.pathname when set -->
```

## Rules

- Renders nothing when no `href` is provided **and** `Astro.site` is not configured.
- The auto-derivation uses only `Astro.url.pathname` (not search or hash). Pass an explicit `href` if you need a different shape.
- This component does **not** use an integration `headTags` fallback for `href` — it only auto-derives from `Astro.site`.
- To suppress when composed inside [`Head`](./head.md), pass `canonical={false}`.

## Cross-references

- Composed inside [`Head`](./head.md) via the `canonical` prop.
- For multi-language alternates, pair with [`LanguageAlternates`](./language-alternates.md).
