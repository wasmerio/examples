---
title: LogFlow Theme：我为什么要造轮子
description: 记录我制作 LogFlow Theme 这个博客主题时的一些想法和取舍。
pubDate: 2026-03-14
collection: LogFlow Theme
collectionDescription: LogFlow Theme 主题设计、实现与迭代实践
tags:
  - Astro
  - Theme
  - Engineering
  - Open Source
---

本博客用的主题，直接修改自Astro官方的Blog最小模板，添加了一些自定义组件和页面，包括但不限于：

- 首页的个人信息、紧凑文章列表和 GitHub 活跃度。
- 构建阶段获取数据并静态渲染的 GitHub 贡献图。
- 基于静态索引的文章搜索对话框，支持键盘导航和结果高亮。
- 可以自定义的社交链接、友链列表。
- 专题、标签和年份归档页面。
- giscus 评论支持。
- 基于 `ClientRouter` 的无刷新换页、主题状态恢复和代码复制。
- 全站像素流体背景，在不支持 WebGL 或开启减少动态效果时自动降级。

主题本身在 GitHub [LogFlow Theme](https://github.com/kevynf/logflow-theme) 仓库开源。


我想要的是一个安装好之后可以快速开始写作、配置集中且易于维护的主题，于是就有了 LogFlow Theme。

## 我是怎么设计它的

### 配置集中

我希望修改站点信息这件事尽量简单，所以把常用配置都集成到了 `src/consts.ts` 里，包括：

- 站点标题、描述、URL 和版权名字；
- 页面标题与概述（`PAGE_COPY`）；
- 首页头像、标语和文章数量（`HOME`）；
- 社交链接与 GitHub 贡献图配置；
- 搜索开关与最大结果数（`SEARCH`）；
- 友链数据（由 `src/config/friend-links.ts` 维护）；
- giscus 评论相关配置（`COMMENTS`）。

日常只需修改 `src/consts.ts`，大部分个性化需求都能得到覆盖，不需要频繁在组件内部进行修改。

### 文章

使用了尽量简单的 Frontmatter 字段，包括：

- `title`、`description`、`pubDate` 为必填
- `updatedDate`、`collection`、`collectionDescription`、`tags` 和 `enableComments` 为可选

好处显而易见，一方面可以专注于写作，另一方面如若久别重逢，也可快速上手。

### 一些细节

没有刻意堆砌。

- 颜色模式切换；
- 一个紧凑的中文 Header；
- 标签徽标、阅读时长和搜索等辅助组件；
- 更具可读性的配色和页面布局；
- 可选的 giscus 评论。

并不复杂，但对于体验的提升是很显著的。

## 如果你也想用

请移步 [LogFlow Theme](https://github.com/kevynf/logflow-theme) 仓库，可以选择 Use this template 一键配置。内置的示例文章同时也是本主题的简单使用说明。

> 总之对我来说，这个主题更多是按照之前使用Hexo、VuePress等架构的经验，整理成一个可以重复使用的模版。
>
> 同时也以此勉励自己长久坚持，专注写作。
>
> 如果你希望为本项目贡献代码，也欢迎提交 PR。
