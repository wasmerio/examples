# `ColorScheme`

Renders `<meta name="color-scheme">` to advertise the page's supported color schemes to the user agent.

## Import

```ts
import { ColorScheme } from "eminence-astro-suite/components";
```

## Props

| Prop      | Type                                                                            | Default                | Required | Description                      |
| --------- | ------------------------------------------------------------------------------- | ---------------------- | -------- | -------------------------------- |
| `content` | `"normal" \| "light" \| "dark" \| "light dark" \| "dark light" \| "only light"` | `headTags.colorScheme` | no       | Color schemes the page supports. |

## Examples

```astro
<ColorScheme content="light dark" />
<!-- <meta name="color-scheme" content="light dark"> -->

<ColorScheme content="only light" />

<ColorScheme />
<!-- Uses headTags.colorScheme if configured; otherwise renders nothing -->
```

## Rules

- Renders nothing when neither prop nor integration default provides a value.
- The order in `"light dark"` vs `"dark light"` is meaningful: it expresses the preferred order when the user agent has no preference.
- Use `"only light"` to opt out of automatic dark UA styling (e.g. form controls) even when the user prefers dark.
- This tag is independent from [`ThemeColor`](./theme-color.md). `ColorScheme` controls UA-rendered native widgets; `ThemeColor` controls browser chrome.

## Cross-references

- Composed inside [`Head`](./head.md) via the `colorScheme` prop.
- Companion: [`ThemeColor`](./theme-color.md) for browser chrome theming.
- Integration default: [`headTags.colorScheme`](../integration/head-tags.md).
