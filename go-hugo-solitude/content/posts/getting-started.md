---
title: 开始使用 Solitude Hugo
date: 2026-08-25T10:00:00+08:00
lastmod: 2026-08-25T10:00:00+08:00
slug: getting-started
abbrlink: 10001
description: 从安装主题到完成第一次生产构建，建立一个可继续扩展的 Solitude Hugo 站点。
cover: /img/demo/cover-getting-started-v2.webp
categories: [快速开始]
tags: [Hugo, Solitude]
series: [官方示例]
recommend: true
toc: true
comment: true
locate: 项目文档
---


Solitude 是一款注重内容体验的 Hugo 主题。它使用 Go Templates 组织页面，通过 Hugo Pipes 处理样式和 TypeScript；站点构建只需要 Hugo，不需要额外安装 Node.js、PostCSS、Sass 或 Stylus。

## 准备环境

请安装 Hugo `v0.164.0` 或更高版本。官方发行版已经包含主题需要的模板和资源处理能力，可以通过下面的命令确认版本：

```shell
hugo version
```

## 安装主题

在 Hugo 站点根目录把 Solitude 添加为 Git submodule：

```shell
git submodule add -b hugo https://github.com/everfu/hugo-solitude.git themes/solitude
```

随后在站点的 `hugo.yaml` 中启用主题，并声明搜索与友链数据使用的输出格式：

```yaml
theme: solitude

outputs:
  home: [HTML, RSS, Search, Links]
  section: [HTML, RSS]
  taxonomy: [HTML, RSS]
  term: [HTML, RSS]

params:
  solitude:
    search:
      enable: true
      type: local
```

主题仓库中的 `exampleSite/hugo.yaml` 是完整配置起点。复制时建议保留配置层级，再逐项替换站点名称、导航、首页推荐、侧栏和页脚内容。

