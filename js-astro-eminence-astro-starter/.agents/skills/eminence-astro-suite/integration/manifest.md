# `manifest` — `manifest.webmanifest` generation

Generates `dist/manifest.webmanifest` from a typed `WebManifestOptions` object. Auto-merges icons emitted by the [`icons`](./icons.md) feature.

## Minimal usage

```ts title="astro.config.mjs"
eminence({
  icons: { source: "src/assets/logo.svg" },
  manifest: {
    name: "Example",
    short_name: "Example",
    start_url: "/",
    display: "standalone",
  },
});
```

This produces a manifest whose `icons` array is auto-populated with `icon-192.png` and `icon.png` from the icon generator.

## Required fields (discriminated)

`WebManifestOptions` enforces two pairs at the type level:

1. **Name** — provide at least one of:
   - `name: string`, or
   - `short_name: string`
2. **Display** — provide at least one of:
   - `display: string` (e.g. `"standalone"`, `"minimal-ui"`, `"fullscreen"`, `"browser"`), or
   - `display_override: string[]` (ordered list of candidates).

You may provide both halves of either pair; you must provide at least one.

Always required:

| Field       | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `start_url` | `string` | URL loaded when the app launches. |

## Optional fields

| Field                         | Type                                      | Description                                                          |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| `icons`                       | `WebManifestIconItem[]`                   | Explicit icons. Merged over auto-generated icons by `src`.           |
| `description`                 | `string`                                  | App purpose.                                                         |
| `background_color`            | `string`                                  | Splash screen background.                                            |
| `theme_color`                 | `string`                                  | Default OS/browser chrome color.                                     |
| `scope`                       | `string`                                  | Navigation scope.                                                    |
| `orientation`                 | `string`                                  | Default screen orientation.                                          |
| `id`                          | `string`                                  | Unique app identity.                                                 |
| `categories`                  | `string[]`                                | App store categories.                                                |
| `screenshots`                 | `WebManifestScreenshotItem[]`             | Install/store screenshots.                                           |
| `shortcuts`                   | `WebManifestShortcutItem[]`               | OS context menu shortcuts.                                           |
| `related_applications`        | `WebManifestRelatedApplication[]`         | Native app alternatives.                                             |
| `prefer_related_applications` | `false`                                   | **Only `false` is allowed.** `true` is a TypeScript error by design. |
| `file_handlers`               | `WebManifestFileHandler[]`                | File type handlers.                                                  |
| `protocol_handlers`           | `WebManifestProtocolHandler[]`            | Custom URL protocol handlers.                                        |
| `share_target`                | `WebManifestShareTarget`                  | OS share sheet target.                                               |
| `launch_handler`              | `WebManifestLaunchHandler`                | Launch behavior.                                                     |
| `note_taking`                 | `{ new_note_shortcut?: { url: string } }` | Note-taking integration.                                             |
| `scope_extensions`            | `Array<{ origin: string }>`               | Additional navigation scopes.                                        |
| `serviceworker`               | `WebManifestServiceWorker`                | Service worker metadata.                                             |

## Sub-shapes

```ts
type WebManifestIconItem = {
  src: string;
  sizes?: string;
  type?: string;
  purpose?: string; // e.g. "any maskable"
};

type WebManifestScreenshotItem = {
  src: string;
  sizes?: string;
  type?: string;
  label?: string;
  form_factor?: string;
  platform?: string;
};

type WebManifestShortcutItem = {
  name: string;
  url: string;
  short_name?: string;
  description?: string;
  icons?: WebManifestIconItem[];
};

type WebManifestRelatedApplication = {
  platform: string;
  url?: string;
  id?: string;
};

type WebManifestFileHandler = {
  action: string;
  accept: Record<string, string[]>;
};

type WebManifestProtocolHandler = {
  protocol: string;
  url: string;
};

type WebManifestShareTarget = {
  action: string;
  method?: string;
  enctype?: string;
  params?: Record<string, string>;
};

type WebManifestLaunchHandler = {
  client_mode?: string | string[];
};

type WebManifestServiceWorker = {
  src: string;
  scope?: string;
  type?: string;
  update_via_cache?: string;
};
```

## Example: full PWA with shortcuts

```ts
eminence({
  manifest: {
    name: "Acme Studio",
    short_name: "Acme",
    description: "Acme Studio dashboard",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    orientation: "portrait",
    categories: ["productivity"],
    shortcuts: [
      {
        name: "New project",
        url: "/new",
        icons: [{ src: "/new.png", sizes: "96x96" }],
      },
    ],
  },
});
```

## Behavior

- Generation is skipped (with a warning) if `dist/manifest.webmanifest` already exists.
- Omitting `manifest` triggers a recommendation warning. Pass `manifest: false` to disable explicitly and silence the warning.
- When `manifest: false`, no link tag is emitted by `<Head />` either (because `headTags.manifest` defaults to undefined in that case).
- The `<link rel="manifest" href="...">` tag is emitted by [`Manifest`](../components/manifest.md), composed inside [`Head`](../components/head.md).

## Rules

- Provide `name` **or** `short_name` (TypeScript-enforced).
- Provide `display` **or** `display_override` (TypeScript-enforced).
- `prefer_related_applications` may only be `false` if set. Best-practice rationale: users should not be steered away from the web app in favor of a native alternative.
- The manifest file is JSON; do not include comments or trailing commas in the values you pass.

## Cross-references

- Icons feeding the manifest: [./icons.md](./icons.md).
- Link tag component: [../components/manifest.md](../components/manifest.md).
- When to add a manifest at all: [../recommendations/manifest.md](../recommendations/manifest.md).
- Why `apple-mobile-web-app-*` tags are not emitted alongside: [../policies/unsupported-tags.md](../policies/unsupported-tags.md).
