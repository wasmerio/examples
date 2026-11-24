---
title: "评论、搜索与联系表单集成"
slug: "theme-integrations"
date: 2024-10-28
description: "WordPress 动态功能在 Hugo 的替代方案：Giscus/Utterances 评论、Pagefind 搜索、Formspree/Netlify 表单的完整配置步骤。"
featured: "images/covers/theme-integrations.svg"
categories: ["技术"]
tags: ["hugo", "giscus", "pagefind"]
author: "Period"
---


原 WordPress 主题的评论、搜索、联系表单在 Hugo 中由第三方服务替代，全部通过
`config.toml` 开关控制，**未启用时页面不含任何相关脚本**（性能优先）。

| 功能 | 方案 | 默认 |
|---|---|---|
| 评论 | Giscus / Utterances | 关闭 |
| 搜索 | Pagefind | 开启 |
| 联系表单 | Formspree / Netlify Forms | 关闭 |

## 评论：Giscus（推荐）

### 一次性准备（GitHub 侧）

1. 仓库设为**公开**；
2. Settings → General → Features → 开启 **Discussions**；
3. 安装 **giscus App**：https://github.com/apps/giscus → Configure → 选择该仓库。

### 生成配置

打开 https://giscus.app/zh-CN，选择仓库与分类，复制生成的配置填入：

```toml
[params.comments]
  provider   = "giscus"
  repo       = "你的用户名/你的仓库"
  repoId     = "R_kgDOxxxxxxx"
  category   = "Announcements"
  categoryId = "DIC_kwDOxxxxxxx"
  theme      = "light"     # 或 dark；勿用 preferred_color_scheme（SSR 缺陷）
```

> 排查：页面报 "giscus is not installed" → App 未安装/仓库非公开/Discussions 未开启；
> 控制台 MIME 报错 → theme 用了非法值。

### Utterances 替代

只需 `repo` 与 `theme`（`github-light` / `github-dark`）两个字段，其余照抄
[utteranc.es](https://utteranc.es) 即可。
