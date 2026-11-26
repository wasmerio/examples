# `JsonLd`

Renders `<script type="application/ld+json">` with HTML-safe escaping.

## Import

```ts
import { JsonLd } from "eminence-astro-suite/components";
```

## Props

| Prop     | Type                                | Default | Required | Description                                                                                 |
| -------- | ----------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------- |
| `jsonLd` | `Record<string, unknown> \| string` | —       | **yes**  | JSON-LD payload — either a plain object (serialized internally) or a pre-serialized string. |

## Examples

```astro
<JsonLd
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Example",
    url: "https://example.com",
  }}
/>
```

```astro
<JsonLd
  jsonLd='{"@context":"https://schema.org","@type":"WebPage","name":"Home"}'
/>
```

### Multiple entities — use `@graph`

```astro
<JsonLd
  jsonLd={{
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "Acme" },
      { "@type": "WebSite", name: "Acme", url: "https://acme.example" },
    ],
  }}
/>
```

## Output safety

The component escapes `<`, `>`, and `&` as `\u003c`, `\u003e`, `\u0026` so the JSON payload cannot terminate the surrounding `<script>` block or inject HTML.

## Rules

- `jsonLd` is required.
- Always renders a **single** `<script>` tag. To emit multiple entities, wrap them with `@graph`.
- Prefer plain objects over strings — you get serialization and escaping for free, and TypeScript can type-check the shape (especially with `schema-dts`).
- Never assemble JSON-LD by string concatenation with user data; pass it as an object instead.

## Cross-references

- Composed inside [`Head`](./head.md) via the `jsonLd` prop.
- Type-safe authoring with `schema-dts`: [../guides/json-ld-with-schema-dts.md](../guides/json-ld-with-schema-dts.md).
