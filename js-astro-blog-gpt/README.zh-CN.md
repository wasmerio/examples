# BlogGPT

**受 ChatGPT 界面启发、基于 [Astro](https://astro.build/) 构建的现代博客主题。**

使用 Markdown 或 MDX 轻松写作，通过纯文件管理博客内容。熟悉的侧边栏导航、沉浸式正文阅读区与即时全文搜索，帮助读者快速找到感兴趣的内容。

[English](README.md) · **简体中文**

[在线演示](https://demo.bloggpt.reincarnatey.net) · [使用文档](https://bloggpt.reincarnatey.net/) · [GitHub 仓库](https://github.com/Raincarnator/astro-theme-BlogGPT)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRaincarnator%2Fastro-theme-BlogGPT-starter)
&nbsp;
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Raincarnator/astro-theme-BlogGPT-starter)

推荐使用官方提供的[精简模板（Starter）](https://github.com/Raincarnator/astro-theme-BlogGPT-starter)初始化博客，内含一篇示例文章、一个关于页面和开箱即用的基础配置。 也可以先[使用 GitHub 模板创建仓库](https://github.com/Raincarnator/astro-theme-BlogGPT-starter/generate)，再连接托管平台。主仓库另含完整演示内容和文档工作区。

> **快速上手：** 请先阅读[安装与预览](https://bloggpt.reincarnatey.net/guide/getting-started)，再参考[使用文档](https://bloggpt.reincarnatey.net/)自定义外观并开始写作。

![BlogGPT 首页：全文搜索与可拖拽调整宽度的侧边栏](.github/assets/readme/home.webp)

## 核心特性

| 模块               | 功能亮点                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **阅读界面**       | 响应式布局、可拖拽调整宽度的侧边栏、浅色/深色/跟随系统主题、悬浮与可折叠目录（TOC）、键盘快捷键与平滑的无刷新切页            |
| **内容组织**       | 支持文章、独立页面、分类与标签；支持嵌套文件夹、自定义 Slug、携带本地附件的内容包（Bundle）以及命令行新建模板（Archetypes）  |
| **正文增强**       | 原生支持 Markdown / MDX、Expressive Code 代码高亮、KaTeX 数学公式、Mermaid 流程图、Callouts 提示块与点击图片放大（Lightbox） |
| **内容浏览**       | 侧栏置顶文章、时间线归档、分页与页码跳转、多种分类封面样式、标签词云与分组友情链接                                           |
| **站内搜索**       | 基于 Pagefind 的静态全文检索，提供文章、标题与摘要、正文、全站四种范围，支持关键词高亮与 `/` 命令                            |
| **多语言（i18n）** | 内置简体中文与英文界面，支持多语言路由策略、按文件名关联译文以及自定义界面文案                                               |
| **统计与分享**     | 单篇字数与预计阅读时间、全站写作统计面板与发文热力图、自定义文案一键复制分享、自动生成动态 Open Graph 社交分享封面           |
| **扩展与 SEO**     | 提供 Open Graph、Twitter Cards、RSS 订阅源与 Sitemap，并支持通过 `custom/` 注入 HTML、CSS 和客户端脚本                       |

## 界面预览

### 文章页 · 浅色

![浅色模式文章页](.github/assets/readme/article-light.webp)

<details>
<summary>展开查看另外六张界面预览</summary>

### 文章列表

![带封面、标签与分页的文章列表](.github/assets/readme/posts.webp)

### 文章页 · 深色

![深色模式文章页](.github/assets/readme/article-dark.webp)

### 分类

![分类封面与标签词云](.github/assets/readme/categories.webp)

### 归档

![按年份排列的文章归档](.github/assets/readme/archives.webp)

### 友链

![分组友链与资源](.github/assets/readme/friends.webp)

### 统计

![写作统计、发文热力图与文章篇幅图](.github/assets/readme/statistics.webp)

</details>

## 快速开始

请参阅[安装与预览指南](https://bloggpt.reincarnatey.net/guide/getting-started)，了解如何拉取模板、安装依赖并在本地启动预览。

## 开源协议

主题代码基于 [Apache-2.0](LICENSE) 开源，文档采用 [MIT 协议](apps/docs/LICENSE)。随附资源与依赖的许可信息见[第三方声明](THIRD_PARTY_NOTICES.md)。
