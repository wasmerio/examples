# `Charset`

Renders `<meta charset>`.

## Import

```ts
import { Charset } from "eminence-astro-suite/components";
```

## Props

| Prop      | Type     | Default                        | Required | Description                  |
| --------- | -------- | ------------------------------ | -------- | ---------------------------- |
| `charset` | `string` | `headTags.charset` ↦ `"utf-8"` | no       | Document character encoding. |

## Examples

```astro
<Charset />
<!-- <meta charset="utf-8"> -->

<Charset charset="iso-8859-1" />
<!-- <meta charset="iso-8859-1"> -->
```

## Rules

- Always renders a tag — there is no `false` suppression on the component itself.
- To suppress when composed inside [`Head`](./head.md), pass `charset={false}` on `Head`.
- UTF-8 is the modern web default; do not change unless you have a specific encoding requirement.
- Must be one of the first elements of `<head>`. [`Head`](./head.md) renders it first automatically.

## Cross-references

- Suppression via [`Head`](./head.md): pass `charset={false}`.
- Integration default: [`headTags.charset`](../integration/head-tags.md).
