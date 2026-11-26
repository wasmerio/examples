# `headTags` — Global head defaults

Configures the Vite virtual module `virtual:eminence-astro-suite/head-tags`. Every tag component imports this module to read its fallback values.

See [../config/SKILL.md](../config/SKILL.md) for the full table of `headTags.*` fields. This page documents the resolution semantics — how integration config interacts with per-page props.

## How components read defaults

Three patterns exist, depending on the component:

### Pattern A — simple default

Used by: `Charset`, `Viewport`, `Title` (`template`), `Generator`, `ColorScheme`, `Manifest`, `HumansTxt`.

```ts
const { charset = config.charset } = Astro.props;
```

- The integration value is used when the prop is omitted.
- Passing the prop overrides the integration value.
- These props are scalar (`string`, `boolean`, `URL`), so there is no merging to consider.

### Pattern B — object props with all-or-nothing fallback (`hasAnyProp`)

Used by: `Base`, `AppleItunesApp`, `Extend`, `Robots`, `ThemeColor`, `Verification`.

```ts
// `field` is the matching `headTags.*` key for the component.
const props = hasAnyProp(Astro.props) ? Astro.props : config.field;
```

- Passing **any** prop on the component means the integration default is **completely ignored** — no merging.
- To use the integration default, pass no props.
- This intentionally prevents accidental partial overrides.

Example (`Verification`):

```ts
// astro.config.mjs
eminence({ headTags: { verification: { google: "g123", bing: "b456" } } });
```

```astro
<!-- Renders both google AND bing tokens from integration config -->
<Verification />

<!-- Renders ONLY yandex - the integration's google and bing are dropped -->
<Verification yandex="y789" />
```

To keep the google token while adding yandex, you must either set both at the integration level or pass both on the component.

### Pattern C — runtime merge (`Icons` only)

`<Icons />` is the one component that merges per-href:

- Build-generated tags (from `icons` integration option) come first.
- `headTags.icons` entries replace by `href`.
- `<Icons icons={...} />` runtime entries replace by `href`; `false` removes.

See [./icons.md](./icons.md) and [../components/icons.md](../components/icons.md) for details.

## Resolved virtual module shape

The serialized virtual module always exports an object of type `ResolvedHeadTagsConfig`. Fields with defaults (`charset`, `viewport`, `titleTemplate`, `generator`, `icons`) are guaranteed present. Other fields are present only when set.

```ts
// virtual:eminence-astro-suite/head-tags
export default {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",
  titleTemplate: "%s",
  generator: true,
  icons: [/* IconTag[] from icons option + headTags.icons */],
  // ...everything else from headTags, when set
};
```

## Server-only options are stripped

`robotsTxt`, `securityTxt`, `sitemap`, and the full `manifest` object are **not** serialized into the virtual module — they are build-time concerns. Only client-safe head tag configuration is shipped to components.

## Special resolution rules

### `humansTxt`

`headTags.humansTxt` accepts `string | URL | boolean | undefined`:

- `undefined` → integration validates presence of `public/humans.txt` and warns.
- `true` → resolved to `Astro.site + "/humans.txt"` (or `/humans.txt` if no site set).
- `string | URL` → used verbatim.
- `false` → suppress the link tag.

See [./humans-txt.md](./humans-txt.md) for the full three-state behavior.

### `manifest`

`headTags.manifest` accepts `string | URL | boolean | undefined`:

- If the top-level `manifest` integration option is set (object, not `false`), `headTags.manifest` defaults to `Astro.site + "/manifest.webmanifest"`.
- `true` forces derivation from `Astro.site` even if the integration is not generating one.
- `string | URL` is used verbatim.
- `false` (or `undefined` with no top-level `manifest`) suppresses the link tag.

### `themeColor`

`headTags.themeColor` accepts a string (single color) or `{ light, dark }` (paired). The resolved virtual module value normalizes to `{ content }` or `{ light, dark }` and is passed to the `ThemeColor` component.

### `icons`

`headTags.icons` is merged over the build-generated `IconTag[]` by `href`. The merged result is what `<Icons />` renders by default. See [./icons.md](./icons.md).

## Cross-references

- Full options table: [../config/SKILL.md](../config/SKILL.md).
- Per-component fallback details: see the matching page under [../components/](../components/).
