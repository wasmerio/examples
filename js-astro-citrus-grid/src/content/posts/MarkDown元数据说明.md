---
title: "MarkDown元数据说明"
slug: markdown-meta-data
index: 3
description: "展示 Markdown 元数据的使用方法"
category: "示例"
tags: [Markdown]
published: 2026-09-03 00:06:34
updated: 2026-09-03 22:55:21
---

## 文章 Frontmatter

| 字段 | 是否必填 | 示例 | 描述 |
| --- | --- | --- | --- |
| `title` | 是 | "example" | 文章标题 |
| `slug` | 是 | example | 运行时自动生成，可手动填写，使用`-`分隔单词 |
| `index` | 是 | 0 | 默认为0不置顶，大于0的整数置顶，数值越大越靠前 |
| `description` | 是 | "展示 Markdown 语法的各种类型和示例" | 文章描述 |
| `category` | 是 | "示例" | 文章分类 |
| `tags` | 是 | [Markdown] | 文章标签，多个标签用逗号隔开 |
| `published` | 是 | 2026-01-01 00:01:02 | 文章发布时间，格式为`YYYY-MM-DD HH:mm:ss`，脚本生成自带 |
| `updated` | 否 | 2026-01-01 00:01:03 | 文章更新时间，格式为`YYYY-MM-DD HH:mm:ss`，不自动生成 |
| `draft` | 否 | false | 是否草稿，不自动生成 |

> 请根据以上表格，填写文章的 Frontmatter。
