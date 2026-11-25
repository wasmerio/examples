# Frontmatter 字段说明

`content/` 目录下的所有 Markdown（`.md`）和 MDX（`.mdx`）文件均通过顶部的 YAML Frontmatter（包裹在 `---` 之间）配置元数据。四类内容都需要 **`title`**；文章还必须提供 `date`、`published` 或 `pubDatetime` 中的一个作为发布日期。

## 四类内容通用字段

以下字段在 `posts`、`pages`、`categories` 和 `tags` 中均可使用：

| 字段名            | 类型                                    | 默认值                       | 说明                                                                                                                       |
| ----------------- | --------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                | _(必填)_                     | 文章、页面、分类或标签的显示标题。                                                                                         |
| `slug`            | `string`                                | 文件名或目录名               | 自定义 URL 短名称（不含语言后缀）。                                                                                        |
| `description`     | `string`                                | `''`                         | 内容摘要，用于文章列表预览、站内搜索结果和 SEO 描述标签。                                                                  |
| `image` / `cover` | `string`                                | —                            | 封面图路径（支持内容包相对路径 `./cover.jpg` 或 `public/` 根路径 `/img/cover.jpg`）。                                      |
| `coverStyle`      | `'thumbnail' \| 'fade' \| 'background'` | 跟随全局配置                 | 卡片封面展示样式（缩略图、渐变融合或全幅背景）。                                                                           |
| `draft`           | `boolean`                               | `false`                      | 设为 `true` 时标记为草稿，执行 `pnpm build` 正式构建时会自动排除。                                                         |
| `hidden`          | `boolean`                               | `false`                      | 设为 `true` 时隐藏该条目（不在列表和导航中展示，但仍可通过直接链接访问）。                                                 |
| `math`            | `boolean`                               | `article.math`               | 单独为当前页面开启或关闭 KaTeX 数学公式渲染。                                                                              |
| `mermaid`         | `boolean`                               | `article.mermaid`            | 单独为当前页面开启或关闭 Mermaid 流程图渲染。                                                                              |
| `lightbox`        | `boolean`                               | `article.lightbox`           | 单独为当前页面开启或关闭图片点击放大功能。                                                                                 |
| `callouts`        | `boolean`                               | `article.callouts`           | 单独为当前页面开启或关闭提示块（Callouts）渲染。                                                                           |
| `toc`             | `boolean`                               | `article.toc.enabled`        | 单独为当前页面开启或关闭目录（TOC）。                                                                                      |
| `shareCover`      | `boolean`                               | `article.shareCover.enabled` | 单独为当前页面开启或关闭动态 Open Graph 分享封面生成。                                                                     |
| `display`         | `Partial<ArticleDisplay>`               | `article.display`            | 局部覆盖页面元信息展示开关（如 `author`、`published`、`readingTime`、`updated`、`tags`、`share`、`navigation`、`title`）。 |

## 日期字段（文章与独立页面）

为了方便从其他博客框架平滑迁移，BlogGPT 同时支持多种常见的日期字段别名：

| 推荐字段  | 兼容别名                   | 说明                                                                                                                        |
| --------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `date`    | `published`、`pubDatetime` | 首次发布日期，文章必填、独立页面可选（支持 `YYYY-MM-DD` 或完整 ISO 时间戳，优先级：`date` > `published` > `pubDatetime`）。 |
| `updated` | `modDatetime`、`lastmod`   | 最后更新日期（优先级：`updated` > `modDatetime` > `lastmod`）。                                                             |

## 文章专属字段（`content/posts/`）

| 字段名                    | 类型                 | 默认值  | 说明                                                            |
| ------------------------- | -------------------- | ------- | --------------------------------------------------------------- |
| `categories` / `category` | `string \| string[]` | `[]`    | 所属分类的 `slug`（支持单个字符串或数组，如 `[tech, astro]`）。 |
| `tags`                    | `string \| string[]` | `[]`    | 文章标签的 `slug` 列表（如 `[guide, markdown]`）。              |
| `featured`                | `boolean`            | `false` | 设为 `true` 时将文章置顶展示在侧边栏精选区与首页推荐列表中。    |

## 完整示例

```yaml
---
title: 你好，世界
slug: hello-world
date: 2026-03-29
updated: 2026-04-02
description: 快速了解 BlogGPT 的 Frontmatter 配置与核心写作功能。
categories: [general]
tags: [intro, bloggpt]
featured: true
image: ./cover.webp
math: true
mermaid: true
---
```
