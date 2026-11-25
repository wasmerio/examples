---
title: "先写内容模型，再画页面"
description: "文章、项目、研究和影像可以共享元数据习惯，但不必变成同一种卡片。"
locale: zh-cn
translationKey: content-before-pages
publishedAt: 2026-04-09
updatedAt: 2026-08-28
author: "Site Author"
tags: [写作, 结构, 内容模型]
featured: true
minutes: 7
column: "个人出版物基础"
columnOrder: 2
draft: false
---

页面是内容的一种投影。标签页、年份归档和专栏路径都应该从同一批 Markdown 里长出来，而不是每增加一个主题就手写一个新页面。

## 共用的，和不必共用的

标题、摘要、语言和草稿状态几乎所有内容都需要。发布日期、项目状态、研究版本和图片说明则只属于各自的类型。把它们塞进同一张表，后面每一次展示都会变成例外。

## 一篇文章最少要这些字段

```yaml
title: "文章标题"
description: "列表、RSS 和分享卡片使用的摘要"
publishedAt: 2026-04-09
tags: [写作, 结构]
```

`publishedAt` 决定年月地址。存在 `updatedAt` 时，列表按更新时间排序，地址仍保持第一次发布的位置。

## 校验发生在构建之前

`npm run validate:content` 会检查必填字段、重复的 `translationKey`、重复的文章地址、不存在的专栏，以及影像资源是否真的在 `public/` 里。schema 不通过时，`npm run check` 也会失败。
