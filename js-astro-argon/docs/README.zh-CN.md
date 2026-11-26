# Astro-Argon Blog 使用说明（中文）

本项目基于 Fuwari 深度改造，已升级到 Astro 6 beta、Tailwind CSS 4、daisyUI 5，并调整为 Argon 风格主题体系。

## 环境要求

- Node.js `>= 24`
- pnpm `>= 10`

## 快速开始

```bash
corepack enable
corepack use pnpm@10.30.1
pnpm install
pnpm dev
```

默认访问：`http://localhost:4321`

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 生产构建并生成 Pagefind 搜索索引 |
| `pnpm preview` | 预览生产构建结果 |
| `pnpm check` | Astro 类型与内容检查 |
| `pnpm type-check` | TypeScript 检查 |
| `pnpm format` | Biome 格式化 |
| `pnpm lint` | Biome 检查并修复 |
| `pnpm new-post <slug>` | 创建新文章模板 |

## 关键配置文件

- 站点与主题配置：`src/config.ts`
- Astro 配置：`astro.config.mjs`
- 主样式入口：`src/styles/main.css`
- 主题变量：`src/styles/variables.styl`

## 文章 Frontmatter 示例

```yaml
---
title: 我的第一篇文章
published: 2026-02-26
description: 文章摘要
image: ./cover.png
tags: [Astro, Blog]
category: 技术
draft: false
---
```

## 搜索说明

- 开发环境优先使用本地 `search-index.json`。
- 生产环境使用 Pagefind 索引（`pnpm build` 后生效）。

## 部署说明

`deploy/` 目录已提供常见平台缓存头模板：

- `deploy/vercel/vercel.json`
- `deploy/cloudflare-pages/_headers`
- `deploy/nginx/astro-static-cache.conf`

## 主题 Token 维护

- 中文文档：`docs/THEME_TOKENS.zh-CN.md`
- 英文文档：`docs/THEME_TOKENS.en.md`
