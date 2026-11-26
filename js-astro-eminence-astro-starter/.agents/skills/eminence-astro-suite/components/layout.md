# `Layout`

Renders the full document shell — `<!doctype html>`, `<html>`, `<head>` (via [`Head`](./head.md)), and `<body>` — with three named slots.

```astro
---
import { Layout } from "eminence-astro-suite/components";
---

<Layout title="Home" description="Welcome to Example">
  <main>Welcome</main>
</Layout>
```

## Import

```ts
import { Layout } from "eminence-astro-suite/components";
```

## Props

`Layout` accepts all [`Head`](./head.md) props with the same defaults and rules. `title` and `description` are required.

## Slots

| Slot         | Position                                                                                   | Use for                                                       |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `head`       | Inside `<head>`, between `<title>` and built-in tags (forwarded to `Head`'s default slot). | Tags not covered by any `Head` prop.                          |
| `body-start` | First child of `<body>`.                                                                   | Skip links, region landmarks, banners that must render first. |
| (default)    | Main `<body>` content.                                                                     | Page content.                                                 |
| `body-end`   | Last child of `<body>`.                                                                    | Analytics, late-loaded scripts, modal portals.                |

## Example

```astro
---
import { Layout } from "eminence-astro-suite/components";
---

<Layout title="Home" description="Welcome to Example">
  <link slot="head" rel="preconnect" href="https://cdn.example.com" />
  <a slot="body-start" href="#main" class="sr-only">Skip to content</a>

  <main id="main">Welcome</main>

  <script slot="body-end" src="/analytics.js" defer></script>
</Layout>
```

## Output (no slots, defaults only)

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Home</title>
    <meta name="description" content="Welcome to Example" />
    <meta name="generator" content="Astro v..." />
  </head>
  <body>
    <main>Welcome</main>
  </body>
</html>
```

## Rules

- Use `Layout` when you want a full document. Use [`Head`](./head.md) directly when you control `<html>` / `<body>` yourself (e.g. shared site layout components).
- The default slot is the body content; do not nest a `<body>` inside it.
- Slot ordering inside `<body>` is fixed: `body-start` → default → `body-end`.

## Cross-references

- All head props live on [`Head`](./head.md).
- Usage rules: [../usage/SKILL.md](../usage/SKILL.md).
