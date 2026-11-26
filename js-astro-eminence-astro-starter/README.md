<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Eminence Astro Starter](https://github.com/aruncarmona/eminence-astro-starter) Astro theme by aruncarmona, copied from commit `ba3aaa6596e73e3443016b8fbd95c85939cd6e13` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-eminence-astro-starter.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and runs the `@astrojs/node` standalone server on Wasmer Edge.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
  - Replaced the @astrojs/cloudflare adapter with @astrojs/node 11.1.2 in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.
  - Added a `start` script (`node ./dist/server/entry.mjs`) to package.json so Wasmer can start the Node server.
- **Environment variables:** None.
- **Credit:** theme by [aruncarmona](https://github.com/aruncarmona), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Eminence Astro Starter

![Cloudflare Workers Build Status](https://cloudflare-build-badge.xeffen25.com/Xeffen25/eminence-astro-starter/status.svg)

The best starter template for Astro projects deployed to Cloudflare Workers because it ships with a full site structure, Cloudflare-ready configuration, and a setup flow tuned for fast project launches.

## Getting Started

### 1. Use the template

Create your project from this template with:

```sh
pnpm create astro@latest --template Xeffen25/eminence-astro-starter --install --no-git
```

Move your terminal into the created directory and start it with the following command:

```sh
git init
pnpm husky
git add .
git commit -m "Initial commit"
```

Follow the prompts to create the new project from this repository template.

### 2. Create your GitHub repository and push

Create the repository in GitHub:

- https://github.com/new

Then connect and push your local project:

```sh
git remote add origin https://github.com/<your-user>/<your-repo>.git
git branch -M main
git push -u origin main
```

### 3. Rename and clean up the project

Update the project name in these files and remove files you do not need:

- `wrangler.jsonc` (`name` and `route` if needed; otherwise delete `route` and set `workers_dev` to `true`)
- `astro.config.mjs` (`site`)
- LICENSE
- CONTRIBUTING.md
- README.md
- .github/SUPPORT.md
- .github/SECURITY.md

I recommend creating an issue with this checklist so you can keep or restore items depending on your project needs.

### 4. Commit

After renaming and formatting the project, create a meaningful setup commit:

```sh
git add .
git commit -m "chore: bootstrap project from eminence-astro-starter"
git push
```

### 5. Link to Cloudflare

Link your GitHub repository in Cloudflare Workers so deployments run automatically:

- https://dash.cloudflare.com/?to=/:account/workers-and-pages

### 6. Make it yours

Your done! Now make it yours. Change the `icon.svg`, customize the homepage, and use the `eminence-astro-suite` config warnings during builds to keep SEO and metadata in good shape.

Recommended checklist:

- [ ] Replace branding assets mainly src/assets/icon.svg
- [ ] Update pages in general like homepage with their related metadata
- [ ] Update GitHub repository metadata (description, topics, website, and social preview image)
- [ ] Use `pnpm build` so see eminence-astro-suite warnings and address them for your project.

## Improvements

The template includes:

- [Full Project Structure](https://github.com/Xeffen25/eminence-astro-starter/wiki/Full-Project-Structure)
- [Cloudflare Workers build status badge](https://github.com/Xeffen25/eminence-astro-starter/wiki/Cloudflare-Workers-Build-Status-Badge)
- [Automatic Formatting](https://github.com/Xeffen25/eminence-astro-starter/wiki/Automatic-Formatting)
- [Paraglide i18n support (messages + generated runtime)](https://github.com/Xeffen25/eminence-astro-starter/wiki/Paraglide-i18n-Support)
- [Tailwind CSS 4 + daisyUI plugin](https://github.com/Xeffen25/eminence-astro-starter/wiki/Tailwind-CSS-4-and-daisyUI)
- [Svelte integration ready for interactive islands](https://github.com/Xeffen25/eminence-astro-starter/wiki/Svelte-Integration)
- [LanguageSwitcher component included](https://github.com/Xeffen25/eminence-astro-starter/wiki/Components-LanguageSwitcher-Fonts-SkipToContent)
- [Fonts component included](https://github.com/Xeffen25/eminence-astro-starter/wiki/Components-LanguageSwitcher-Fonts-SkipToContent)
- [SkipToContent component included](https://github.com/Xeffen25/eminence-astro-starter/wiki/Components-LanguageSwitcher-Fonts-SkipToContent)
- [Layout Ready](https://github.com/Xeffen25/eminence-astro-starter/wiki/Layout-Ready)
- [SEO Ready with eminence-astro-suite](https://github.com/Xeffen25/eminence-astro-starter/wiki/SEO-Ready-with-eminence-astro-suite)
- [pnpm config improvements](https://github.com/Xeffen25/eminence-astro-starter/wiki/PNPM-Config-Improvements)
- [TypeScript Config](https://github.com/Xeffen25/eminence-astro-starter/wiki/TypeScript-Config)
- [Wrangler Config](https://github.com/Xeffen25/eminence-astro-starter/wiki/Wrangler-Config)
- [Better commands for easier DX](https://github.com/Xeffen25/eminence-astro-starter/wiki/Better-Commands)
- [AI ready](#ai-ready) (see below)
- [GitHub labels for websites](https://github.com/Xeffen25/eminence-astro-starter/wiki/GitHub-Labels-for-Websites)
- [GitHub related files](https://github.com/Xeffen25/eminence-astro-starter/wiki/GitHub-Related-Files)
- [VS Code settings](https://github.com/Xeffen25/eminence-astro-starter/wiki/VS-Code-Settings)
- [Vitest for testing](https://github.com/Xeffen25/eminence-astro-starter/wiki/Vitest-for-Testing)

## AI ready

This project includes **skills** — short instruction files that teach AI assistants how to work on _this_ codebase. They live in `.agents/skills/`. Skills are **opt-in**: they load only when you ask for them, so normal chats stay light.

Works with **Cursor**, **GitHub Copilot**, **Codex**, and **Claude Code**. More detail: [`.agents/EXPERTS.md`](.agents/EXPERTS.md).

### How to use a skill

**In Cursor:** type `@` and pick the skill name (for example `@honest-seo-expert`), or attach the `SKILL.md` file to your message.

**In other tools:** tell the assistant to read the skill file, for example: “Follow `.agents/skills/honest-seo-expert/SKILL.md`”.

Then describe what you want:

```text
@performance-expert — The homepage feels slow. Fix it.

@honest-seo-expert — Add metadata and JSON-LD for the about page.
```

**Experts fix code by default.** Add **audit only** if you want a report without changes.

### Library skills

Reference docs for tools already in this template.

| Skill                  | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `daisyui`              | Correct daisyUI 5 classes, themes, and components  |
| `eminence-astro-suite` | Head tags, SEO config, favicons, manifest, sitemap |

### Expert skills

Specialists that diagnose problems and implement fixes.

| Skill                  | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `performance-expert`   | Speed, Core Web Vitals, images, fonts, bundles      |
| `honest-seo-expert`    | Honest SEO, metadata, structured data, alt text     |
| `security-expert`      | Vulnerabilities, secrets, server actions, Workers   |
| `accessibility-expert` | Keyboard access, contrast, screen readers (WCAG AA) |
| `ux-expert`            | Forms, navigation, clarity, mobile usability        |
| `conversion-designer`  | Layout, CTAs, and visuals aimed at your page goal   |

## Project Structure

```text
/
├── .agents/
│   ├── EXPERTS.md                 # How to use skills (all AI tools)
│   └── skills/                    # Opt-in AI instruction files
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── instructions/
│   ├── workflows/
│   ├── labels.json
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── SECURITY.md
│   └── SUPPORT.md
├── .husky/
├── .vscode/
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── project.inlang/
│   ├── cache/
│   ├── project_id
│   ├── README.md
│   └── settings.json
├── messages/
│   ├── en.json
│   └── es.json
├── public/
├── src/
│   ├── actions/
│   ├── assets/
│   ├── components/
│   │   ├── Fonts.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── LanguageSwitcher.astro
│   │   └── SkipToContent.astro
│   ├── content/
│   ├── env.d.ts
│   ├── fonts/
│   ├── forms/
│   ├── layouts/
│   ├── lib/
│   ├── middleware.ts
│   ├── pages/
│   ├── paraglide/                 # AUTO-GENERATED - do not edit by hand
│   ├── styles/
│   ├── tests/
│   └── types/
├── svelte.config.js
├── tsconfig.json
├── worker-configuration.d.ts       # AUTO-GENERATED by Wrangler types
└── wrangler.jsonc
```

## Available Commands

All commands are run from the project root.

| Command                  | Action                                                     |
| :----------------------- | :--------------------------------------------------------- |
| `pnpm dev`               | Generate Wrangler types, then start Astro dev              |
| `pnpm build`             | Build the site (Paraglide compiles via the Vite plugin)    |
| `pnpm preview`           | Build and preview the production build locally             |
| `pnpm astro`             | Run Astro CLI directly                                     |
| `pnpm generate-types`    | Generate Wrangler types                                    |
| `pnpm cf-typegen`        | Generate Wrangler types (alias)                            |
| `pnpm deploy`            | Build and deploy with Wrangler                             |
| `pnpm format`            | Format the whole codebase with Prettier                    |
| `pnpm format:check`      | Check formatting without changing files                    |
| `pnpm test`              | Run Vitest once                                            |
| `pnpm test:watch`        | Run Vitest in watch mode                                   |
| `pnpm github:ci`         | Run formatting check, Astro check, and tests               |
| `pnpm all`               | Run format, type generation, Astro check, tests, and build |
| `pnpm machine-translate` | Run Inlang machine translation                             |
