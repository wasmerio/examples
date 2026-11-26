---
title: Theme Installation Guide
categories: [Theme Introduction]
description: Star Read is an excellent, concise and elegant Astro blog theme that provides multiple installation methods, has a clear project structure, and features modern UI, search support, responsive design, theme switching, etc. It also provides detailed configuration for search, theme customization and comment systems.
cover: /cover/2c614caca4dd46a2.avif
date: 2026-06-30 12:58:33
---

<div align="center">
  <img src="/logo.png" alt="starread" border="0">
  🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 Chinese Document | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>

# Star Read - Astro Blog Theme

>An Astro theme that is as bright as starlight, yet concise and premium

## 🚀 Features

- 🎨 Modern UI design
- 🔍 Automatically creates local index, supports local offline search and Algolia online search
- 📱 Responsive design, adapts to mobile phones and PCs
- 🌙 Automatic dark/light theme switching
- 🏷️ Tag and category support
- 📊 Article statistics and author information display

## 📂 Project Structure

```text
/
├── src/
│   ├── components/     # Component files
│   ├── content/        # Content configuration
│   ├── layouts/        # Layout templates
│   ├── pages/          # Page routes
│   └── styles/         # Style files
├── public/             # Static assets
└── dist/               # Build output
```

## 📦 Installation

### Method 1: Initialize via CLI tool

| Package Manager | Recommended Command |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` or `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (requires Yarn v2+) |

>[!note]
>We provide the `create` command for users to create the theme in a specified folder

1. Create a project: Choose one of the following commands based on your package manager:

```bash
# Using pnpm
pnpm create astro-theme-starread my-blog

# Using npm
npx create-astro-theme-starread my-blog

# Using yarn
yarn create astro-theme-starread my-blog

# Using cnpm
cnpm init astro-theme-starread my-blog
```

2. Enter the project directory:

```bash
cd my-blog
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

### Method 2: Install using `astro` template

>[!warning]
>This method requires access to the Github repository, ensure network connectivity.

| Package Manager | Command |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### Method 3: Source code installation

>[!warning]
>This method requires access to the Github repository, ensure network connectivity.

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>After installation, run the development server:
```bash
pnpm dev
```

### Method 4: Install as a dependency into an existing Astro project

You can install the theme as a dependency into an existing Astro project and use its components, layouts and pages directly from node_modules.

1. **Install the theme package**:

```bash
# Using pnpm
pnpm add astro-theme-starread

# Using npm
npm install astro-theme-starread

# Using yarn
yarn add astro-theme-starread
```

2. **Import and use components directly from node_modules**:

```astro
---
// Import components directly from the theme in node_modules
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>My Astro Blog</title>
    <!-- If you need to use theme styles -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- Use the NavBar component from node_modules -->
    <NavBar />
    
    <!-- Use the ThemeToggle component from node_modules -->
    <ThemeToggle />
    
    <article>
      <!-- Use the ArticleInfo component with properties -->
      <ArticleInfo 
        title="My Article"
        date="2024-01-01"
        author="Author Name"
      />
      <p>Article content...</p>
    </article>
    
    <aside>
      <!-- Use sidebar components -->
      <AuthorWidget />
      <TagCloud />
    </aside>
  </body>
</html>
```

3. **Use layouts directly from node_modules**:

```astro
---
// Import layouts directly from the theme in node_modules
import { article as ArticleLayout } from 'astro-theme-starread';

// Apply the layout from node_modules
export const layout = ArticleLayout;

// Your content
export const content = {
  title: "My Blog Post",
  date: "2024-01-01",
  author: "Author Name",
  tags: ["Tech", "Blog"]
};
---

<!-- This content will be rendered in the node_modules layout -->
<main>
  <p>This is the content of my blog post. It will be rendered in the theme's article layout.</p>
</main>
```

## 🧞 Commands

| Command | Description |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | Install dependencies |
| `pnpm dev`               | Start local development server `localhost:4321` |
| `pnpm preview`           | Preview build results locally |
| `pnpm algolia`           | Push data to Algolia search |
| `pnpm release`           | Version management (update version number, generate commits, etc.) |

## 🔍 Search

Go to [Search](/search)

## ⚙️ Custom Configuration

Go to [Custom Configuration](/configure)


## 🔧 Twikoo Comments

>[!tip]
>If you need to enable twikoo, please modify line 13 `envId` in `src/compponents/Comment.astro` to your [twikoo environment address](https://twikoo.js.org/backend.html).

```js
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.twikoo) {
      window.twikoo.init({
        envId: 'https://example.com',// Your environment address
        el: '#tcomment',
        path: window.location.pathname
      });
    } else {
      console.error('Twikoo failed to load, please check the twikoo local location or CDN address');
    }
  });
</script>
```
