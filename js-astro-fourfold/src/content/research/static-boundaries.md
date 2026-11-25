---
title: "静态个人出版物的边界"
description: "没有数据库和登录系统时，哪些能力适合放在构建期，哪些应该交给外部服务。"
locale: zh-cn
translationKey: research-static-boundaries
publishedAt: 2026-08-20
kind: note
version: "0.1"
tags: [静态站点, 架构, Astro]
featured: true
codeUrl: https://github.com/Liyuk/astro-fourfold
draft: false
---

静态站点适合个人出版：页面、RSS、站点地图和搜索索引都可以在构建期生成。主题、收藏和复制链接则可以作为浏览器里的小型交互。

## 留在构建期

- Markdown 渲染和目录
- 标签、年份、专栏索引
- canonical、Open Graph 和文章 JSON-LD
- `robots.txt` 与站点地图

## 留在浏览器

收藏和主题只写本地存储。搜索先在浏览器里匹配一份构建期索引。这些交互失败时，页面正文仍然在。

## 留给外部服务

评论、邮件订阅、跨设备收藏和访问统计需要身份或后端时，应使用独立服务。这条笔记的「代码」链接指向本仓库，演示 `codeUrl`；换成你的研究时，指向真正的实现。
