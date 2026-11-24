---
title: Somnia
date: 2025-01-01T12:00:00+08:00

tag: ["Somnia"]
categories: ["技术"]

featuredImage: "/images/default.webp"
---


## 简介

一个现代化、优雅的 Hugo 主题，基于 Astro Theme Pure 移植而来。使用了 Alpine.js + UnoCSS 构建，支持现代化的网站开发体验。[缘起](https://www.ftls.xyz/posts/2026-03-22-hugo-theme-somnia/)

## 快速体验

```bash
git clone https://github.com/kkbt0/Somnia
cd Somnia
just
```
参考 justfile 文件。如果你没有安装 just，也可以直接复制命令到命令行执行。
```bash
git clone https://github.com/kkbt0/Somnia
cd Somnia
hugo server -s exampleSite/ --disableFastRender
```

- 需要注意，本项目需要 Hugo >= v0.158.0 环境。
- 如果需要使用 UnoCSS ，需要 pnpm install 安装依赖。
- 如果需要使用 Pagefind 提供的搜索，需要安装 pagefind_extended。

配置参考 `Somnia/exampleSite/config/_default` 下文件，以及 `Somnia/exampleSite/hugo.toml` 文件。

## 快速开始

将 `Somnia/exampleSite/` 目录复制到你的 Hugo 站点目录，然后执行 `hugo server` 命令即可。

## 自定义 CSS/JS

编写自定义的 CSS/JS 可以参考`your_website/themes/Somnia/assets/js/custom.js` 和 `your_website/themes/Somnia/assets/css/custom.css`，在 `your_website/assets/css/custom.css` 和 `your_website/assets/js/custom.js` 中编写代码。以覆盖原有的 custom 样式/脚本。

这在你需要不修改 Somnia 主题的情况下定制你的主题，或编写 shortcode 的时候会用到。

## 自定义组件

见 [Custom Components](/Somnia/posts/custom-components/)

