# `HumansTxt`

Renders `<link rel="author" type="text/plain">` pointing at `humans.txt`.

## Import

```ts
import { HumansTxt } from "eminence-astro-suite/components";
```

## Props

| Prop   | Type            | Default                         | Required | Description              |
| ------ | --------------- | ------------------------------- | -------- | ------------------------ |
| `href` | `string \| URL` | `headTags.humansTxt` (resolved) | no       | Absolute humans.txt URL. |

## Examples

```astro
<HumansTxt href="https://example.com/humans.txt" />
<!-- <link rel="author" type="text/plain" href="https://example.com/humans.txt"> -->

<HumansTxt />
<!-- Uses the resolved headTags.humansTxt URL; otherwise renders nothing -->
```

## Rules

- Renders nothing when no `href` is available.
- The component does **not** generate the file — author `public/humans.txt` yourself. See [../integration/humans-txt.md](../integration/humans-txt.md) for the integration-level validation behavior.
- To suppress when composed inside [`Head`](./head.md), pass `humansTxt={false}`.
- Resolution chain when omitted: explicit prop → `headTags.humansTxt` value → derived from `Astro.site` when `headTags.humansTxt: true`.

## Cross-references

- Integration behavior (validation, three-state config): [../integration/humans-txt.md](../integration/humans-txt.md).
- Composed inside [`Head`](./head.md) via the `humansTxt` prop.
- Why add a humans.txt at all: [../recommendations/humans-txt.md](../recommendations/humans-txt.md).
