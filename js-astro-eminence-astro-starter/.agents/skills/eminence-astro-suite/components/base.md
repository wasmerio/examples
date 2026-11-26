# `Base`

Renders a `<base>` tag for relative URL resolution and the default browsing context for links and forms.

## Import

```ts
import { Base } from "eminence-astro-suite/components";
```

## Props

| Prop     | Type     | Default                | Required | Description                                                     |
| -------- | -------- | ---------------------- | -------- | --------------------------------------------------------------- |
| `href`   | `string` | `headTags.base.href`   | no       | Base URL for resolving relative URLs.                           |
| `target` | `string` | `headTags.base.target` | no       | Default browsing context for links and forms (e.g. `"_blank"`). |

## Examples

```astro
<Base href="https://example.com" />
<!-- <base href="https://example.com"> -->

<Base href="https://example.com" target="_blank" />
<!-- <base href="https://example.com" target="_blank"> -->

<Base />
<!-- Uses headTags.base if configured; otherwise renders nothing -->
```

## Rules

- Renders nothing when neither prop is provided **and** no integration default is set.
- Uses the all-or-nothing fallback (`hasAnyProp`): passing any prop disables the integration default entirely — see [../usage/SKILL.md](../usage/SKILL.md#6-integration-fallback-rule-for-object-props-hasanyprop).
- `<base>` affects **all** relative URLs in the document, including `<a href>`, `<img src>`, fetch URLs in inline scripts, etc. Avoid unless you have a specific reason.

## Cross-references

- Composed inside [`Head`](./head.md) via the `base` prop.
- Integration default: [`headTags.base`](../integration/head-tags.md).
