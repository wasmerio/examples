<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Nikola Tesla](https://github.com/iann-mathaiya/nikola-tesla) Astro theme by iann-mathaiya, copied from commit `1d6567c2d8d46a24214dc103a3906db0cb6a6cd2` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-nikola-tesla.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and runs the `@astrojs/node` standalone server on Wasmer Edge.
- **Changed for Wasmer:**
  - Replaced the @astrojs/vercel adapter with @astrojs/node 9.4.5 in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Added a `start` script (`node ./dist/server/entry.mjs`) to package.json so Wasmer can start the Node server.
- **Environment variables:** None.
- **Credit:** theme by [iann-mathaiya](https://github.com/iann-mathaiya), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Nikola Tesla Portfolio
Nikola Tesla Portfolio is an Astro template built with of course Astro 5.7, React 19 and TailwindCSS 4

![Nikola Tesla Astro Portfolio](/public/social-image.jpg "Nikola Tesla Portfolio")

## Getting Started
Clone Repository
```sh
git clone https://github.com/iann-mathaiya/nikola-tesla.git
```

Install Dependencies
```sh
pnpm install
```

Development
```sh
pnpm run dev
```

Build
```sh
pnpm run build
```

Preview
```sh
pnpm run preview
```

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
│   └── social-image.svg
├── src/
│   ├── actions/
│   │   └── # Astro server actions
│   ├── assets/
│   │   └── # Images that are transformed, optimized and bundled by Astro 
│   ├── components/
│   │   └── # Astro and React components
│   ├── layouts/
│   │   └── RootLayout.astro
│   └── pages/
│   │   └── blog/
│   │   │   └── index.astro
│   │   │   └── [...slug].astro
│   │   └── about.astro
│   │   └── contact.astro
│   │   └── index.astro
│   │   └── projects.astro
│   └── styles/
│   │   └── global.css
└── .gitignore
└── astro.config.mjs
└── package.json
└── tsconfig.json
```

## Deployment
The site is configured for deployment on Vercel, but with slight modifications it can be deployed to any hosting service.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## ⛔️ Changes
The template also uses [React Paper Shaders](https://github.com/paper-design/shaders). 
The Paper Team will be publishing [breaking changes](https://github.com/paper-design/shaders?tab=readme-ov-file#getting-started) to the Shaders library under 0.0.x versioning so check back to get updates when they release Paper Shaders v1.