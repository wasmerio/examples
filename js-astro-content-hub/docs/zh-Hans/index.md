---
title: "概览"
description: "astro-content-hub 模板的文档 —— 一个从多个仓库聚合文档与文章的组织与产品门户。"
order: 0
---

`astro-content-hub` 是一个基于内容中心模式的**组织与产品门户**模板:它将多个
开源仓库的文档与博客文章聚合到一个**本地化、自动部署**的静态站点,为组织提供
门户入口,并为每个项目提供独立的产品落地页。它基于 Astro 7(静态输出)构建,
可免费部署到 GitHub Pages 与 Cloudflare Pages。

本文档本身也是**同步内容**:它位于本仓库的 `docs/<locale>/` 目录下,通过
拉取请求同步进入中心,与其他产品的文档无异。参见
[内容同步](./content-sync.md)了解其工作方式。

## 本文档包含

- [愿景与产品理念](./vision.md) —— 这个模板为何存在:
  一个组织与产品门户,而不仅是文档聚合器。
- [架构](./architecture.md) —— Astro 站点的布局、路由、
  内容集合与核心模块。
- [编写内容](./authoring.md) —— 在中心内直接撰写文章与
  文档(i18n、slug 约定、回退、添加产品或语言)。
- [内容同步](./content-sync.md) —— 通过基于 PR 的同步
  Action 从独立仓库贡献内容。
- [部署](./deployment.md) —— 将模板指向 GitHub Pages
  和/或 Cloudflare Pages。
- [升级](./upgrading.md) —— 以最少迁移将 rebrand 后的 fork
  更新到新模板版本(git merge + `npm run check:upstream`)。
- [优化路线图](./roadmap.md) —— 弥合模板与愿景之间差距的
  分阶段计划。

## 为何选择此模板

- **中心 + 内容同步模型。** 外部项目编写 `posts/` 与 `docs/`,并通过 GitHub
  Action 以拉取请求的形式同步进来。一个中心,多个源仓库,任何内容在上线前
  都经过审阅。
- **原生逐页本地化。** 默认语言 `en` 无 URL 前缀;`zh-Hans` 位于 `/zh-Hans/...`。缺失的
  翻译会在本地化外壳中展示默认语言正文 —— 绝不返回 404。
- **免费自动部署。** 静态输出可零成本部署到 GitHub Pages 与 Cloudflare Pages。
