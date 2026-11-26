# `Icons`

Renders the resolved icon `<link>` tags. The build-time set comes from the [`icons`](../integration/icons.md) integration feature; runtime overrides can replace or remove individual entries.

## Import

```ts
import { Icons } from "eminence-astro-suite/components";
```

## Props

| Prop    | Type                               | Default | Required | Description                                                                                         |
| ------- | ---------------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------- |
| `icons` | `Record<string, IconTag \| false>` | `{}`    | no       | Per-`href` overrides. An `IconTag` replaces or adds; `false` removes the matching build-time entry. |

### `IconTag`

| Field   | Type                          | Required | Description                                                                                      |
| ------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `rel`   | `string`                      | yes      | `<link rel>` value.                                                                              |
| `href`  | `string`                      | —        | Always derived from the map key — values you pass are overwritten.                               |
| `sizes` | `string`                      | no       | e.g. `"192x192"`, `"any"`.                                                                       |
| `type`  | `string`                      | no       | MIME type.                                                                                       |
| `media` | `"light" \| "dark" \| string` | no       | `"light"`/`"dark"` are sugar for `(prefers-color-scheme: ...)`; other values are passed through. |

## Examples

```astro
<Icons />
<!-- Renders the build-resolved icon tags from the virtual module -->
```

```astro
<Icons
  icons={{
    "/favicon.ico": false, // remove this build-time tag
    "/custom.png": {
      // add or replace this href
      rel: "icon",
      sizes: "32x32",
      type: "image/png",
    },
  }}
/>
```

## Default build-time set (when `icons.source` is configured)

| href                    | rel                | sizes     | type            | Notes                           |
| ----------------------- | ------------------ | --------- | --------------- | ------------------------------- |
| `/favicon.ico`          | `icon`             | `any`     | (inferred)      |                                 |
| `/favicon.png`          | `icon`             | `32x32`   | `image/png`     |                                 |
| `/apple-touch-icon.png` | `apple-touch-icon` | `180x180` | (omitted)       |                                 |
| `/icon-192.png`         | `icon`             | `192x192` | `image/png`     | also in manifest                |
| `/icon.png`             | `icon`             | `512x512` | `image/png`     | also in manifest                |
| `/favicon.svg`          | `icon`             | `any`     | `image/svg+xml` | auto-added when `source` is SVG |

Override any of these via the [`icons`](../integration/icons.md) integration option.

## Resolution order

1. Build-generated `IconTag[]` (from `icons` option).
2. `headTags.icons` merged over the above by `href`.
3. `<Icons icons={...} />` runtime overrides merged over the above; `false` removes by `href`.

## Rules

- Map keys are matched literally against the rendered `href`. To remove `/icon.png`, the key must be exactly `/icon.png`.
- The `href` field inside an `IconTag` value is **ignored** — the key always wins. Match the key to the href you want.
- To suppress all icon tags when composed inside [`Head`](./head.md), pass `icons={false}`.
- Render order follows insertion order in the resolved map.

## Cross-references

- Generation feature: [../integration/icons.md](../integration/icons.md).
- Composed inside [`Head`](./head.md) via the `icons` prop.
- Integration default: [`headTags.icons`](../integration/head-tags.md).
