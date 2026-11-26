<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Starter Juzraai](https://github.com/juzraai/astro-starter) Astro theme by juzraai, copied from commit `4202d04b31494141de0dc7782c27c86611bfdb03` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-starter-juzraai.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [juzraai](https://github.com/juzraai), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# juzraai's Astro Starter 🚀

This is an example / template respository which we can use to start an Astro 3 project with Tailwind CSS.

## What's included

-   [Astro](https://astro.build/) (v3) minimal template with [TypeScript](https://www.typescriptlang.org/) support
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Prettier](https://prettier.io/) with
    -   [Astro plugin](https://github.com/withastro/prettier-plugin-astro)
    -   and VS Code settings for auto-formatting on save
-   [ESLint](https://eslint.org/) with
    -   [Astro plugin](https://github.com/ota-meshi/eslint-plugin-astro)
    -   [Tailwind CSS plugin](https://github.com/francoismassart/eslint-plugin-tailwindcss)
    -   [XO config](https://github.com/xojs/eslint-config-xo)
    -   [disabled formatting](https://github.com/prettier/eslint-config-prettier)
    -   and VS Code settings for auto-fixing on save
-   [VS Code](https://code.visualstudio.com/) extension recommendations

## How to use

-   Click on the _"Use this template"_ button and select _"Create a new repository"_
-   Clone your new repo
-   Open the working copy in VS Code
-   Install the extensions listed in `.vscode/extensions.json`:
    -   [Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
    -   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    -   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    -   [Tailwind CSS](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
-   Install [Node.js](https://nodejs.org/), Astro requires at least v18
-   Run `npm i -g pnpm` to install [PNPM](https://pnpm.io/) for faster dependency management
-   Run `pnpm i` to install dependencies
-   Reload VS Code window (command palette can help you, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>)
-   Edit the project name in `package.json`
-   Edit your name in `LICENSE` file
-   Customize the ESLint, Prettier or VSCode configs to fit your needs
-   Run `pnpm dev` and start developing your Astro project 🚀
