# Imprint

Imprint是一套安静、专注写作的[Astro](https://astro.build/)博客主题，适合技术笔记、实践记录和长文。

[English README](./README.md)

## 主题预览

[查看在线Demo](https://www.bluexiii.com/astro-theme-imprint/)

![Imprint浅色模式首页](./docs/screenshots/home-desktop.png)

<p>
  <img src="./docs/screenshots/article-dark.png" alt="Imprint深色模式文章页" width="700" />
  <img src="./docs/screenshots/home-mobile.png" alt="Imprint移动端首页" width="280" />
</p>

## 功能

- 简洁的文章型设计，支持明暗主题
- 使用Astro内容集合管理Markdown文章和frontmatter类型
- 响应式文章列表与正文布局
- 长文章自动生成目录
- 按年、月归档，支持分类和标签
- 内置RSS、sitemap、canonical和Open Graph元数据
- 支持历史归档和`noindex`状态
- 内置英文、中文界面字典
- 支持GitHub Pages项目子路径
- 支持减少动态效果和键盘导航
- 带有Astro官方GitHub Pages部署工作流

## 快速开始

可以通过GitHub模板创建仓库，也可以克隆到本地，然后执行：

```sh
npm install
npm run dev
```

开发服务器默认地址为`http://localhost:4321`。

## 站点配置

发布前修改`src/config.ts`，主要配置包括站点名称、作者、域名、路径、语言、时区、首页文案、GitHub链接和内容许可证。

使用自定义域名或GitHub用户站点时，将`basePath`设为`/`。如果地址是`https://name.github.io/my-blog/`，则设为`/my-blog`。

在线演示或特定部署可以在构建环境中设置`IMPRINT_SITE_URL`、`IMPRINT_BASE_PATH`、`IMPRINT_AUTHOR`和`IMPRINT_GITHUB_URL`，它们会覆盖`src/config.ts`中的默认值。

颜色、字体、间距和响应式规则位于`src/styles/global.css`，文件开头的CSS自定义属性是主要设计变量。

## 编写文章

将Markdown文件放入`src/content/posts/`的任意子目录。子目录会成为文章固定链接的一部分，例如：

```text
src/content/posts/2026/hello-world.md
```

对应地址为`/2026/hello-world/`。

frontmatter示例：

```yaml
---
title: Hello World
date: 2026-08-24T09:00:00+08:00
updated: 2026-08-25T09:00:00+08:00
description: 用于文章列表和页面元数据的简短摘要。
categories:
  - 笔记
tags:
  - Astro
  - 写作
archived: false
noindex: false
---
```

只有`title`和`date`是必填字段。没有填写`description`时，主题会从Markdown正文自动提取摘要。

## 使用中文界面

英文是默认界面语言。将`src/config.ts`中的语言和地区配置改为：

```ts
language: 'zh',
htmlLang: 'zh-CN',
locale: 'zh-CN',
timeZone: 'Asia/Shanghai',
```

界面文案统一位于`src/i18n.ts`。增加其他语言时，在其中添加字典并把字典键设为`SITE.language`即可。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 将静态站点构建到`dist/` |
| `npm run preview` | 预览生产构建结果 |
| `npm run check` | 执行类型检查、构建和站内链接检查 |
| `npm run clean` | 删除生成内容 |

Pull Request会在GitHub Actions中执行相同的类型、构建、链接和生产依赖检查。推送到`main`后，只有检查通过才会开始Pages部署。

## 部署到GitHub Pages

1. 在`src/config.ts`中设置正确的`SITE.url`和`SITE.basePath`。
2. 将仓库的`main`分支推送到GitHub。
3. 打开仓库的“Settings→Pages”，将发布源设为“GitHub Actions”。

`.github/workflows/deploy.yml`会自动构建和部署站点。部署到其他静态托管服务时，执行`npm run build`并发布`dist/`即可。

## 开源许可证

主题源码使用[MIT许可证](./LICENSE)。博客内容仍归站点作者所有，可以在`src/config.ts`中选择单独的内容许可证。
