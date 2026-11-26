# `Extend`

Injects additional `<link>`, `<meta>`, and raw HTML fragments for one-off cases that no other component covers.

## Import

```ts
import { Extend } from "eminence-astro-suite/components";
```

## Props

| Prop     | Type                 | Default                  | Required | Description                          |
| -------- | -------------------- | ------------------------ | -------- | ------------------------------------ |
| `link`   | `ExtendLinkTag[]`    | `headTags.extend.link`   | no       | Free-form `<link>` tags.             |
| `meta`   | `ExtendMetaTag[]`    | `headTags.extend.meta`   | no       | Free-form `<meta>` tags.             |
| `custom` | `string \| string[]` | `headTags.extend.custom` | no       | Raw HTML fragments. **Not escaped.** |

### Types

```ts
type ExtendLinkTag = HTMLAttributes<"link"> & { prefetch?: boolean };
type ExtendMetaTag = HTMLAttributes<"meta"> & { property: string };
```

- `link` entries accept every valid `<link>` attribute plus an optional `prefetch?: boolean`.
- `meta` entries accept every valid `<meta>` attribute and **require** `property`.

## Examples

```astro
<Extend
  link={[
    { rel: "preconnect", href: "https://cdn.example.com" },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/inter.woff2",
      type: "font/woff2",
      crossorigin: "",
    },
  ]}
  meta={[{ property: "custom:token", content: "abc123" }]}
/>
```

```astro
<Extend
  custom={[
    '<meta name="custom-a" content="1">',
    '<script type="application/json">{"key":"value"}</script>',
  ]}
/>
```

## Rules

- `custom` content is injected verbatim via Astro `set:html`. **Never** pass user-controlled strings — only trusted or pre-sanitized HTML.
- Uses the all-or-nothing fallback (`hasAnyProp`): passing any prop (even just `link`) disables the integration default entirely — see [../usage/SKILL.md](../usage/SKILL.md#6-integration-fallback-rule-for-object-props-hasanyprop).
- Prefer typed components (`Head` props, [`OpenGraph`](./open-graph.md), [`Verification`](./verification.md), etc.) over `Extend` when one fits.
- If your tag belongs in the [policies/unsupported-tags](../policies/unsupported-tags.md) list, do not work around it with `Extend`.

## Cross-references

- Composed inside [`Head`](./head.md) via the `extend` prop.
- Integration default: [`headTags.extend`](../integration/head-tags.md).
