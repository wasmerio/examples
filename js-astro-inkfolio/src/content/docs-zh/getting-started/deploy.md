---
title: 部署上线
order: 2
description: 任何静态托管都行。Cloudflare Pages、Netlify、Vercel 各两个设置就完。
---

`npm run build` 产出一包纯静态 HTML，在 `dist/`。没有服务端。

## Cloudflare Pages

1. 仓库推到 GitHub。
2. Pages → Create project → 选仓库。
3. 构建命令 `npm run build`，输出目录 `dist`。

## Netlify

同样两个值：构建 `npm run build`，发布目录 `dist`。

## Vercel

它自己认 Astro。确认输出目录是 `dist` 即可。

## 绑域名

域名指向托管商后，把 `site.config.yaml` 里的 `site.url` 改成新域名再部署一次。canonical、sitemap、RSS 全部跟着这一个值走，没有第二个文件要改。

> [!WARNING]
> 用预览地址部署、但 `site.url` 还指着生产域名时，预览页的 canonical 会指生产。通常这正是你想要的；如果不是，用 `SITE_URL=https://preview.example.com npm run build` 构建。

## 会发布什么

`dist/` 里的全部内容，包括构建时由 `site.url` 生成的 `/sitemap-index.xml` 和 `/robots.txt`。
