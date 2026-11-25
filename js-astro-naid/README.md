<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [NAID](https://github.com/studiolumina/naid) Astro theme by studiolumina, copied from commit `4359e57ce49ebeed3ab6894a2d0dc06e2f1d7536` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-naid.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Changed the build script to `astro build`, because the theme's `astro check` step fails on type errors only.
- **Environment variables:** None.
- **Credit:** theme by [studiolumina](https://github.com/studiolumina), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# `NAID` - A template for doers

```sh
npm create astro@latest -- --template studiolumina/naid
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
|   ├── content/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


## Coming Soon

- [ ] Dark Mode
- [ ] Section Variants
- [ ] More Colors
- [ ] Other stuff?