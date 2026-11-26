# `Description`

Renders `<meta name="description">`.

## Import

```ts
import { Description } from "eminence-astro-suite/components";
```

## Props

| Prop      | Type     | Default | Required | Description                                                                   |
| --------- | -------- | ------- | -------- | ----------------------------------------------------------------------------- |
| `content` | `string` | —       | **yes**  | Page meta description. Aim for a concise summary (roughly 50–160 characters). |

## Examples

```astro
<Description
  content="Learn how to build efficient web applications with Astro."
/>
```

## Rules

- `content` is always required. There is **no** integration-level fallback for description — it must be authored per page.
- The component does no length validation. Keep descriptions concise yourself.
- Always pair with [`Title`](./title.md). Most pages should use [`Head`](./head.md), which requires both as props.

## Cross-references

- Composed inside [`Head`](./head.md) as the required `description` prop.
- Authoring guidance: [../usage/SKILL.md](../usage/SKILL.md).
