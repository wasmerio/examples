# `ThemeColor`

Renders one or two `<meta name="theme-color">` tags for the browser UI chrome.

## Import

```ts
import { ThemeColor } from "eminence-astro-suite/components";
```

## Props — mutually exclusive modes

### Single mode

| Prop      | Type     | Default                                  | Required     | Description                        |
| --------- | -------- | ---------------------------------------- | ------------ | ---------------------------------- |
| `content` | `string` | from `headTags.themeColor` (when string) | yes (single) | Single color used for all schemes. |

### Light/dark mode

| Prop    | Type     | Default                          | Required     | Description                                |
| ------- | -------- | -------------------------------- | ------------ | ------------------------------------------ |
| `light` | `string` | from `headTags.themeColor.light` | yes (paired) | Color for `(prefers-color-scheme: light)`. |
| `dark`  | `string` | from `headTags.themeColor.dark`  | yes (paired) | Color for `(prefers-color-scheme: dark)`.  |

You cannot mix modes — TypeScript discriminates `content` vs `light`/`dark`.

## Examples

```astro
<ThemeColor content="#ffffff" />
<!-- <meta name="theme-color" content="#ffffff"> -->

<ThemeColor light="#ffffff" dark="#111111" />
<!--
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111111">
-->

<ThemeColor />
<!-- Uses headTags.themeColor if configured; otherwise renders nothing -->
```

## Rules

- Modes are mutually exclusive at the type level. Do not pass `content` with `light` or `dark`.
- Uses the all-or-nothing fallback (`hasAnyProp`): passing any prop disables the integration default entirely — see [../usage/SKILL.md](../usage/SKILL.md#6-integration-fallback-rule-for-object-props-hasanyprop).
- To suppress when composed inside [`Head`](./head.md), pass `themeColor={false}`.
- `ThemeColor` controls browser chrome (address bar, OS task switcher). For UA-rendered widgets and native controls, see [`ColorScheme`](./color-scheme.md).

## Cross-references

- Composed inside [`Head`](./head.md) via the `themeColor` prop.
- Companion: [`ColorScheme`](./color-scheme.md).
- Integration default: [`headTags.themeColor`](../integration/head-tags.md).
