---
title: 用数据文件构建特色页面
date: 2026-08-23T10:00:00+08:00
lastmod: 2026-08-23T10:00:00+08:00
slug: feature-pages
aliases:
  - /p/pagination-five.html
description: 用 Hugo 数据文件维护关于、友链、装备和即刻短文页面，让内容与模板保持分离。
cover: /img/demo/cover-pagination-page-two-v2.webp
categories: [配置指南]
tags: [数据文件, 特色页面, Hugo]
series: [官方示例]
toc: true
comment: true
locate: 数据示例
---


Solitude 的特色页面使用 Hugo 分支包与数据文件协作：`_index.md` 决定页面地址和类型，`data/` 中的 YAML 保存可重复维护的内容。调整数据即可更新页面，无需复制模板。

## 创建页面入口

以装备页为例，创建 `content/equipment/_index.md`：

```yaml
---
title: 我的装备
type: kit
data: kit
aliases:
  - /kit/
---
```

`type` 用于选择 Solitude 的专用模板；`data` 可以把默认的 `data/kit.yaml` 改成其他文件名。关于、友链和即刻短文分别使用 `about`、`links` 与 `brevity` 类型。

## 关于页的模块顺序

`data/about.yaml` 必须使用模块化的 `sections` 数组，列表顺序就是最终展示顺序：

```yaml
title: 关于 Solitude
sections:
  - type: intro
    greeting: 你好，欢迎了解 Solitude
    name_prefix: 这是
    name: Solitude
    description: 一款专注内容体验的 Hugo 主题

  - type: values
    motto:
      label: 设计原则
      prefix: 内容优先
      content: 克制表达
    expertise:
      label: 主题能力
