---
title: site.config.yaml 里每个设置的作用
description: 站名、导航、配色、顶部横幅，全在这一个 YAML 文件里。
date: 2026-11-11
cover: /og/posts/zh/site-config.png
coverAlt: site.config.yaml 里每个设置的作用
tags: [配置]
categories: ['配置']
lang: zh
---

访客看到的**结构**都来自根目录的 `site.config.yaml`。改站名、加菜单，不需要打开任何组件。

## site

- `name` / `nameZh`：导航里的品牌名和浏览器标题。
- `tagline` / `taglineZh`：首页那句大字。
- `description` / `descriptionZh`：meta 描述和标题下面那段话。
- `url`：你的域名，用于 canonical、sitemap 和 RSS。
- `author` / `authorZh`：文章上署的名字。
- `email`：可选，填了才会出现在页脚。
- `defaultLanguage`：`en` 或 `zh`。英文在 `/`，中文在 `/zh/`。
- `showLanguageSwitcher`：设成 `false`，所有语言切换入口消失。

## nav

普通列表。每项需要 `label` 和 `href`，`labelZh` 可选：某个页面没有中文版时就不写这一行，它不会出现在中文导航里，也就不会指向 404。

```yaml
nav:
  - label: Posts
    labelZh: 文章
    href: /posts/
```

## social

显示在页脚。像 `/rss.xml` 这样的相对链接会自动加上中文前缀，绝对链接原样保留。

## promoBanner

单独一篇讲：见《一行关掉顶部横幅》。

## theme

- `accent`：链接、下划线、当前菜单项的颜色，任意 CSS 颜色都行。
- `defaultMode`：`auto` / `light` / `dark`，`auto` 跟随系统。
- `radius`：卡片和图片的圆角。

## footer

`note` / `noteZh` 是页脚那行小字，换成你自己的或留空都行。

一个提醒：YAML 对缩进敏感，只用空格不用 Tab，值里含 `:` 或 `#` 时保留引号。
