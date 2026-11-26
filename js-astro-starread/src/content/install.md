---
title: 主题安装说明
categories: [主题介绍]
description: Star Read是一个出色、简洁且精致的Astro博客主题，提供多种安装方式，项目结构清晰，具备现代UI、搜索支持、响应式设计、主题切换等功能，还提供搜索、主题定制和评论系统的详细配置。
cover: /cover/2c614caca4dd46a2.avif
date: 2026-06-30 12:58:33
---

<div align="center">
  <img src="/logo.png" alt="starread" border="0">
  🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 中文文档 | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>

# Star Read - Astro博客主题

>既有星光般的璀璨，又不失简洁和高端感的Astro主题

## 🚀 特性

- 🎨 现代化UI设计
- 🔍 自动创建本地索引，支持本地离线搜索和Algolia联网搜索
- 📱 响应式设计，适配手机、PC
- 🌙 深色/浅色主题自动切换
- 🏷️ 标签和分类支持
- 📊 文章统计和作者信息展示

## 📂 项目结构

```text
/
├── src/
│   ├── components/     # 组件文件
│   ├── content/        # 内容配置
│   ├── layouts/        # 布局模板
│   ├── pages/          # 页面路由
│   └── styles/         # 样式文件
├── public/             # 静态资源
└── dist/               # 构建输出
```

## 📦 安装

### 方法一：通过CLI工具初始化

| 包管理器       | 建议命令                                  |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` 或 `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init`（需 Yarn v2+） |

>[!note]
>我们提供了`create`命令，方便用户在指定文件夹创建主题

1. 创建项目： 根据您使用的包管理器，选择以下命令之一：

```bash
# 使用 pnpm
pnpm create astro-theme-starread my-blog

# 使用 npm
npx create-astro-theme-starread my-blog

# 使用 yarn
yarn create astro-theme-starread my-blog

# 使用 cnpm
cnpm init astro-theme-starread my-blog
```

2. 进入项目目录：

```bash
cd my-blog
```

3. 安装依赖：

```bash
pnpm install
```

4. 启动开发服务器：

```bash
pnpm dev
```

### 方法二：使用`astro`模版安装

>[!warning]
>该方式需访问Github仓库，确保网络畅通。

| 包管理器       | 命令                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### 方法三：源码安装

>[!warning]
>该方式需访问Github仓库，确保网络畅通。

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>安装完成后，运行开发服务器：
```bash
pnpm dev
```

### 方法四：作为依赖安装到现有 Astro 项目

您可以将主题作为依赖安装到现有的 Astro 项目中，并直接从 node_modules 使用其组件、布局和页面。

1. **安装主题包**：

```bash
# 使用 pnpm
pnpm add astro-theme-starread

# 使用 npm
npm install astro-theme-starread

# 使用 yarn
yarn add astro-theme-starread
```

2. **直接从 node_modules 导入并使用组件**：

```astro
---
// 直接从 node_modules 中的主题导入组件
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>我的 Astro 博客</title>
    <!-- 如需使用主题样式 -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- 使用 node_modules 中的 NavBar 组件 -->
    <NavBar />
    
    <!-- 使用 node_modules 中的 ThemeToggle 组件 -->
    <ThemeToggle />
    
    <article>
      <!-- 使用带属性的 ArticleInfo 组件 -->
      <ArticleInfo 
        title="我的文章"
        date="2024-01-01"
        author="作者名称"
      />
      <p>文章内容...</p>
    </article>
    
    <aside>
      <!-- 使用侧边栏组件 -->
      <AuthorWidget />
      <TagCloud />
    </aside>
  </body>
</html>
```

3. **直接从 node_modules 使用布局**：

```astro
---
// 直接从 node_modules 中的主题导入布局
import { article as ArticleLayout } from 'astro-theme-starread';

// 应用来自 node_modules 的布局
export const layout = ArticleLayout;

// 您的内容
export const content = {
  title: "我的博客文章",
  date: "2024-01-01",
  author: "作者名称",
  tags: ["技术", "博客"]
};
---

<!-- 此内容将在 node_modules 的布局中渲染 -->
<main>
  <p>这是我博客文章的内容。它将在主题的文章布局中渲染。</p>
</main>
```

## 🧞 命令

| 命令                     | 描述                                           |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | 安装依赖                                       |
| `pnpm dev`               | 启动本地开发服务器 `localhost:4321`            |
| `pnpm preview`           | 本地预览构建结果                               |
| `pnpm algolia`           | 推送数据到Algolia搜索                          |
| `pnpm release`           | 版本管理（更新版本号、生成提交等）             |

## 🔍 搜索

跳转到[搜索](/search)

## ⚙️ 自定义配置

跳转到[自定义配置](/configure)


## 🔧 Twikoo 评论

>[!tip]
>如需启用twikoo，请修改`src/compponents/Comment.astro`中的第13行`envId`为您的[twikoo环境地址](https://twikoo.js.org/backend.html)。

```js
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.twikoo) {
      window.twikoo.init({
        envId: 'https://example.com',// 你的环境地址
        el: '#tcomment',
        path: window.location.pathname
      });
    } else {
      console.error('Twikoo 加载失败，请检查 twikoo本地位置或者CDN地址');
    }
  });
</script>
```