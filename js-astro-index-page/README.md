<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Momo-Index](https://github.com/Motues/IndexPage) Astro theme by Motues, copied from commit `002bdec536b5d9f12012bfa767673b3bdedd1b8a` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-index-page.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [Motues](https://github.com/Motues), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Index Page

一个极简的个人首页模板，使用 [Astro](https://astro.build/) 搭建

## 💻 环境要求
- Node.js （建议版本大于20.x）
- pnpm （使用 `npm -g pnpm` 安装）

## 🚀 快速开始

1. 克隆本项目
    ```bash
    git clone https://github.com/Motues/IndexPage.git
    cd IndexPage
    ```
2. 运行 `pnpm install` 安装依赖
3. 运行 `pnpm dev` 启动开发服务器，或者运行 `pnpm build` 构建项目

## 🔨 配置

网站配置文件在 `src/config.ts` 中，你可以修改里面的内容来配置你的个人主页；网站根路径需要在 `astro.config.mjs` 中配置

**网站根路径**

配置文件为 [`astro.config.mjs`](astro.config.mjs) ，通过修改 `defineConfig.site` 属性来设置网站根路径

**网站基本信息**

配置文件为 [`/src/config.ts`](./src/config.ts) ，`siteConfig` 记录网站的配置信息，包括网站标题、图标、背景等，`profileConfig` 存储个人资料信息，包括头像、姓名、简介等

**页脚**

页脚文件为 [`/src/components/Footer.astro`](./src/components/Footer.astro) ，`Footer` 组件记录了页脚的基本信息，可以自行修改


## ⚡ 指令

以下所有的指令可以在根目录下面执行

| 指令 | 作用 |
| --- | --- |
| `pnpm instal` | 安装依赖 |
| `pnpm dev` | 启动本地服务器，运行在 `http://localhost:4321` |
| `pnpm build` | 构建发布版本到 `./dist` 目录下 |
| `pnpm preview` | 预览构建后的发布版本 |
| `pnpm astro ...` | 运行 `astro` 命令，例如 `astro add` |


## 📜 TODO

- [ ] 优化背景图片样式
- [X] 添加黑暗模式
- [ ] 添加国际化（i18n）
