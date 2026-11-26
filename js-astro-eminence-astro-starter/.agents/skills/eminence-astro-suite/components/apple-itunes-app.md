# `AppleItunesApp`

Renders `<meta name="apple-itunes-app">` — the iOS Safari Smart App Banner.

## Import

```ts
import { AppleItunesApp } from "eminence-astro-suite/components";
```

## Props — mutually exclusive modes

### Content mode

| Prop      | Type     | Default | Required      | Description                                  |
| --------- | -------- | ------- | ------------- | -------------------------------------------- |
| `content` | `string` | —       | yes (content) | Fully built Smart App Banner content string. |

### Parts mode

| Prop       | Type     | Default | Required    | Description                                                |
| ---------- | -------- | ------- | ----------- | ---------------------------------------------------------- |
| `id`       | `string` | —       | yes (parts) | App Store application ID. Emits `app-id=<id>`.             |
| `argument` | `string` | —       | no          | Optional deep-link / URL. Emits `app-argument=<argument>`. |

You cannot mix modes — TypeScript discriminates `content` vs `id` / `argument`.

## Examples

```astro
<AppleItunesApp id="123456789" />
<!-- <meta name="apple-itunes-app" content="app-id=123456789"> -->

<AppleItunesApp id="123456789" argument="myapp://open" />
<!-- <meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open"> -->

<AppleItunesApp content="app-id=123456789, app-argument=myapp://open" />
<!-- same output as the previous example -->

<AppleItunesApp />
<!-- Uses headTags.appleItunesApp if configured; otherwise renders nothing -->
```

## Rules

- Modes are mutually exclusive at the type level. Do not pass `content` with `id`/`argument`.
- Renders nothing if no `id` and no `content` is available (either via prop or integration default).
- Uses the all-or-nothing fallback (`hasAnyProp`): passing any prop disables the integration default entirely — see [../usage/SKILL.md](../usage/SKILL.md#6-integration-fallback-rule-for-object-props-hasanyprop).
- To suppress when composed inside [`Head`](./head.md), pass `appleItunesApp={false}`.

## Cross-references

- Composed inside [`Head`](./head.md) via the `appleItunesApp` prop.
- Integration default: [`headTags.appleItunesApp`](../integration/head-tags.md).
- Why `apple-mobile-web-app-*` tags are intentionally **not** exposed: [../policies/unsupported-tags.md](../policies/unsupported-tags.md).
