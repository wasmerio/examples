---
title: 这是什么
order: 0
description: 有哪些部件、文档怎么分层、每个文件放在哪。
---

Inkfolio 是一个给写作者用的 Astro 静态主题。Markdown 进，静态 HTML 出——没有数据库、
没有后台、打包产物里没有前端框架。

其余一切由两条原则决定：

- **能配的都靠配置。** 站点名、导航、页脚、语言、功能开关全在 `site.config.yaml`。
- **内容是文件。** 文章、文档、周刊、研究笔记都是 `src/content/` 下的 Markdown，
  一个集合一个目录。

## 文档地图

| 章节 | 回答什么 |
| --- | --- |
| 开始使用 | 装起来、写第一篇、部署、把旧博客搬进来 |
| 配置 | `site.config.yaml` 每个键的作用 |
| 内容 | frontmatter 字段、草稿、图片、翻译 |
| 参考 | 完整配置面，以及「为什么它长这样」 |

## 目录结构

```
site.config.yaml          站点名、导航、页脚、语言、功能开关
src/
  content/
    posts/                英文文章
    posts-zh/             中文文章（zh 与 zh-Hant 共用，构建时转字形）
    docs/  docs-zh/       就是这套文档
    weekly/ research/     另外两个集合
  data/
    taxonomy.ts           分类封面与说明
  lib/
    config.ts             读取 site.config.yaml，导出带类型的取值
    docs.ts               文档侧栏：章节顺序与标题
  pages/                  路由；/zh/ 与 /zh-Hant/ 是镜像
  components/             一种页面一个组件
  styles/global.css       设计 token 与全部样式
public/                   静态文件：图片、og 封面、图标、robots.txt
scripts/build.mjs         astro check → astro build → pagefind → seo-check
```

## 真正要动的只有两个地方

- `site.config.yaml`：买家第一天上手会改的都在这里——文案、链接、主题、横幅、统计、SEO 默认值。
- `src/content/`：写作者会改的都在这里——文章与独立页面。

其余是主题本身，通常不用碰 `src/`。

## 下一步

- 第一次用：[安装与本地运行](/zh/docs/getting-started/installation/)
- 要搬旧博客：[迁移已有博客](/zh/docs/getting-started/migration/)
- 哪里不对：[常见问题](/zh/docs/reference/faq/)
