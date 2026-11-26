---
name: eminence-install
description: How to install and wire `eminence-astro-suite` into an Astro project.
disable-model-invocation: true
---

# Installing Eminence Astro Suite

Use this guide only when `eminence-astro-suite` is not already a dependency of the project.

## Required peer dependency

- `astro` — any version that supports Astro integrations (peer dependency, not optional).

## Optional peer dependencies

Install only the ones whose features you use.

| Peer               | Needed for                                                                           | Install command             |
| ------------------ | ------------------------------------------------------------------------------------ | --------------------------- |
| `@astrojs/sitemap` | The `sitemap` integration option (registered automatically unless `sitemap: false`). | `pnpm add @astrojs/sitemap` |
| `sharp`            | The `icons` option (raster generation).                                              | `pnpm add sharp`            |
| `sharp-ico`        | The `icons` option (`.ico` generation).                                              | `pnpm add sharp-ico`        |
| `schema-dts`       | Type-safe JSON-LD authoring (used inside your code, not by the suite directly).      | `pnpm add -D schema-dts`    |

## Install the package

```bash
pnpm add eminence-astro-suite
```

`npm` and `yarn` work too:

```bash
npm install eminence-astro-suite
yarn add eminence-astro-suite
```

## Wire the integration

Add the default export of `eminence-astro-suite` to your Astro `integrations` array.

```ts title="astro.config.mjs"
import { defineConfig } from "astro/config";
import eminence from "eminence-astro-suite";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    eminence({
      // Project-wide defaults (optional but recommended).
      headTags: {
        titleTemplate: "%s | Example",
        openGraphSiteName: "Example",
      },
    }),
  ],
});
```

## Import the components

Components live under a separate subpath export. Always import from `eminence-astro-suite/components`, not from the package root.

```astro
---
import { Head } from "eminence-astro-suite/components";
---

<html>
  <Head title="Home" description="Welcome to Example" />
  <body>...</body>
</html>
```

## Rules

- The integration is **required**. Components import `virtual:eminence-astro-suite/head-tags`. Without the integration, Vite will fail to resolve that module.
- Set `site` in `astro.config.mjs` whenever possible. Several components (`Canonical`, `Manifest`, `HumansTxt`, `OpenGraph`) derive absolute URLs from `Astro.site`.
- Do not import the integration default export into a component file — it is for `astro.config.mjs` only.
- Do not install peers you do not use; the integration only loads the ones whose feature is enabled.

## Cross-references

- After installing, read [../usage/SKILL.md](../usage/SKILL.md) for usage rules.
- Then read [../config/SKILL.md](../config/SKILL.md) for the full integration options.
