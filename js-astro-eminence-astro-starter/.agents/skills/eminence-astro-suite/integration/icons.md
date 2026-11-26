# `icons` — Build-time icon generation

Generates a favicon and app icon set from a single source image. Auto-emits matching `<link>` tags via [`Icons`](../components/icons.md) and contributes icons to the [manifest](./manifest.md).

## Peers

Install both:

```bash
pnpm add sharp sharp-ico
```

- `sharp` for raster output (PNG, JPG, GIF, WebP, AVIF).
- `sharp-ico` for `.ico` generation.

`.svg` files are copied as-is — no peer required for SVG-only setups (but the default set generates rasters).

## Minimal usage

```ts title="astro.config.mjs"
eminence({
  icons: {
    source: "src/assets/logo.svg",
  },
});
```

That single line generates the **default icon set**:

| Output file            | Size(s)    | Tag                                                                          | Manifest |
| ---------------------- | ---------- | ---------------------------------------------------------------------------- | -------- |
| `favicon.ico`          | 16, 32, 48 | `<link rel="icon" sizes="any" href="/favicon.ico">`                          | no       |
| `favicon.png`          | 32×32      | `<link rel="icon" sizes="32x32" type="image/png" href="/favicon.png">`       | no       |
| `apple-touch-icon.png` | 180×180    | `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">` | no       |
| `icon-192.png`         | 192×192    | `<link rel="icon" sizes="192x192" type="image/png" href="/icon-192.png">`    | yes      |
| `icon.png`             | 512×512    | `<link rel="icon" sizes="512x512" type="image/png" href="/icon.png">`        | yes      |

When the `source` is an SVG, an additional `favicon.svg` is copied and a `<link rel="icon" sizes="any" type="image/svg+xml" href="/favicon.svg">` tag is emitted.

## Options

```ts
type IconsOptions = {
  source: string;
  [filename: `${string}.ico`]: IcoIconDefinition | false;
  [filename: `${string}.svg`]: SvgIconDefinition | false;
  [filename: `${string}.${RasterExt}`]: RasterIconDefinition | false;
};
```

`RasterExt` ∈ `"png" | "jpg" | "jpeg" | "gif" | "webp" | "avif"`.

### Top-level

| Field        | Type                      | Required | Description                                                                                         |
| ------------ | ------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `source`     | `string`                  | yes      | Project-relative path to the source image (must be a supported extension).                          |
| `[filename]` | `IconDefinition \| false` | no       | Override or add a generation task keyed by output filename. Pass `false` to remove a default entry. |

### `IcoIconDefinition` (filename ends in `.ico`)

| Field          | Type                                 | Required | Description                                                               |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------- |
| `sizes`        | `number[] \| false`                  | yes      | Pixel sizes packed into the ICO. `false` disables.                        |
| `tag`          | `Partial<IconTag> & { rel: string }` | no       | `<link>` attribute overrides. `href` is always derived from the filename. |
| `manifest`     | `boolean \| ManifestIconOptions`     | no       | Include this icon in the manifest's `icons` array.                        |
| `source`       | `string`                             | no       | Per-icon source override.                                                 |
| `sharpOptions` | `ResizeOptions`                      | no       | Forwarded to `sharp.resize`.                                              |

### `SvgIconDefinition` (filename ends in `.svg`)

| Field      | Type                                 | Required | Description                        |
| ---------- | ------------------------------------ | -------- | ---------------------------------- |
| `tag`      | `Partial<IconTag> & { rel: string }` | no       | `<link>` attribute overrides.      |
| `manifest` | `boolean \| ManifestIconOptions`     | no       | Include this icon in the manifest. |

SVGs are not resized; they are copied verbatim.

### `RasterIconDefinition` (filename ends in any raster extension)

| Field          | Type                                 | Required | Description                            |
| -------------- | ------------------------------------ | -------- | -------------------------------------- |
| `size`         | `number \| false`                    | yes      | Pixel size (square). `false` disables. |
| `tag`          | `Partial<IconTag> & { rel: string }` | no       | `<link>` attribute overrides.          |
| `manifest`     | `boolean \| ManifestIconOptions`     | no       | Include in manifest.                   |
| `source`       | `string`                             | no       | Per-icon source override.              |
| `sharpOptions` | `ResizeOptions`                      | no       | Forwarded to `sharp.resize`.           |

### `IconTag` shape (used for `tag` overrides)

| Field   | Type                          | Required | Notes                                                       |
| ------- | ----------------------------- | -------- | ----------------------------------------------------------- |
| `rel`   | `string`                      | yes      | Required to emit a `<link>` tag.                            |
| `href`  | `string`                      | —        | Ignored in config (derived from key).                       |
| `sizes` | `string`                      | no       | e.g. `"192x192"` or `"any"`.                                |
| `type`  | `string`                      | no       | MIME override; inferred when omitted.                       |
| `media` | `"light" \| "dark" \| string` | no       | `light`/`dark` are sugar for `(prefers-color-scheme: ...)`. |

### `ManifestIconOptions`

| Field     | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `src`     | `string` | Override `src` (defaults to the icon's href). |
| `sizes`   | `string` | Override sizes string.                        |
| `type`    | `string` | Override MIME.                                |
| `purpose` | `string` | e.g. `"any maskable"`.                        |

## Examples

### Add a maskable icon and drop apple-touch-icon

```ts
eminence({
  icons: {
    source: "src/assets/logo.svg",
    "apple-touch-icon.png": false,
    "maskable.png": {
      size: 512,
      tag: { rel: "icon", sizes: "512x512" },
      manifest: { purpose: "maskable" },
    },
  },
});
```

### Light/dark SVG favicon

```ts
eminence({
  icons: {
    source: "src/assets/logo.svg",
    "favicon-dark.svg": {
      tag: { rel: "icon", sizes: "any", media: "dark" },
    },
  },
});
```

The output `<link>` tag becomes `<link rel="icon" sizes="any" type="image/svg+xml" media="(prefers-color-scheme: dark)" href="/favicon-dark.svg">`.

## Resolution and merge order

1. Default icon set is computed from `source`.
2. Per-filename entries in `IconsOptions` add, override, or remove defaults.
3. Resulting `IconTag[]` is exposed via the virtual module.
4. `headTags.icons` merges over the result by `href`.
5. `<Icons icons={...} />` runtime overrides merge over that result; `false` removes by `href`.
6. Manifest icons are computed separately from icons whose `manifest` is truthy; `manifest.icons` (in the integration's `manifest` option) merges over that set by `src`.

## Rules

- `source` must use a supported extension: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.avif`, `.svg`, `.ico`.
- Each filename key must end in one of those extensions. Mismatched extensions are a type error.
- Setting a default entry to `false` removes it from both the tag set and the manifest.
- `icons: false` disables the entire feature (no generation, no tags, no manifest icons).
- Omitting `icons` is **not** an error — it skips icon generation without a warning.
- `source` is required when `icons` is set. Without `source`, the integration logs a warning and skips generation.

## Cross-references

- Component that renders the tags: [../components/icons.md](../components/icons.md).
- Manifest icon interaction: [./manifest.md](./manifest.md).
- `headTags.icons` merge details: [./head-tags.md](./head-tags.md).
- Why we do not generate `browserconfig.xml`: [../policies/unsupported-files.md](../policies/unsupported-files.md).
