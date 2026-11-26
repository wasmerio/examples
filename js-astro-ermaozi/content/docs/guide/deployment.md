---
title: 部署站点
description: 将 ermaozi 部署到 GitHub Pages、GitLab Pages、Netlify、Vercel、Firebase 或其他静态托管平台。
permalink: /docs/guide/deployment/
type: doc
group: 指南
order: 20
createTime: 2026-08-07
tags: [部署, GitHub Pages, Netlify, Vercel]
---

# 部署站点

ermaozi 默认生成纯静态站点。构建命令是 `npm run build`，发布目录是 `dist`；pnpm 和 Yarn 使用同名脚本。

## 创建时生成部署配置

运行创建器并在“部署方式”中选择平台：

```sh
npm create astro-theme-ermaozi
```

创建器会按当前包管理器生成最小配置：

| 选项 | 生成文件 | 部署方式 |
| --- | --- | --- |
| GitHub Pages | `.github/workflows/deploy.yml` | 推送 `main` 后由 GitHub Actions 构建和发布 |
| GitLab Pages | `.gitlab-ci.yml` | 默认分支的 Pipeline 构建和发布 `dist` |
| Netlify | `netlify.toml` | 导入仓库后自动读取构建命令和目录 |
| Vercel | `vercel.json` | 导入仓库后按 Astro 静态站点部署 |
| Firebase Hosting | `firebase.json`、`.firebaserc` | 本地构建后运行 `firebase deploy` |
| Custom | 不生成平台文件 | 手动把 `dist` 交给任意静态托管服务 |

这些文件只负责构建与发布，不会保存访问令牌。GitHub Pages 工作流使用 OIDC 权限；其他平台使用仓库或平台本身的授权。

## 域名和子路径

发布前检查 `site.config.mjs`：

```js
origin: 'https://blog.example.com',
base: '/',
```

- `origin` 是包含协议、不含路径的生产域名，用于 canonical、站点地图和分享卡片。
- `base` 是部署子路径。自定义域名通常使用 `/`；站点位于 `https://example.com/project/` 时使用 `/project/`。
- CI 可以用 `SITE_ORIGIN` 和 `BASE_PATH` 临时覆盖这两个值。创建器生成的 GitHub Pages 和 GitLab Pages 配置已经自动处理默认 Pages 地址。

修改 `base` 后，本地预览地址也会带上该前缀。站内链接、图片、搜索、Markdown 源文、站点地图和 SEO 地址都会使用同一前缀。

## GitHub Pages

1. 将仓库推送到 GitHub，默认分支命名为 `main`。
2. 在仓库的 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。
3. 推送代码或手动运行 `Deploy to GitHub Pages` 工作流。

默认工作流自动识别用户站点和项目站点。如果配置了自定义域名，把工作流中的 `SITE_ORIGIN` 改成真实域名，并把 `BASE_PATH` 改为 `/`。

## GitLab Pages

将仓库推送到 GitLab。默认分支的 Pipeline 会读取 `CI_PAGES_URL`，构建站点并通过 `pages.publish: dist` 发布。构建完成后可在 **Deploy → Pages** 查看地址。

## Netlify 和 Vercel

在平台控制台导入仓库即可。生成的配置已固定发布目录为 `dist`；静态站点不需要 Astro 服务端适配器。使用自定义域名时，记得同步修改 `origin`。

## Firebase Hosting

先安装并登录 Firebase CLI：

```sh
npm install --global firebase-tools
firebase login
npm run build
firebase deploy
```

创建器会询问 Firebase 项目 ID 并写入 `.firebaserc`。如果项目后来更换，请同步修改其中的 `projects.default`。

## 其他静态托管平台

使用以下通用设置：

```text
构建命令：npm run build
发布目录：dist
Node.js：22.12 或更高版本
```

本地可以先运行 `npm run build && npm run preview` 检查构建产物。`preview` 只用于验收，不应作为生产服务器。
