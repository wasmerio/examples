<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Lotus](https://github.com/prosefly/astro-theme-lotus) Astro theme by prosefly, copied from commit `a739dcc1f256ab1276463d61f9ec4b3b8eeaa7a2` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-lotus.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [prosefly](https://github.com/prosefly), BSD-3-Clause. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Theme Lotus

Lotus helps Astro developers build beautiful, accessible, and fast
documentation sites without designing the docs shell from scratch.

It is an installable documentation theme for Astro v7, Tailwind CSS v4, and
MDX. Lotus gives your project generated docs routes, responsive navigation,
table of contents, search, dark mode, i18n, theme tokens, and docs components
without turning the whole site into a theme fork.

![Lotus documentation theme preview](.github/assets/light-dark.png)

## Why Lotus

- Beautiful documentation defaults with readable prose, compact navigation, and
  polished light and dark modes.
- Accessible shell patterns for keyboard-friendly navigation, semantic content,
  focus states, and theme controls.
- Fast static output with minimal client JavaScript and a current PageSpeed
  Insights mobile report scoring 100 across all categories.

## Quick Start

Start from the Lotus starter template when you want a working documentation site
with Astro, content collections, theme config, and example docs already wired
up.

```sh
pnpm create astro@latest my-docs --template prosefly/astro-template-lotus-starter
cd my-docs
pnpm dev
```

Template source:
[prosefly/astro-template-lotus-starter](https://github.com/prosefly/astro-template-lotus-starter)

## Add To An Existing Project

Install Lotus manually when you already have an Astro project or want to add the
docs shell one piece at a time.

```sh
npm install @prosefly/astro-theme-lotus
```

Install `@prosefly/astro-components` directly when your own MDX or Astro files
import shared components such as cards, steps, tabs, or callouts.

Add the integration:

```ts
// astro.config.ts
import { defineConfig } from 'astro/config';
import lotus from '@prosefly/astro-theme-lotus';

export default defineConfig({
  integrations: [lotus()],
});
```

Lotus adds `@prosefly/astro-components/integration` with default options when
it is not already registered. Register that integration yourself when you need
to customize its icon or Markdown behavior; Lotus will use your registration
instead of adding another copy.

Register your docs collection:

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, docsSchema } from '@prosefly/astro-theme-lotus/content';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

export const collections = { docs };
```

Create docs in `src/content/docs/`. By default, Lotus renders docs from the
site root: `src/content/docs/index.mdx` renders at `/`, and
`src/content/docs/installation.mdx` renders at `/installation/`.

## Configure

Create `theme.config.json` in the project root. Options passed to
`lotus({...})` in `astro.config.ts` override values from this JSON file.

```json
{
  "$schema": "https://prosefly.dev/schema/lotus.json",
  "name": "Acme Docs",
  "description": "Documentation for Acme.",
  "logo": "/images/logo.svg",
  "siteNav": [
    { "label": "Docs", "href": "/" },
    { "label": "GitHub", "href": "https://github.com/acme/acme", "external": true }
  ],
  "docsNav": [
    {
      "label": "Guides",
      "icon": "lucide:rocket",
      "items": [
        "overview",
        "installation",
        {
          "label": "Configuration",
          "items": [{ "autogenerate": { "directory": "configuration" } }]
        }
      ]
    }
  ]
}
```

## Features

- Astro v7 integration for documentation sites
- MDX content with configurable docs routes
- Responsive header, subnav, sidebar, main content, TOC, and footer
- Light, dark, and system theme modes
- Configurable accent color, gray palette, and radius
- Global head entries for custom CSS, social cards, and verification tags
- Local search, Pagefind, and DocSearch providers
- i18n-aware routes, labels, and sidebar ownership
- Expressive Code support
- Iconify-powered icons
- Component overrides for shell pieces such as search, navigation, footer links,
  page metadata, and theme switch controls

## Links

- Documentation: <https://astro-theme-lotus.prosefly.dev/docs/overview/>
- Showcase: <https://astro-theme-lotus.prosefly.dev/showcase/>
- Starter template:
  <https://github.com/prosefly/astro-template-lotus-starter>
- npm package: <https://www.npmjs.com/package/@prosefly/astro-theme-lotus>

## License

BSD-3-Clause
