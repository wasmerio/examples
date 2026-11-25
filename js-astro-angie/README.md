<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Angie](https://github.com/anthonylan/angie) Astro theme by anthonylan, copied from commit `acd67f64d91a9560156c9730a77cb18560dde437` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-angie.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 2 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [anthonylan](https://github.com/anthonylan), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Angie

ANGIE is a sleek Astro portfolio template built for creatives and developers. Featuring responsive layouts, customizable sections, and a bold brutalist design, it’s made to help you stand out and showcase your work with style.

![basics](./src/assets/demo/thumbnail.png)

### Dependencies used in this project:

- [TailwindCSS](https://tailwindcss.com/)
- [GSAP](https://gsap.com/)
- [Remix Icon](https://remixicon.com/)

### Credits:

- [Pexels images](https://www.pexels.com/)
- [Design inspo](<https://www.figma.com/design/YHGwlMXQLVCE3mTF4JVA5I/2024-Portfolios-(Community)?node-id=1-914&t=6JAt4v8pqxzppZ0b-0>)

Inside of your Astro project, you'll see the following folders and files:

```text

├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Bars.astro
        └── Button.astro
        └── CallToAction.astro
        └── Footer.astro
        └── Header.astro
        └── Hero.astro
        └── MarddownPost.astro
        └── Reviews.astro
        └── Service.astro
        └── Tools.astro
        └── Work.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
        └── posts/
        └── blog.astro
        └── index.astro
└── styles/
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `npm install`   | Installs dependencies                       |
| `npm run dev`   | Starts local dev server at `localhost:4321` |
| `npm run build` | Build your production site to `./dist/`     |

## 👀 Curious to Explore More?

Check out [LAB-CH3](https://github.com/LaB-CH3) for a growing collection of current and future templates.

If you’ve found this helpful, consider fueling my creativity!  
[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://ko-fi.com/indieteamofone)
