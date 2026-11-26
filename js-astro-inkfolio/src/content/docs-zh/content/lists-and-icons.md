---
title: 列表、链接与图标
order: 2
description: 项目、工具箱、友链都是 YAML 文件，图标就是一个文件名。
---

有三个页面由数据驱动，改它们不用碰任何 Astro 文件。

## 项目

`src/data/projects.yaml`，`/projects/` 和首页都用它：

```yaml
- title: Pocket Ledger
  tag: 副业项目
  status: active
  desc: 一个极简复式记账工具。
  descZh: 一个极简复式记账工具。
  url: https://example.com/pocket-ledger
```

`status: archived` 会多一个徽标，其余原样输出。

## 工具箱

`src/data/tools.yaml`，按分类分组，每个分类一个 `id` 锚点：

```yaml
- id: sites
  en: Sites
  zh: 站点
  note: { en: Worth opening first., zh: 先去的几个地方。 }
  links:
    - name: Astro
      url: https://astro.build
      icon: astro
      note: { en: The framework., zh: 这个框架。 }
```

### 图标

`icon` 就是 `public/icons/` 里的文件名，不带 `.svg`。放一个新 SVG 进去，写上名字就生效，不改代码：

```
public/icons/astro.svg   →   icon: astro
```

> [!TIP]
> 名字找不到对应文件时回落到首字母，写错看得见但不会把页面搞挂。

自带的：`jask`、`astro`、`fontawesome`、`github`。

## 友链

`src/data/friends.yaml`，一个站一条：

```yaml
- name: jask.dev
  url: https://jask.dev
  author: Jask
  avatar: /avatar.jpg
  desc: { en: Build logs., zh: 构建日志。 }
```

`avatar` 可省，省了就用首字母圆形色块。
