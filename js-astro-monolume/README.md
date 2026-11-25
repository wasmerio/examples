<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Monolume](https://github.com/heshify/monolume) Astro theme by heshify, copied from commit `d2e0501dd6eff4c7253e23cb94ec7366c2581b5e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-monolume.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [heshify](https://github.com/heshify), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Monolume

Monolume is a clean, modern portfolio theme built with Astro.
It’s designed for developers, designers, and freelancers who want to showcase their work with style

## Demo

[Live Preview](https://monolume.vercel.app)

✨ Features

- Minimal, bold typography
- Responsive & mobile-friendly
- Work/projects showcase layout
- Blog support
- Contact form
- SEO-friendly
- Built with Astro + Tailwind CSS (easy to customize)

## Tech Stack

- [Astro](https://astro.build/) – Static site builder
- [TypeScript](https://www.typescriptlang.org/) – Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text

├── public/
├── src/
│   ├── components/
    │   ├── About.astro
│   │   ├── Card.astro
│   │   ├── Contact.astro
│   │   ├── Footer.astro
│   │   ├── FormattedDate.astro
│   │   ├── Head.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Posts.astro
│   │   └── Projects.astro
│   ├── content/
│   │   ├── blog/
│   │   └── projects/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── blog
│   │   │   ├── [...id].astro
│   │   │   └── index.astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   └── projects
│   │       ├── [...id].astro
│   │       └── index.astro
│   └── styles/
│       └── global.css
    ├── consts.ts
│   ├── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## ❤️ Like this theme?

If you found this theme useful, check out more free and premium themes at  
👉 https://themes.mhsh.in
