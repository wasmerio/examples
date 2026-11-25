<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro E-commerce](https://github.com/creativetimofficial/astro-ecommerce) Astro theme by creativetimofficial, copied from commit `42cfca7c13ba5328d82ae35e27d6f5362ed43e5f` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-ecommerce.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed `base: '/astro-ecommerce'` from astro.config.mjs: it is the GitHub Pages sub-path, and with it every asset 404s at the root of a Wasmer app.
  - Resized 7 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Set `site` in astro.config.mjs to the Wasmer demo URL, because 13 home page links pointed at www.creative-tim.com.
- **Environment variables:** None.
- **Credit:** theme by [creativetimofficial](https://github.com/creativetimofficial), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Welcome to [Astro Ecommerce](https://www.creative-tim.com/astro)

![version](https://img.shields.io/badge/version-1.1.0-blue.svg) [![GitHub issues open](https://img.shields.io/github/issues/creativetimofficial/astro-ecommerce.svg?maxAge=2592000)](https://github.com/creativetimofficial/astro-ecommerce/issues?q=is%3Aopen+is%3Aissue) [![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/creativetimofficial/astro-ecommerce.svg?maxAge=2592000)](https://github.com/creativetimofficial/astro-ecommerce/issues?q=is%3Aissue+is%3Aclosed)

![basics](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/astro-ecommerce/astro-ecommerce-1.jpg)

## Description

Introducing **Astro Ecommerce**, the ultimate starter template for your e-commerce web project. Built on Astro's next-gen island architecture, Astro Ecommerce offers a sleek and modern design with a wide range of components and features to help you create a stunning online store.

**Main Features**
Build your e-commerce website quickly and efficiently with:
- 70+ fully coded elements
- 3 fully coded example pages
- 30+ blocks
- Responsive design

**Example Pages**
We created a set of pre-built pages to help you get inspired or show something to your clients. See them below:
- [Landing Page](https://demos.creative-tim.com/astro-ecommerce/landing/): Designed to introduce the website's purpose and encourage the user to take an action.
- [Product Page](https://demos.creative-tim.com/astro-ecommerce/product/): It's designed to give the user all the information they need to make a purchase decision
- [Shopping Page](https://demos.creative-tim.com/astro-ecommerce/shopping-cart/): Includes a summary of the items in the cart and a form for billing and shipping information.
- more+

Astro Ecommerce has everything you need to create the e-commerce website of your dreams.


## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── incentives/
│   │   ├── order/
│   │   ├── products/
│   │   ├── promo/
│   │   ├── reviews/
│   │   ├── store/
│   │   ├── dashboardContext.tsx
│   │   ├── footer.tsx
│   │   └── navbar.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro
│       ├── landing.astro
│       ├── product.astro
│       └── shopping-cart.astro
├── package.json
├── README.md
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `npm install`          | Installs dependencies                              |
| `npm run dev`          | Starts local dev server at `localhost:3000`        |
| `npm run build`        | Build your production site to `./dist/`            |
| `npm run preview`      | Preview your build locally, before deploying       |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `npm run astro --help` | Get help using the Astro CLI                       |

#### Social Media

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

TikTok: <https://tiktok.com/@creative.tim>

Instagram: <https://instagram.com/creativetimofficial>

## 👀 Want to learn more?

Feel free to check [our documentation](https://www.creative-tim.com/learning-lab/astro/overview/astro-ecommerce) or jump into our [Discord server](https://discord.com/invite/TGZqBvZB).
