# `Viewport`

Renders `<meta name="viewport">`.

## Import

```ts
import { Viewport } from "eminence-astro-suite/components";
```

## Props

| Prop      | Type     | Default                                                       | Required | Description            |
| --------- | -------- | ------------------------------------------------------------- | -------- | ---------------------- |
| `content` | `string` | `headTags.viewport` ↦ `"width=device-width, initial-scale=1"` | no       | Viewport meta content. |

## Examples

```astro
<Viewport />
<!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->

<Viewport content="width=device-width, initial-scale=1, maximum-scale=5" />
```

## Rules

- Always renders a tag — there is no `false` suppression on the component itself.
- To suppress when composed inside [`Head`](./head.md), pass `viewport={false}` on `Head` (rarely correct — missing viewport causes mobile browsers to render at desktop width).
- The default is the responsive baseline. Override only when you have a specific need (e.g. allow user zoom beyond 1×, or disable user scaling — note WCAG considerations).

## Cross-references

- Suppression via [`Head`](./head.md): pass `viewport={false}`.
- Integration default: [`headTags.viewport`](../integration/head-tags.md).
