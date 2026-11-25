<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Smallworld](https://github.com/anaxite/astro-smallworld) Astro theme by anaxite, copied from commit `9dd74bf346800adcff0c5444ee64bd072c4ccef4` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-smallworld.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - The theme has no lockfile, so this folder adds a package-lock.json generated with npm.
- **Environment variables:** None.
- **Credit:** theme by [anaxite](https://github.com/anaxite), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# smallworld

_This is a template for the static site generator [Astro](https://astro.build/). Now updated for Astro 7!_

I like Astro, but I don't like spending hours customizing styles. I made this template based on a few key principles:

- I want a basic website with a single-author blog.
- The website should incorporate accessible and usable elements.
- Avoid complex systems, prefer simpler ones.
- Things I see should be easy to understand.

The result is an Astro template that barely uses CSS classes, and maximizes the use of semantic HTML.
It not only makes for a functional site, but is also great to start learning how Astro works!

## Quickstart

```shell
npm create astro@latest -- --template anaxite/astro-smallworld
cd astro-smallworld
npm run dev
npm run build
```

## Less quick start

### Install

1. Install Astro:

```shell
npm create astro@latest -- --template anaxite/astro-smallworld
```

2. Install this template's dependencies, if you didn't already:

```shell
cd <install-directory>
npm install
```

3. Run the template in preview mode, or build the final output.

```shell
npm run dev
npm run build
```

4. Optionally, format your source files with Prettier.

```shell
npm run format
```

### Configure site settings

Site-wide settings are stored in `src/settings.ts`. This is also where you can set the favicon file name, and Open Graph image settings.

### Configure CSS

The file `src/styles/main.scss` controls which CSS elements Pico CSS includes in the final site. See [the Pico CSS website](https://picocss.com/docs/sass) for information about these elements. 

> A site build may show Pico CSS warnings. These warnings are generally non-fatal and can be ignored. 

### Add and edit pages

Create your static pages as `.astro` files under `src/pages`. The template includes an index page with the most recent blog posts, an About page, and a 404 page.

Use the Base layout to wrap your content in semantically-correct `<main>` tags. The Base layout also takes `title` and `description` attributes that supplement the main site title and description. If you want your content to have a nice border, I recommend you wrap it in `<article>` tags to benefit from Pico CSS styling.

To start with a basic page template, see the file in `src/templates`.

### Edit navigation

To add a page to the site navigation, edit the `PageHeader.astro` component directly.

### Blog

smallworld comes with a blog collection by default. To add a new post, create a Markdown file in the `src/content/blog` directory or one of its subdirectories. The path and file name becomes the post URL.

A post must have `title`, `description` and `pubDate` keywords in its frontmatter. `tags` are optional.

To see a post template, see the file in `src/templates`.

## Notes

For your convenience, I added a few tooling things:

- Any Node.js package manager supported by Astro should work. I include a bit of PNPM config by default.
- This project comes with a `mise-en-place` configuration file.

## About Astro

Want to learn more about Astro? Check out [their documentation](https://docs.astro.build) or jump into their [Discord server](https://astro.build/chat).
