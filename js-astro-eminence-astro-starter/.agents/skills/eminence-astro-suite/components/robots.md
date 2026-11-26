# `Robots`

Renders `<meta name="robots">` to control crawler behavior.

## Import

```ts
import { Robots } from "eminence-astro-suite/components";
```

## Props — mutually exclusive modes

### Content mode

| Prop      | Type     | Default | Required      | Description                                    |
| --------- | -------- | ------- | ------------- | ---------------------------------------------- |
| `content` | `string` | —       | yes (content) | Raw robots directive string (passed verbatim). |

### Directive mode

| Prop                | Type                              | Default | Required | Description                                  |
| ------------------- | --------------------------------- | ------- | -------- | -------------------------------------------- |
| `noindex`           | `boolean`                         | —       | no       | Prevent indexing.                            |
| `nofollow`          | `boolean`                         | —       | no       | Prevent link following.                      |
| `noarchive`         | `boolean`                         | —       | no       | Prevent caching.                             |
| `nosnippet`         | `boolean`                         | —       | no       | Prevent snippet generation.                  |
| `indexifembedded`   | `boolean`                         | —       | no       | Allow indexing when embedded.                |
| `max-snippet`       | `number`                          | —       | no       | Max snippet character length.                |
| `max-image-preview` | `"none" \| "standard" \| "large"` | —       | no       | Max image preview size.                      |
| `max-video-preview` | `number`                          | —       | no       | Max video snippet seconds.                   |
| `notranslate`       | `boolean`                         | —       | no       | Prevent translation in results.              |
| `noimageindex`      | `boolean`                         | —       | no       | Prevent image indexing.                      |
| `unavailable_after` | `string`                          | —       | no       | Date/time after which page shouldn't appear. |

You cannot mix modes — TypeScript discriminates `content` vs the directive props.

## Examples

```astro
<Robots content="noindex, nofollow" />
<!-- <meta name="robots" content="noindex, nofollow"> -->

<Robots noindex nofollow max-snippet={50} />
<!-- <meta name="robots" content="noindex, nofollow, max-snippet:50"> -->

<Robots
  noindex
  max-image-preview="large"
  unavailable_after="2027-01-01T00:00:00Z"
/>
<!-- <meta name="robots" content="noindex, max-image-preview:large, unavailable_after:2027-01-01T00:00:00Z"> -->

<Robots />
<!-- Uses headTags.robots if configured; otherwise renders nothing -->
```

## Rules

- Modes are mutually exclusive at the type level. Do not pass `content` with directive props.
- Boolean directives are serialized as the directive name alone (e.g. `noindex`). `false` directives are omitted.
- Non-boolean directives are serialized as `name:value` and joined with `, `.
- Uses the all-or-nothing fallback (`hasAnyProp`): passing any prop disables the integration default entirely — see [../usage/SKILL.md](../usage/SKILL.md#6-integration-fallback-rule-for-object-props-hasanyprop).
- For page-level allow rules (the inverse), set crawler rules in [`robotsTxt`](../integration/robots-txt.md) instead.

## Cross-references

- Composed inside [`Head`](./head.md) via the `robots` prop.
- Integration default: [`headTags.robots`](../integration/head-tags.md).
- Site-wide crawl rules: [../integration/robots-txt.md](../integration/robots-txt.md).
