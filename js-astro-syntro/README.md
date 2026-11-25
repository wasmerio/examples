<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Syntro](https://github.com/bekturaslan/syntro-astro) Astro theme by bekturaslan, copied from commit `1dc5ccd9777ac858654657d0b93e45e6899a9bed` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-syntro.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [bekturaslan](https://github.com/bekturaslan), GPL-3.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# SaaS & Startup Astro & Tailwind CSS Template

## License

This template is open-source software licensed under the [GPL-3.0 license](https://opensource.org/licenses/GPL-3.0). You are free to fork, modify, and use it in your projects.

## Attribution

Originally created by Michael Andreuzza. Modified, extended, and redistributed by Bektur Aslan with added sections and updated UI/UX for broader usage.

## This template is using Tailwind CSS V4

Now we are using only a CSS file. It's called `global.css` and it's located in the src/styles folder. Now we are eimporting Tailwind CSS on the same file instead of using the `tailwind.config.cjs` file. Like this:

```css
// Importing Tailwind CSS
@import "tailwindcss";
// Importing Tailwind plugins
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
```

Then to add your styles you will use the @theme directive. Like this:

```css
@theme {
  /* Your CSS goes here, see how styles are written on the global.css file */
}
```

Remember this is just in Alpha version, so you can use it as you want. Just keep an eye on the changes that Tailwind CSS is going to make.

## Template Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## Want to learn more?

Feel free to check Astro's [documentation](https://docs.astro.build)

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bekturaslan/syntro-astro)

---
Maintained & updated by Bektur Aslan. Contributions welcome.
