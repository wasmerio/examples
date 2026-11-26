<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Landpack](https://github.com/lauroguedes/landpack) Astro theme by lauroguedes, copied from commit `ccb566704abf336ba3620a17e56a2466a4975c9a` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-landpack.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
- **Environment variables:** The theme's example env file lists `PUBLIC_SITE_URL`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [lauroguedes](https://github.com/lauroguedes), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Landpack

[![Astro 7](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Lumos for Astro](https://img.shields.io/badge/Lumos_for_Astro-0.0.3-222326)](https://lumosframework.com/docs/)
[![Node.js 22.12+](https://img.shields.io/badge/Node.js-%E2%89%A522.12-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MIT License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

A customizable landing page template for open-source projects, built with **Astro, Lumos for Astro, and plain CSS**. Edit your content in YAML, JSON, and Markdown, then publish a static site.

<img width="1672" height="941" alt="ChatGPT Image Sep 19, 2026, 06_18_41 PM" src="https://github.com/user-attachments/assets/aca1e4e2-27e9-4126-96f9-de5da849b4a6" />

**Prefer to skip code edits?** Give an AI coding agent your project link or brief. The included [customization skill](docs/ai-customization.md) maps the whole template so the agent can adapt content, branding, assets, and SEO while preserving its structure.

Laravel SSO is the included example project. Its product descriptions, commands, screenshots, and integration examples are sample content to replace with your own. Running this template does not install an identity server or require PHP.

## Features

- Prompt-based customization with a portable, repository-local AI skill and a complete project map.
- Responsive layout with a mobile navigation sidebar and a header that hides on downward scroll and returns on upward scroll.
- Persistent light/dark themes, paired screenshots, and matching syntax highlighting.
- Three hero backgrounds and three screenshot frames, configured in YAML.
- Copyable commands, integration tabs with shareable URLs, and Markdown FAQs.
- Configurable hero stamp, creator credit, and a faded footer wordmark.
- Hover, touch, and keyboard activation for the sample SSO diagram; reduced-motion support.
- Validated content, optimized local images, local fonts, social metadata, and a sitemap.
- Regenerable social card and a built-output SEO check.
- Static output with no database, CMS, API token, React, or Vue required.

## Documentation

- [Quick start](#quick-start)
- [Customize with AI](#customize-with-ai)
- [Customize your site](#customize-your-site)
- [Complete customization reference](docs/customization.md)
- [Project structure and extension guide](docs/architecture.md)
- [Build and deploy](#build-and-deploy)
- [Cloudflare and Vercel deployment](docs/deployment.md)
- [SEO audit and social images](docs/seo.md)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License and credits](#license-and-credits)

## Quick start

Requires **Node.js 22.12.0 or newer** and **npm 9.6.5 or newer**. Use a supported Node.js release that meets those requirements.

1. Download or clone this repository. If its GitHub page offers **Use this template**, you can create your own repository with that option.
2. Open a terminal in the downloaded project directory.
3. Install the locked dependencies and start the background development server:

```sh
npm ci
npm run dev -- --background
```

Open the address printed by Astro, normally [localhost:4321](http://localhost:4321). Changes to content and components update the preview automatically.

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

Before your first production build, copy the environment example and set your public site URL:

```sh
cp .env.example .env
```

```dotenv
PUBLIC_SITE_URL=https://your-project.dev
```

This is the landing page’s URL, independent of the featured project’s repository, documentation, and demo links. Replace the fallback `https://example.com` before publishing.

## Customize with AI

Open this repository in an AI coding agent with local file access, then paste:

```text
Read .agents/skills/landpack-customize/SKILL.md and adapt this template
for <project link>. Use the project's own README and docs as sources.
Customize the complete page, branding, images, links, and SEO while
preserving its structure. Generate the social card, run the checks,
and show me the local preview.
```

You can provide a written project brief instead of a link. The agent makes the edits; you review the result and supply any missing facts or assets. See the [AI customization guide](docs/ai-customization.md) for prompts, agent discovery, and what the skill covers. It works without a hosted customization service and does not deploy automatically.

## Customize your site

Start with [src/content/project/main.yaml](src/content/project/main.yaml). Keep the filename `main.yaml`; the page and shared layout read that entry.

| What to change                                                  | Where                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| Identity, hero, links, section copy, screenshots, stamp, author | [Project YAML](src/content/project/main.yaml)                 |
| Feature cards                                                   | [Feature entries](src/content/features/)                      |
| Installation steps and commands                                 | [Step entries](src/content/steps/)                            |
| Integration tabs and code examples                              | [Integration entries](src/content/integrations/)              |
| FAQ questions and Markdown answers                              | [FAQ entries](src/content/faq/)                               |
| Palette, type scale, spacing, theme colors                      | [Design tokens](src/styles/base.css)                          |
| Inline logo                                                     | [GraphicMark.astro](src/components/Graphic/GraphicMark.astro) |
| Favicon and social image                                        | [public/](public/)                                            |
| Social image URL, description, and dimensions                   | `seo` in [Project YAML](src/content/project/main.yaml)        |
| Site URL                                                        | `.env` or the hosting build environment                       |
| Section order and page composition                              | [index.astro](src/pages/index.astro)                          |

For a first customization:

1. Replace the example project’s identity, links, commands, and section text.
2. Replace screenshots and author photo; write useful image descriptions.
3. Choose a `background` and `preview.frame` in YAML.
4. Update the stamp link. Its included `href: "#"` is a placeholder; remove `stamp` or set `stamp.enabled: false` to hide it.
5. Edit or remove collection entries. Their `order` values control sequence.
6. Replace the logo, favicon, and light/dark palette. Run `npm run og:generate` for a matching social card, or supply your own and configure `seo`.
7. Run the checks and inspect both themes at desktop and mobile widths.

The [customization reference](docs/customization.md) documents **every project field**, collection formats, image paths and crops, optional sections, typography, motion, shared UI labels, and SEO. The included diagrams are product-specific illustrations; their internal labels live in components.

## Commands

| Command                       | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| `npm ci`                      | Install exact dependencies from the lockfile            |
| `npm run dev -- --background` | Start local development in the background               |
| `npm run astro -- dev status` | Show background server status                           |
| `npm run astro -- dev logs`   | Read development logs                                   |
| `npm run astro -- dev stop`   | Stop the background server                              |
| `npm run check`               | Check Astro and TypeScript diagnostics                  |
| `npm run build`               | Load/validate content and generate `dist/`              |
| `npm run og:generate`         | Generate `public/og-image.jpg` from project content     |
| `npm run seo:check`           | Check built metadata, social image, sitemap, and robots |
| `npm run preview`             | Preview the production build locally                    |
| `npm run format`              | Format the project with Prettier                        |

Keep [package-lock.json](package-lock.json) committed. Dependency changes use `npm install`; normal fresh installs use `npm ci`.

## Build and deploy

```sh
npm run check
npm run build
npm run seo:check
npm run preview
```

Publish the generated **`dist/`** directory to a static host:

| Setting              | Value                                      |
| -------------------- | ------------------------------------------ |
| Install command      | `npm ci`                                   |
| Build command        | `npm run build`                            |
| Output directory     | `dist`                                     |
| Environment variable | `PUBLIC_SITE_URL=https://your-project.dev` |

No server adapter is required. Configure the production URL before building so canonical links, social images, `robots.txt`, and the sitemap use your domain. Environment changes require rebuilding.

Follow the short [Cloudflare Workers or Vercel instructions](docs/deployment.md). The included [wrangler.jsonc](wrangler.jsonc) supports Cloudflare static assets; Vercel needs no additional configuration for this template. Deployment is not automatic.

The [SEO guide](docs/seo.md) records the Astro documentation audit and explains social-image configuration. Run `npm run og:generate` when project text/colors change; builds use the reviewed image without regenerating it. For local checks before choosing a domain, use `npm run seo:check -- --allow-placeholder`. The normal check intentionally rejects the shipped example domain.

The template assumes hosting at the domain root. For a subdirectory, set Astro’s `base` and update root-relative navigation, favicon, and social-image paths. Changing `base` alone does not update literal URLs.

## Troubleshooting

| Symptom                             | Check                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Unsupported Node.js version         | Run `node --version` and use Node.js 22.12+                                                    |
| Content validation error            | Follow the file/field in the error; compare with [the schema](src/content.config.ts)           |
| New schema field is ignored         | Add it to the schema and wire it into a component; restart the dev server after schema changes |
| Missing screenshot                  | Image paths are relative to `main.yaml`, not the project root                                  |
| Light screenshot does not change    | Set `imageLight` alongside `image`; otherwise one asset serves both themes                     |
| Preview jumps to integrations       | Remove `?tab=…` from the URL; matching tab URLs intentionally reveal that section              |
| Wrong social/canonical URL          | Set `PUBLIC_SITE_URL` and rebuild                                                              |
| Copy button cannot access clipboard | Use HTTPS or localhost; the command remains selectable                                         |
| Port is already in use              | Check `dev status` and the address printed in the logs                                         |

## Contributing

Read [LUMOS.md](LUMOS.md) before changing components. Keep changes focused and reuse existing Lumos primitives. Include the reason for a change, relevant screenshots for UI work, and the checks performed.

Before submitting a pull request:

- Run `npm run check`, `npm run build`, and the SEO check (allow a placeholder only for local starter validation).
- For UI changes, check desktop/mobile, both themes, keyboard access, and reduced motion.
- Update the schema, customization guide, and skill project map together when adding settings.
- Keep generated `dist/`, `.astro/`, dependencies, and local environment files out of commits.

For help, use this repository’s Issues tab when available. Include reproduction steps, Node/npm versions, and relevant error output. Upstream references: [Astro documentation](https://docs.astro.build), [Lumos for Astro](https://lumosframework.com/docs/).

## License and credits

[MIT](LICENSE). Preserve the existing copyright and license notices when redistributing the template.

- **Lumos for Astro:** Timothy Ricks. The starter’s license and version metadata are preserved.
- **Landing page and example project:** Lauro Guedes; [Laravel SSO](https://github.com/lauroguedes/laravel-sso).
- **Brand icons:** [Source and license details](src/assets/icons/brands/README.md).
- **Example integrations:** Library/source links are stored beside each snippet. These excerpts are documentation examples, not an authentication implementation tested against live client credentials.

Replace the included branding, portraits, and product screenshots for your own site. Changing the displayed `license` field does not change this repository’s software license.
