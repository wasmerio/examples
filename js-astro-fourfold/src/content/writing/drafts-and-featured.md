---
title: "草稿、精选和更新时间各做各的"
description: "三个容易被混用的开关：什么不公开，什么放上首页，什么只是改过。"
locale: zh-cn
translationKey: drafts-and-featured
publishedAt: 2025-01-24
updatedAt: 2025-03-02
author: "Site Author"
tags: [写作, 编辑]
featured: false
minutes: 4
draft: false
---

示例仓库里同时有公开文章和一篇草稿。它们的差别不应该靠“先别链过去”来维持。

## 草稿

`draft: true` 的内容留在 `src/content/` 里，但不会进入公开列表、分页、RSS、站点地图或搜索索引。仓库里的 `unpublished-note.md` 就是这样一篇。构建结果里不应该出现它的标题。

## 精选

`featured: true` 让文章出现在首页的精选区。它不改变地址，也不表示文章更新过。精选是编辑选择，最近更新是时间顺序，两套名单可以重叠，但含义不同。

## 更新时间

`updatedAt` 晚于 `publishedAt` 时，文章页会同时显示发布和更新。列表排序使用更新时间，年月路径仍使用发布日期。这篇的路径停在 2025 年 1 月，排序则按 3 月的更新。
