---
title: How to use this template
description: A brief guide on the things you'll find in this template
pubDate: 2025-01-19
tags:
  - astro
  - markdown
  - template
  - howto
---

This post explains how to use the `smallworld` template.

## Quickstart

```shell
npm create astro@latest -- --template anaxite/astro-smallworld
cd astro-smallworld
npm run dev
npm run build
```

## How to use

### Install

1. Install Astro.

```shell
npm create astro@latest -- --template anaxite/astro-smallworld
```

2. Install this template's dependencies, if you didn't already.

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

If you use mise-en-place for your tooling, this project comes with a mise configuration file.

### Configure site settings

Site-wide settings are stored in `src/settings.ts`. This is also where you can set the favicon file name, and Open Graph image settings.

### Configure CSS

The file `src/styles/main.scss` controls which CSS elements Pico CSS includes in the final site. See [the Pico CSS website](https://picocss.com/docs/sass) for information about these elements.

> Building your project may show deprecation warnings due to how Pico CSS writes its SASS files. These warnings are non-fatal and can be ignored for now..

### Add and edit pages

Create your static pages as `.astro` files under `src/pages`. The template includes an index page with the most recent blog posts, an About page, and a 404 page.

Use the Base layout to wrap your content in semantically-correct `<main>` tags. The Base layout also takes `title` and `description` attributes that supplement the main site title and description. If you want your content to have a nice border, I recommend you wrap it in `<article>` tags to benefit from Pico CSS styling.

To start with a basic page template, see the file in `src/templates`.

### Navigation

To add a page to the site navigation, edit the `PageHeader.astro` component directly.

### Blog

smallworld comes with a blog collection by default. To add a new post, create a Markdown file in the `src/content/blog` directory or one of its subdirectories. The path and file name becomes the post URL.

A post must have `title`, `description` and `pubDate` keywords in its frontmatter. `tags` are optional.

To see a post template, see the file in `src/templates`.
