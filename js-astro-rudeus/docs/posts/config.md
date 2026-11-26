---
title: 主题配置
description: 本主题的配置文件及其各配置项目介绍，可用于自定义
pubDate: 2026-04-22
category: 基础使用
tags: [欢迎, Astro, 博客]
image: https://i.cdn.crrashh.com/2026/0114/3fe632da964f9b23
---

> 封面图 Pixiv ID：120341092

本主题会读取 `src/config.ts` 作为站点的全局配置文件，一共分为 4 个部分。通过更改此文件中的字段，就可以对站点自定义。

## siteConfig

`siteConfig` 内是站点基本信息，用于展示关于站点全局的内容。

### title

- 类型：`string`
- 每个页面可以通过 frontmatter 覆盖

站点的全局标题，默认会在首页、导航栏和浏览器标签中显示。

### subtitle

- 类型：`string`

站点的副标题，只在首页的大标题的下方显示。

### description

- 类型：`string`

站点全局的 SEO 站点描述，写在站点的 `<meta>` 标签内。

### url

- 类型：`string`

规定站点的 URL，若文章内容中的链接不属于此 URL 范围内，则会在新标签页中打开此外部链接。

### isWithExt

- 类型：`boolean`

规定是否在生成的页面的链接中保留 .html 后缀。

如果为 `true`，则 src/content/posts/xxx.md 生成的页面为 dist/posts/xxx.html，页内 `a` 标签链接指向 path/to/xxx.html；如果为 `false`，则生成的页面为 dist/posts/xxx/index.html，页内 `a` 标签链接指向 path/to/xxx。

### isWithLoadingBar

- 类型：`boolean`

规定是否在站内换页时，在页面顶部显示进度条。

### license.enabled

- 类型：`boolean`

设定是否启用声明许可协议，如果为 `true` 会在文章页尾自动加上许可协议声明内容块。

### license.name

- 类型：`string`

许可协议的名称，用于将 [license.prompt](#licenseprompt) 中的 `[license]` 占位符替换为该名称。

### license.url

- 类型：`string`

许可协议的 URL 地址，用于为 [license.prompt](#licenseprompt) 中的 `[license]` 占位符添加链接，并设定为该 URL 地址。

### license.prompt

- 类型：`string`

显示在文章页尾的许可协议声明内容块，可使用 `[license]` 占位符来插入协议链接。

### articles.indexPerPage

- 类型：`number`

首页每一页显示的文章或说说数量，默认为 8。

### articles.descriptionLength

- 类型：`number`

自动生成简介的字数，默认为 90。本主题会对未在 frontmatter 中设置 description 字段的文章，自动截取正文前的规定字数作为简介。

### background.enabled

- 类型：`boolean`

是否启用背景图，如果为 `true` 则页面背景会变为指定图片。

### background.url.light

- 类型：`string`

浅色模式下背景图的地址，如果需要从外部引入，则直接填写 URL；如果该背景图在项目的目录以内，则填写以 `/public/` 为根目录的相对路径。

### background.url.dark

- 类型：`string`

深色模式下背景图的地址，规则同上，如果希望不切换背景图则填写和上一条配置相同的地址即可。

### background.opacity

- 类型：`number`

背景图的透明度，原理同 CSS 的 `opacity` 属，取值范围为 0 ~ 1。

## navConfig

`navConfig` 内是站点顶部导航栏的链接列表，数据类型为数组。

### [].name

- 类型：`string`

该链接的名称。

### [].url

- 类型：`string`

该链接的地址。注意：若是站内地址，需要留意 [isWithExt](#iswithext) 属性，并按照情况确定是否在链接末尾加上 `.html` 扩展名。

## profileConfig

`profileConfig` 内是站点左侧栏的博主个人信息简介。

### name

- 类型：`string`

博主昵称。

### avatar

- 类型：`string`

头像图片的地址，规则同 [background.url](#backgroundurldark)。

### description

- 类型：`string`

博主的个人简介。

## footerConfig

`footerConfig` 内是站点底部页脚展示的信息。

### copyright

- 类型：`string`

博客的版权信息，若为空则该行不显示。

### message

- 类型：`string`

需要额外展示的信息，如备案号、相关链接等，可以包含 HTML 标签。
