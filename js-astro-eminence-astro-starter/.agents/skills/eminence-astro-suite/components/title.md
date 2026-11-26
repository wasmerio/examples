# `Title`

Renders the `<title>` tag with optional template substitution.

## Import

```ts
import { Title } from "eminence-astro-suite/components";
```

## Props

| Prop       | Type                         | Default                           | Required | Description                                           |
| ---------- | ---------------------------- | --------------------------------- | -------- | ----------------------------------------------------- |
| `value`    | `string`                     | —                                 | **yes**  | Page-specific title text substituted into `template`. |
| `template` | `` `${string}%s${string}` `` | `headTags.titleTemplate` ↦ `"%s"` | no       | Template containing exactly one `%s` placeholder.     |

## Examples

```astro
<Title value="Home" />
<!-- <title>Home</title> -->

<Title value="Home" template="%s | Example" />
<!-- <title>Home | Example</title> -->

<Title value="Pricing" template="Example — %s" />
<!-- <title>Example — Pricing</title> -->
```

## Rules

- `value` is always required. There is no integration-level fallback.
- `template` is a template literal type — TypeScript will reject any template that does not contain `%s`.
- Only the first `%s` is substituted (it appears exactly once by type).
- Prefer passing `titleTemplate` once on `<Head>` (or in `headTags.titleTemplate`) rather than on every `<Title>`.

## Cross-references

- Composed inside [`Head`](./head.md) as the required `title` prop.
- Site-wide template via [`headTags.titleTemplate`](../integration/head-tags.md).
