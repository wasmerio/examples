---
title: "内容同步"
description: "来自独立仓库的内容如何经校验并通过拉取请求同步进中心。"
order: 3
---

本指南介绍来自**独立仓库**的内容如何进入中心。它镜像了本仓库内置的
`awareride-content-sync` skill(位于 `.agents/skills/awareride-content-sync/`
之下)。若改为在中心内直接编写内容,请参阅[编写内容](./authoring.md)。

中心本身 —— 以及你正在阅读的这份文档 —— 都遵循这一模型。本仓库的 `docs/`
文件夹作为 `astro-content-hub` 产品被同步进中心。

## 模型

中心从许多源仓库聚合内容。外部仓库以 locale 布局编写 `posts/` 或 `docs/`;
GitHub Action 校验内容,并向中心的 `main` 分支发起一个**拉取请求**。人工审阅
该 PR;合并后中心构建并部署。**没有任何内容直接落到中心的 `main` 分支** ——
内容在上线前先经过审阅。

## 布局(镜像中心的 locale 维度)

```
<external-project>/
  posts/
    en/hello-world.md          <- 中心上的 /posts/hello-world/
    zh-Hans/hello-world.md     <- 与 en 文件名相同(slug 约定)
    en/my-product/foo.md       <- 嵌套目录成为路径片段
  docs/
    en/index.md                <- 产品文档落地页
    en/getting-started.md
    zh-Hans/index.md           <- 可选;缺失时回退到 en
  .agents/skills/awareride-content-sync/   <- 同步 skill(已复制)
  sync-delete.list             <- 可选删除清单(见下文)
```

`posts/` 映射到中心的 `src/content/posts/`;`docs/` 映射到
`src/content/docs/${PRODUCT}/`。产品维度由同步时从 `PRODUCT` 环境变量注入,
**并非**存在于外部仓库中 —— 这样相对 markdown 链接在 GitHub 上仍能针对
`docs/` 解析。

**交互也会同步。** 因为是直接的文件复制,Markdown 里任何内联 `<script>`
都会随之进入中心 —— 因此你仓库 `docs/en/foo.md` 里写的按钮、标签页或图表
在中心上零额外配置即可交互。遵循[编写指南](./authoring.md#markdown-中的交互)
(自包含、无外部请求)即可原样通过 review。

## Frontmatter schemas

文章(`posts/<locale>/<slug>.md`):

```yaml
---
title: "Post Title"                     # 必填
date: 2025-07-21                        # 必填,YYYY-MM-DD
description: "One-line summary."        # 必填
tags: ["announcement"]                 # 可选
author: "Your Name"                    # 可选
source: "https://github.com/owner/repo"# 可选
draft: false                           # 可选;从中心排除
---
```

文档(`docs/<locale>/<slug>.md`):

```yaml
---
title: "Page Title"          # 必填
description: "Short summary" # 可选
order: 2                     # 可选,侧边栏排序(默认 0)
---
```

文档没有 `date`、`tags`、`author` 或 `draft`。

## Slug 约定

文件的 slug 是其相对于 locale 目录、去掉 `.md` 后的路径。slug **必须在各语言
间逐字节一致**,回退才能生效(`en/foo.md` 与 `zh-Hans/foo.md` 的 slug 都是 `foo`)。
务必先写 `en` 版本。

## 回退

回退是逐页、内容级别的,绝不是重定向。缺失的 `zh-Hans` 页面会在 `zh-Hans` 外壳中渲染
`en` 正文并显示提示;`/zh-Hans/posts/` 上的文章卡片会显示 `EN` 徽章。先发布 `en`,
再逐步翻译 —— 站点永远不会因缺失翻译而返回 404。

## 内部链接

- 在 `en` 文章/文档中,使用默认路径链接:`/posts/foo/`、
  `/<product>/docs/bar/`。
- 在 `zh-Hans` 文章/文档中,使用 `/zh-Hans/` 前缀让读者留在中文外壳中:
  `/zh-Hans/posts/foo/`、`/zh-Hans/<product>/docs/bar/`。

## 本地校验

一个零依赖的 Node 脚本会检查 frontmatter 与 slug 约定:

```bash
node .agents/skills/awareride-content-sync/scripts/validate.mjs
```

它遇到任何错误都会以非零状态退出,因此可以作为同步工作流的把关。它会捕获
缺失/无效的 frontmatter、没有对应 `en` 文件的 `zh-Hans` 文件,以及缺失的 `en/`
locale 目录。每当你新增或重命名内容文件时都应运行它。

## 同步到中心

1. **创建 PAT(在中心侧,一次性)。** 在中心仓库创建一个细粒度 PAT,具有
   **Contents: write**(推送同步分支)与 **Pull requests: write**(发起 PR)权限。
   将其作为仓库密钥添加到*外部*仓库,命名为 `DOCS_CENTRAL_HUB_TOKEN`。
2. **添加工作流。** 从 `.agents/skills/awareride-content-sync/templates/` 复制
   `sync-docs.yml`(或 `sync-posts.yml`)到 `.github/workflows/`。对于文档,将
   `PRODUCT` 设为你的产品名。两者都会先校验,再发起 PR。
3. **目录映射。** `posts/` → `src/content/posts/`,
   `docs/` → `src/content/docs/${PRODUCT}/`。

该复制是**合并**而非镜像:它会将外部仓库的文件添加/覆盖到中心,并保留其他
项目的内容不被改动。

## 删除内容(`sync-delete.list`)

合并复制永远不会删除仅存在于中心的内容。要下架一个页面,请在仓库根目录的
`sync-delete.list` 中列出它:

```text
# 每行一个路径,相对于仓库根目录;'#' 与空行会被忽略
posts/en/old-post.md
posts/zh-Hans/old-post.md
docs/en/legacy/        # 尾部斜杠 = 删除整个目录
```

- 路径通过复制映射(`posts/...` → `src/content/posts/...`,
  `docs/...` → `src/content/docs/${PRODUCT}/...`)。
- `sync-posts` 工作流只处理 `posts/...` 行;`sync-docs` 只处理 `docs/...` 行。
- 尾部斜杠会删除整个目录。不安全路径(`..`、绝对路径或裸集合根)会被拒绝。
- 删除与新增会落到同一个可审阅的 PR 中。

## 注册新产品(仅文档)

只有当产品注册在中心的 `products` 数组(仓库根目录的 `site.config.ts`)中时,其文档才会在
中心渲染。这是所有者通过 PR 完成的**一次性中心侧变更** —— 外部仓库无法通过
同步完成。合并后,在你的 `sync-docs.yml` 中设置 `PRODUCT`。文章无需注册。

## 什么会破坏中心的构建

中心运行 `npm run build`(Astro + `astro check`,预期零错误)。你的内容可能因
以下原因破坏构建:frontmatter 类型不匹配、同语言内 slug 重复、只有 `zh-Hans` 而没有
对应 `en` 文件的 slug,或指向不存在页面的内部链接。`validate.mjs` 能捕获其中
大部分;推送前请运行它。
