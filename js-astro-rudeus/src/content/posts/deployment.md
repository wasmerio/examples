---
title: 部署主题
description: 如何使用并部署 Rudeus 主题？
pubDate: 2026-01-05
category: 基础使用
tags: [主题, 部署, 教学]
---

## 本地部署

本主题需要您的环境存在 Node.js 18 及以上版本。

1. 拉取项目

```shell
git clone https://github.com/crrashh1542/astro-theme-rudeus
```

2. 准备环境

```shell
# 安装 PNPM（若已安装可忽略）
npm install pnpm -g
# 安装依赖，启动开发环境
pnpm install
pnpm dev
```

3. 进入 `src/content` 修改内容，并按照终端提示进入开发环境预览变化。
    - posts 目录内 md 为文章页面，frontmatter 必须包含 `title`（文章标题）和 `pubDate`（发布日期）。
    - 根目录下 md 为普通页面，frontmatter 必须包含 `title`（页面标题）
    - 根目录下 config.ts 按照提示进行自定义即可

4. 构建生产环境页面并部署

```shell
pnpm build
```

## CloudFlare Pages 部署

1. 登录 GitHub，打开本主题的 [GitHub 页面](https://github.com/crrashh1542/astro-theme-rudeus)，点击页面的“Use this template”按钮，选择“Create a new repository”，按照提示创建一个以本主题为模板的新项目。
   ![从模板创建](https://i.cdn.crrashh.com/2026/0114/4ca7598d35d03660)

以下内容施工中...！
