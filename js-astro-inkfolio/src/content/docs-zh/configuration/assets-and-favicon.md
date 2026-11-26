---
title: 图片、图标与 favicon
order: 7
description: "图片放哪儿，以及怎么换 favicon 而不弄坏标签页、主屏幕和安装入口。"
---

## 图片

需要构建期优化放 `src/assets/`；路径本身有意义的放 `public/`。

| 路径 | 放什么 |
| :--- | :--- |
| `public/avatar.png` | 首页与友链卡片用的头像 |
| `public/footer/` | 页脚插画，浅色深色各一份 |
| `public/icons/` | 工具页图标，按名字匹配 |
| `public/og-default.png` | 没有生成 OG 图时的兜底卡 |
| `src/assets/` | 文章与文档配图，构建时缩放 |

Markdown 里用相对路径即可：`![alt](../../assets/pic.png)`。alt 一定写真实内容——SEO 自检会报出缺 alt 的图片，图片搜索也在意这个。

## Favicon

浏览器和主屏幕要的不止一个文件，文件名别改：

| 文件 | 谁在用 |
| :--- | :--- |
| `favicon.svg` | 现代浏览器，任意尺寸清晰——这是源文件 |
| `favicon.ico` | 老浏览器与部分阅读器，16×16 与 32×32 |
| `favicon-32.png` | 不认 SVG 的标签页 |
| `apple-touch-icon.png` | iOS 主屏幕，180×180，背景不透明 |
| `icon-192.png`、`icon-512.png` | Android 与安装提示 |
| `site.webmanifest` | 把图标与站点名、主题色绑在一起 |

`Base.astro` 已经全部引好，换文件即可。图形保持方形、16px 下仍能认；带文字的字标会糊。

manifest 里是 `name`、`short_name`、`start_url`、`display`、`background_color`、`theme_color`。主题色要与 `site.config.yaml` 的强调色一致，否则手机状态栏和页面撞色。
