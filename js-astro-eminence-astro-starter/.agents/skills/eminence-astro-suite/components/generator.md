# `Generator`

Renders `<meta name="generator">` using Astro's built-in `Astro.generator` value (e.g. `Astro v6.1.1`).

## Import

```ts
import { Generator } from "eminence-astro-suite/components";
```

## Props

| Prop       | Type      | Default                       | Required | Description              |
| ---------- | --------- | ----------------------------- | -------- | ------------------------ |
| `generate` | `boolean` | `headTags.generator` ↦ `true` | no       | Whether to emit the tag. |

## Examples

```astro
<Generator />
<!-- <meta name="generator" content="Astro vX.Y.Z"> -->

<Generator generate={false} />
<!-- (no tag rendered) -->
```

## Rules

- Default is `true` — keep enabled to credit Astro unless you have a specific reason to omit.
- The value is always `Astro.generator`. You cannot customize the string.
- To suppress when composed inside [`Head`](./head.md), pass `generator={false}`.
- To disable site-wide, set `headTags.generator: false` in the integration options.

## Cross-references

- Composed inside [`Head`](./head.md) via the `generator` prop.
- Integration default: [`headTags.generator`](../integration/head-tags.md).
