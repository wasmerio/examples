# `humansTxt` — Validation and link tag (no generation)

Eminence does **not** generate `humans.txt`. You author the file yourself in `public/humans.txt`. The integration:

1. Validates whether the file exists in the build output.
2. Optionally emits `<link rel="author" type="text/plain" href="/humans.txt">` in `<head>` via the [`HumansTxt`](../components/humans-txt.md) component.

The behavior is controlled by `headTags.humansTxt`, which has **three** states.

## Three-state behavior

| `headTags.humansTxt` value | Link tag emitted?                                    | Build-time validation?                     |
| -------------------------- | ---------------------------------------------------- | ------------------------------------------ |
| `undefined` (omitted)      | yes if href is set elsewhere                         | yes — warns if `public/humans.txt` missing |
| `true`                     | yes — href derived from `Astro.site + "/humans.txt"` | no — assumes you authored it               |
| `string \| URL`            | yes — href = value                                   | no                                         |
| `false`                    | no                                                   | no — silences all related warnings         |

### Recommended setup

1. Create `public/humans.txt` with your credits.
2. Set `headTags.humansTxt: true` (or pass a custom URL) so the link tag points at it.

```ts title="astro.config.mjs"
eminence({
  headTags: {
    humansTxt: true,
  },
});
```

```txt title="public/humans.txt"
/* TEAM */
  Maintainer: Your Name
  Site: https://example.com

/* SITE */
  Last update: 2026/06/15
  Standards: HTML5, CSS3
```

### Suppress all warnings

If you intentionally do not want a humans.txt:

```ts
eminence({ headTags: { humansTxt: false } });
```

### Validation behavior (when `humansTxt` is `undefined`)

After the build, the integration checks `dist/humans.txt`:

- If **missing**: logs a recommendation pointing at [../recommendations/humans-txt.md](../recommendations/humans-txt.md).
- If **present**: logs a follow-up recommendation to explicitly set `humansTxt: true` (to emit the discovery link) or `humansTxt: false` (to silence).

## Rules

- The file lives in `public/humans.txt` so Astro copies it to `dist/humans.txt` verbatim.
- Eminence never writes to this file. If a generator-style API is what you want, use `manifest` or `robotsTxt` instead — those features have file-generation responsibilities.
- The link tag uses `rel="author"` with `type="text/plain"`, which is the conventional discovery pattern.

## Cross-references

- Component: [../components/humans-txt.md](../components/humans-txt.md).
- Why a humans.txt at all: [../recommendations/humans-txt.md](../recommendations/humans-txt.md).
- Site-wide vs. per-page defaults: [./head-tags.md](./head-tags.md).
