---
title: '发布与迁移：把内容带到线上'
slug: 'migration'
date: 2025-08-02
description: '设置生产地址与发布状态，整理旧内容，构建并部署静态站点。'
categories: ['guide']
tags: ['astro', 'migration']
---

配置站点地址，检查发布状态，再构建并部署，即可把内容发布到线上。迁移已有博客时，可以先将文章和附件整理进 `content/`。

## 配置地址

将 `site.baseUrl` 设为完整的生产地址，例如 `https://example.org/`。子目录部署使用 `https://example.org/blog/`。

`site.localePrefixPolicy` 选择语言前缀策略，`posts.pathPrefix` 可以添加 `[year]/` 等文章路径片段。迁移旧站时，用 `slug` 保留文章标识，并在托管平台配置旧地址到新地址的重定向。

## 日期与发布状态

| 配置           | 发布效果                               |
| -------------- | -------------------------------------- |
| 已到发布时间   | 正常发布，进入列表、搜索与订阅         |
| `draft: true`  | 保存为草稿，在开发环境预览             |
| 未来日期       | 到期后重新构建时发布                   |
| `hidden: true` | 保留直达地址，从列表、搜索与订阅中隐藏 |

`date` 设置发布时间，`updated` 设置最后更新时间。迁移时也支持常见的日期别名，详见[Frontmatter](https://bloggpt.reincarnatey.net/content/frontmatter)。

## 整理旧内容

Markdown / MDX 文件可以放入 `content/posts/`，图片与附件可作为内容包一起管理。原系统的短代码和模板标签需要转换为 Markdown、HTML 或 MDX，分类与标签通过 slug 关联。文件组织方式见[内容组织](../content-bundle/)。

## 构建与预览

```sh title="Terminal"
pnpm build
pnpm preview
```

构建会检查类型，生成页面、附件、分享图和 Pagefind 搜索索引。预览后检查文章、图片、链接、语言切换和搜索效果。

## RSS 与 Sitemap

各语言分别提供 RSS，默认策略下可通过 `/zh/rss.xml`、`/en/rss.xml` 订阅。站点地图入口为 `/sitemap-index.xml`，收录公开页面的最终地址。

## 部署与更新

推荐使用 Vercel 连接 Git 仓库，自动构建并发布博客：

1. 将主题源码推送到自己的 Git 仓库，在 Vercel 导入项目。
2. Framework Preset 选择 `Astro`，Root Directory 保留为仓库根目录。
3. Install Command 填写 `pnpm install --frozen-lockfile`，Build Command 填写 `pnpm build`，Output Directory 填写 `dist`；Node.js 选择 `24.x`，添加环境变量 `ENABLE_EXPERIMENTAL_COREPACK=1`，应用到 Production 与 Preview。
4. 将 `site.baseUrl` 设为正式域名，提交配置并部署。后续向生产分支推送修改，Vercel 会自动构建和更新站点；其他分支可用于预览。

`pnpm build` 包含附件、分享图和 Pagefind 搜索索引的生成。预约文章到达发布时间后，再触发一次构建。使用其他静态托管服务时，也可以发布完整 `dist/`，配置目录索引与 404 页面。

详细步骤见[构建与部署](https://bloggpt.reincarnatey.net/guide/deployment)。
