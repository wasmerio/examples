---
title: 文档中心
description: 了解 ermaozi 的配置、内容模型和内置能力。
permalink: /docs/
type: doc
group: 概览
order: 1
badge: 开始
icon: material-symbols:docs-outline
createTime: 2026-08-05
tags: [Astro, 文档]
---

# 文档中心

::: warning 测试阶段
当前 `0.2` 系列仍处于测试阶段。功能和配置尚未完全稳定，后续版本可能包含破坏性更新；测试期间请固定版本，并在升级前查看 GitHub Release 说明。
:::

主题同时支持博客与产品文档。`content/docs/` 下的页面会自动生成文档侧栏、移动端目录和上一篇/下一篇导航。

::: card-grid cols="2"
- **配置驱动**

  站点身份、导航、语言和可选服务集中在一个配置文件中。

- **内容优先**

  Markdown 文件决定路由、排序、分组、标签和页面行为。
:::

## 从这里开始

1. 按[零基础快速开始](/docs/guide/getting-started/)完成站点身份和第一篇文章。
2. 需要更多选项时阅读[站点配置](/docs/guide/configuration/)和[内容能力](/docs/guide/content/)。
3. 删除不需要的示例内容并运行 `pnpm validate`。

## 当前兼容环境

- Node.js 22.12 或更高版本
- Astro 7.1
- Vue 3.5
- npm、pnpm 或 Yarn
