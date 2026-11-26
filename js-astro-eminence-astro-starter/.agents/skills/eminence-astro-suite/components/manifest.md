# `Manifest`

Renders `<link rel="manifest">`.

## Import

```ts
import { Manifest } from "eminence-astro-suite/components";
```

## Props

| Prop   | Type            | Default                        | Required | Description            |
| ------ | --------------- | ------------------------------ | -------- | ---------------------- |
| `href` | `string \| URL` | `headTags.manifest` (resolved) | no       | Absolute manifest URL. |

## Examples

```astro
<Manifest href="https://example.com/manifest.webmanifest" />
<!-- <link rel="manifest" href="https://example.com/manifest.webmanifest"> -->

<Manifest />
<!-- Uses headTags.manifest (or derived from Astro.site when the manifest feature is enabled); otherwise renders nothing -->
```

## Rules

- Renders nothing when no `href` is available.
- The component does **not** generate the manifest file — it only emits the discovery link. Use the [`manifest`](../integration/manifest.md) integration option to generate `dist/manifest.webmanifest`.
- To suppress when composed inside [`Head`](./head.md), pass `manifest={false}`.

## Cross-references

- File generation: [../integration/manifest.md](../integration/manifest.md).
- Composed inside [`Head`](./head.md) via the `manifest` prop.
- Integration default and derivation rules: [../integration/head-tags.md](../integration/head-tags.md).
