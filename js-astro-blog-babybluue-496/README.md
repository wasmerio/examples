<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro blog theme](https://github.com/babybluue/astro-blog-theme) Astro theme by babybluue, copied from commit `406b98caf42d602932a80605e05b90a28f2490cd` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-blog-babybluue-496.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
- **Environment variables:** None.
- **Credit:** theme by [babybluue](https://github.com/babybluue), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro blog

![Index](/src/data/images/c3009907.png)
![Lighthouse](/lighthouse.png)

## How to create a new post with abbrlink

`create.cjs` file will help to create a new post with params title and dir, the dir default is drafts.

```bash
 pnpm run new --title='title-test'
```

The command will generate a markdown file under _src/data_ directory, and the markdown file content will look like this:

```yaml
---
title: title-test
date: 2024-04-18T02:50:36.418Z
abbrlink: 21cdefe2
---
```

## How to generate transparent svg

`fix-svg-transparent.mjs` file will help to generate transparent svg.

```bash
 pnpm run svg
```

The command will remove the background rect element from the svg file under _src/assets_ directory

## How to generate icons and favicon

`generate-icons.mjs` file will help to generate icons and favicon.

```bash
 pnpm run icons
 # or
 pnpm run icons --padding # generate icons with padding
```

The command will generate icons under _public_ directory, including pwa-48.png, pwa-64.png, pwa-72.png, pwa-96.png, pwa-192.png, pwa-512.png and favicon.svg.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
