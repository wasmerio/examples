<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Terminal](https://github.com/dennisklappe/astro-theme-terminal) Astro theme by dennisklappe, copied from commit `1e7441aecf95620216aeac05bedd0d7d762e23b0` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-terminal.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Set `base` to `/` in astro.config.mjs: the theme switches to its GitHub Pages sub-path in production builds, which makes every asset 404 at the root of a Wasmer app.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [dennisklappe](https://github.com/dennisklappe), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Terminal Theme

I love both Astro and the Terminal theme by panr, so I decided to port this theme to Astro. This is an adaptation of the [Hugo Terminal Theme](https://github.com/panr/hugo-theme-terminal) created by [panr](https://github.com/panr). All design credit goes to the original author.

![Terminal Theme Screenshot](https://panr.github.io/hugo-theme-terminal-demo/img/terminal-css.png)

- [Demo site](https://dennisklappe.github.io/astro-theme-terminal/)
- [Terminal.css - Create your own colour scheme](https://panr.github.io/terminal-css/)

## Features

- **Customisable colour schemes** — works with panr's [Terminal.css colour scheme generator](https://panr.github.io/terminal-css/) or choose from the default schemes available there
- **[Fira Code](https://github.com/tonsky/FiraCode)** as default monospaced font — easily changeable
- **nice syntax highlighting** — thanks to Astro's built-in Shiki support
- **fully responsive** — works great on mobile and desktop
- **tag support** — organise posts with tags and browse by tag
- **RSS feed** — automatically generated RSS feed for your blog

## Requirements

- Astro v5.0.0 or higher
- Node.js 18 or higher

## Installation

### Clone repository

```bash
git clone https://github.com/dennisklappe/astro-theme-terminal.git your-site-name
cd your-site-name
npm install
```

### Use as a template

You can also use this repository as a template on GitHub:

1. Click the "Use this template" button on the GitHub repository
2. Create a new repository from the template
3. Clone your new repository and install dependencies

## How to start

```bash
npm run dev
```

## How to build

```bash
npm run build
```

## Configuration

### Site Configuration

Edit `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://your-domain.com',
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      langs: [],
      wrap: true,
    },
  },
});
```

### Theme Configuration

The theme uses CSS custom properties for theming. To change colours, modify the variables in `src/styles/terminal.css`:

```css
:root {
  --background: #1e2022;
  --foreground: #d6deeb;
  --accent: #ffa86a;
  --secondary: #8be9fd;
  --selection: #4c5f7a;
  --code-border: #4c5f7a;
  --comment: #637777;
}
```

You can also use panr's [Terminal.css generator](https://panr.github.io/terminal-css/) to create your own colour scheme - this Astro port is fully compatible with the generated colour schemes.

### Navigation Menu

Edit the navigation in `src/layouts/BaseLayout.astro`. The theme includes a dropdown menu for additional pages:

```astro
<!-- Main navigation items -->
<li><a href="/about">About</a></li>
<li><a href="/posts/showcase">Showcase</a></li>

<!-- Dropdown menu -->
<ul class="menu__dropdown">
  <li><a href="/posts">Posts</a></li>
  <li><a href="/tags">Tags</a></li>
  <li><a href="/posts/rich-content">Rich Content</a></li>
</ul>
```

## Content

### Posts

Create posts in `src/content/posts/`:

```md
---
title: 'My First Post'
description: 'This is my first blog post'
pubDate: 2024-01-01
author: 'Your Name'
tags: ['astro', 'terminal']
---

Your content here...
```

### Pages

Create pages in `src/pages/`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About">
  <div class="page">
    <h1>About</h1>
    <p>Your content here...</p>
  </div>
</BaseLayout>
```

## Syntax Highlighting

The theme uses Astro's built-in Shiki syntax highlighter with a custom monochrome theme that matches the terminal aesthetic. Code blocks automatically get syntax highlighting:

```js
// JavaScript example
function hello() {
  console.log("Hello, World!");
}
```

## Layouts

### BaseLayout

The main layout that includes header, footer, and all necessary CSS imports.

### PostLayout

Layout specifically for posts, includes metadata display and post navigation.

## Components

- **Header** - Site header with terminal decoration
- **Footer** - Site footer with copyright
- **PostCard** - Post preview card
- **Pagination** - Page navigation component
- **FormattedDate** - Date formatting component

## Features

### Tags

Posts can be organised with tags. Each tag gets its own page at `/tags/[tag-name]` showing all posts with that tag. A tag index page at `/tags` displays all available tags.


## Customization

### Fonts

To change the monospace font, update the font import in `src/styles/fonts.css` and the font-family in `src/styles/terminal.css`.

### Colours

Create your own colour scheme or choose from the default schemes using panr's [Terminal.css generator](https://panr.github.io/terminal-css/).

### CSS Structure

The theme uses modular CSS files:
- `terminal.css` - Core theme styles and variables
- `fonts.css` - Font imports and utilities
- `main.css` - Layout and utility classes
- `header.css` - Header styles
- `menu.css` - Navigation menu
- `footer.css` - Footer styles
- `post.css` - Post styles
- `buttons.css` - Button components
- `code.css` - Code block functionality
- `syntax.css` - Syntax highlighting theme
- `pagination.css` - Pagination styles
- `gist.css` - GitHub Gist embed styles
- `terms.css` - Terms and conditions styles

## Deployment

### GitHub Pages

This theme includes a GitHub Actions workflow for automatic deployment to GitHub Pages:

1. Go to your repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to the `main` branch or manually trigger the workflow
4. Your site will be available at `https://[username].github.io/astro-theme-terminal`

To deploy to a custom domain or different base path, update the `site` and `base` options in `astro.config.mjs`.

**Note**: The base path is only applied in production builds. During development, the site runs at the root path (`/`) for easier testing.

## Contributing

If you find any bugs or have ideas for improvements, please open an issue or submit a pull request.

## Credits

This theme is a port of the [Hugo Terminal Theme](https://github.com/panr/hugo-theme-terminal) created by [panr](https://github.com/panr). All design decisions, colour schemes, and visual aesthetics are credited to the original author.

Astro port created by [Dennis Klappe](https://github.com/dennisklappe).

## License

The original Hugo Terminal Theme is licensed under the MIT License. This Astro port maintains the same licence.

Copyright for the original design: panr

---

Made with love for the Astro community