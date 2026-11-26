---
title: 部署上线与开启评论
description: 静态构建的部署方式，以及用 Giscus 接入 GitHub Discussions 评论。
date: 2026-08-14
tags:
  - 部署
  - Giscus
  - Broadsheet
cover: https://picsum.photos/id/48/1400/900
---

Broadsheet 构建出的是纯静态站点，没有服务端运行时，任何静态托管都能跑。

## 构建

```bash
pnpm build    # 先做类型检查，再构建，最后生成搜索索引
pnpm preview  # 本地预览构建产物
```

产物在 `dist/`。构建命令包含 `astro check`，类型错误会中断构建——这是有意的，能挡掉不少 frontmatter 写错的问题。

## 平台配置

大多数平台自动识别 Astro 项目。需要手填时用这组值：

- 构建命令：`pnpm build`
- 输出目录：`dist`
- Node 版本：24（`package.json` 的 `engines` 已声明）

**必须在平台上设置 `SITE_URL` 环境变量**，值是站点的完整地址（例如 `https://example.com`）。`astro.config.mjs` 读取它来生成 canonical 链接、`sitemap-index.xml` 和 RSS 里的绝对地址。漏掉这一步，线上 RSS 里的链接会全部指向 `localhost:4321`。

如果部署在子路径下（比如 GitHub Pages 的项目页），还要在 `astro.config.mjs` 里加上 `base` 配置。

## 全文搜索

搜索由 Pagefind 提供，索引在构建时生成，所以**开发模式下搜索是空的**，这是正常现象。要验证搜索效果，跑一次 `pnpm build && pnpm preview`。

搜索入口在页头，快捷键是 `/` 或 `Cmd/Ctrl + K`。不想被检索的区块加上 `data-pagefind-ignore` 属性，模板里的页面标题区就是这么处理的。

## 评论

评论用 Giscus，数据存在你自己仓库的 GitHub Discussions 里，不引入第三方数据库。

1. 仓库设为 public，在 Settings 里打开 Discussions。
2. 安装 [Giscus App](https://github.com/apps/giscus)。
3. 打开 [giscus.app](https://giscus.app)，填入仓库，选好分类，拿到四个参数。
4. 把参数写进 `.env`（本地）和托管平台的环境变量（线上）：

```bash
PUBLIC_GISCUS_REPO=你的用户名/你的仓库
PUBLIC_GISCUS_REPO_ID=R_xxx
PUBLIC_GISCUS_CATEGORY=Announcements
PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx
```

四个变量缺任何一个，评论区就不渲染，页面其余部分照常工作。所以不想要评论的话，把这几个变量留空即可，不需要改代码。

评论主题会跟着站点的深浅色切换，切换逻辑在 `Head.astro` 的 `setGiscusTheme` 函数里。
