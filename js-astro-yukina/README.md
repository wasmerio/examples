<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Yukina](https://github.com/WhitePaper233/yukina) Astro theme by WhitePaper233, copied from commit `4077d8c17fcb7429dcdd5e3f8577bcf6150b52fa` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-yukina.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [WhitePaper233](https://github.com/WhitePaper233), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Yukina

Simple and Elegant Astro Blog Template

![Preview](https://s2.loli.net/2025/01/26/S4URrsj9TFgOKAp.webp)

[中文](https://github.com/WhitePaper233/yukina/blob/main/README_zh.md)

## Demo Preview Links

[🖥️ Live Demo (Vercel)](https://yukina-blog.vercel.app) |
[🖥️ WhitePaper233's Blog (possibly not the latest version)](https://whitepaper233.top/)

## 🛠️ Build Guide

### 1. Install Node.js version 22 or above

Go to the [Node.js official website](https://nodejs.org/) to download and install the latest version of Node.js.

### 2. Enable Corepack

```bash
corepack enable
```

### 3. Install pnpm

```bash
corepack enable pnpm
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Build Search Index

```bash
pnpm build
```

### 6. Start Development Server

```bash
pnpm dev
```

### 7. Build Project

```bash
pnpm build
```

### 8. Preview Project

```bash
pnpm preview
```

## 🗺️ Roadmap

### Recent

✅ - Completed | 🧪 - In Testing | 🚧 - In Progress | ⏳ - Planned

| Status | Project                                             |
| ------ | --------------------------------------------------- |
| 🧪     | Basic feature implementation                        |
| 🧪     | Refactoring some code, optimizing overall structure |
| 🧪     | Optimizing animation effects                        |
| 🧪     | Mobile adaptation                                   |
| 🚧     | Optimizing website performance                      |
| 🧪     | Adjustable colors                                   |
| 🧪     | Adding RSS, SiteMap, and other features             |
| 🧪     | More build options (e.g., SLUG generation methods)  |
| ⏳     | Adding Live2D character                             |
| 🧪     | Search functionality                                |
| 🧪     | i18n                                                |

### Long-term

| Status | Project                                        |
| ------ | ---------------------------------------------- |
| ⏳     | Developing an easy-to-manage CLI and small CMS |
| ⏳     | Slidev components                              |
| ⏳     | More Markdown components                       |

## 🙏 Special Thanks

- [Hexo Shoka Theme](https://github.com/amehime/hexo-theme-shoka) for providing design ideas

- [Astro Fuwari Template](https://github.com/saicaca/fuwari) for providing the main design ideas and some code implementations
