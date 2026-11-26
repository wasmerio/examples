# `Verification`

Renders site-ownership verification meta tags for search engines.

## Import

```ts
import { Verification } from "eminence-astro-suite/components";
```

## Props

| Prop     | Type                                  | Default                        | Required | Description                                                             |
| -------- | ------------------------------------- | ------------------------------ | -------- | ----------------------------------------------------------------------- |
| `google` | `string`                              | `headTags.verification.google` | no       | Google Search Console token → `<meta name="google-site-verification">`. |
| `yandex` | `string`                              | `headTags.verification.yandex` | no       | Yandex Webmaster token → `<meta name="yandex-verification">`.           |
| `bing`   | `string`                              | `headTags.verification.bing`   | no       | Bing/Yahoo Webmaster token → `<meta name="msvalidate.01">`.             |
| `others` | `{ name: string; content: string }[]` | `headTags.verification.others` | no       | Custom provider entries; one `<meta>` tag per entry.                    |

## Examples

```astro
<Verification
  google="abc123"
  yandex="xyz789"
  bing="def456"
  others={[{ name: "p:domain_verify", content: "pinterest-token" }]}
/>
<!--
<meta name="google-site-verification" content="abc123">
<meta name="yandex-verification" content="xyz789">
<meta name="msvalidate.01" content="def456">
<meta name="p:domain_verify" content="pinterest-token">
-->

<Verification />
<!-- Uses headTags.verification if configured; otherwise renders nothing -->
```

## Rules

- Uses the all-or-nothing fallback (`hasAnyProp`): passing any prop disables the integration default entirely — see [../usage/SKILL.md](../usage/SKILL.md#6-integration-fallback-rule-for-object-props-hasanyprop). To keep `google` while adding `yandex`, pass both, or configure both at the integration level.
- To suppress when composed inside [`Head`](./head.md), pass `verification={false}`.
- Each verification provider expects a specific tag name format — do not invent custom mappings. For other providers, use `others`.

## Cross-references

- Composed inside [`Head`](./head.md) via the `verification` prop.
- Integration default: [`headTags.verification`](../integration/head-tags.md).
