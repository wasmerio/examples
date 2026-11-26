<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Beauty Salon](https://github.com/LeoMartinK/beauty-salon-astro-template) Astro theme by LeoMartinK, copied from commit `21aeb79829a26841a2acb3d92f752c0afa740151` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-beauty-salon.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and runs the `@astrojs/node` standalone server on Wasmer Edge.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
  - Replaced the @astrojs/vercel adapter with @astrojs/node 9.5.3 in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Added a `start` script (`node ./dist/server/entry.mjs`) to package.json so Wasmer can start the Node server.
- **Environment variables:** None.
- **Credit:** theme by [LeoMartinK](https://github.com/LeoMartinK), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro-beauty-salon-template

Professional Beauty Salon Template built with Astro.

## 🏆 Credits
**Developed by:** [LeoMartinK Studio](https://lmkstudio.pages.dev)
> ⚠️ Keep the "Developed by LeoMartinK Studio" credit in the footer.

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | `astro dev` |
| `npm run build` | `astro build` |
| `npm run preview` | `astro preview` |
| `npm run astro` | `astro` |
| `npm run lint` | `eslint .` |
| `npm run lint:fix` | `eslint . --fix` |
| `npm run format` | `prettier --write .` |
| `npm run check` | `astro check` |

