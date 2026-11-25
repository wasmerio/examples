# Breeze

一个简洁、清爽的 Astro 个人网站主题。

基于 [Astro 5](https://astro.build)、[Tailwind CSS v4](https://tailwindcss.com) 和 TypeScript 构建。

[English Documentation](./README.md)

[更新日志 / Changelog](./CHANGELOG.md)

## 特性

- 深色 / 浅色模式平滑切换
- 全文搜索（Pagefind，Cmd+K）
- RSS 订阅和站点地图
- Artalk 评论系统（可选）
- Umami 数据分析（可选）
- 内容集合（文章、项目、分类、标签、友链）
- 文章目录
- Expressive Code 代码高亮
- View Transitions 页面过渡
- 响应式设计
- OKLch 色彩系统，轻松自定义主题色

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/your-username/astro-theme-breeze.git my-site
cd my-site

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 配置

所有站点配置集中在 `src/config/site.ts`，这是你个性化主题唯一需要编辑的文件。

| 配置项       | 说明                             |
| ------------ | -------------------------------- |
| `meta`       | 站点标题、描述、作者、Logo、语言 |
| `navigation` | 导航菜单项及副标题               |
| `social`     | 社交链接（GitHub、邮箱等）       |
| `hero`       | 首页问候语、描述、信息卡片       |
| `footer`     | 版权和底部文案                   |
| `comments`   | Artalk 评论系统配置              |
| `features`   | 功能开关（搜索、RSS）            |
| `tools`      | 工具箱 / 技术栈页面数据          |
| `labels`     | 所有 UI 文案（方便国际化）       |

同时修改 `astro.config.mjs` 中的 `site` 为你的域名。

## 内容管理

### 博客文章

在 `src/content/posts/` 目录下添加 Markdown 或 MDX 文件：

```yaml
---
title: 我的第一篇文章
createdAt: 2025-01-01
category: technology
tags: [astro, tutorial]
summary: 文章简介。
---
```

### 关于页面

编辑 `src/content/pages/about.md`，纯 Markdown 格式，无需了解组件知识。

### 项目作品

在 `src/content/projects/` 目录下添加，frontmatter 包含：`title`、`description`、`tech`、`link`、`status`。

### 分类与标签

编辑 `src/content/miscs/categories.json` 和 `src/content/miscs/tags.json`。

### 友链

编辑 `src/content/miscs/friends.json`，字段：`name`、`description`、`link`、`avatar`。

## 主题色

编辑 `src/styles/theme.css`，所有颜色基于 OKLch 色彩空间，使用统一的色调值（默认：165）。

修改主题色只需全局替换色调数值：

- `165` = 鼠尾草绿（默认）
- `250` = 海洋蓝
- `280` = 薰衣草紫
- `330` = 玫瑰粉
- `30` = 暖橙色

## 评论系统（Artalk）

1. 部署 [Artalk](https://artalk.js.org) 服务端
2. 复制 `.env.example` 为 `.env`
3. 填写 `PUBLIC_ARTALK_SERVER=https://你的-artalk-地址`
4. 如需显式控制开关，可额外设置 `PUBLIC_ARTALK_ENABLED=true` 或 `false`

这些变量通过 `astro.config.mjs` 中的 `env.schema` 统一声明，并由 Astro 自动提供类型。
在 Cloudflare Pages 中，直接把 `PUBLIC_ARTALK_SERVER` 添加到项目环境变量即可，无需再修改 `src/config/site.ts`。

## 数据分析（Umami）

1. 复制 `.env.example` 为 `.env`
2. 填写 `UMAMI_URL=https://你的-umami-脚本地址`
3. 填写 `UMAMI_WEBSITE_ID=你的站点 ID`

这些变量同样通过 `astro.config.mjs` 中的 `env.schema` 统一声明，并由 Astro 自动提供类型。
在 Cloudflare Pages 中，直接把 `UMAMI_URL` 和 `UMAMI_WEBSITE_ID` 添加到项目环境变量即可。

## 部署

支持任意静态托管平台：Vercel、Netlify、Cloudflare Pages 等。

```bash
pnpm build
```

构建产物在 `dist/` 目录。

## 许可证

MIT
