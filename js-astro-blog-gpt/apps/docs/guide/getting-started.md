# 安装与预览

本指南将带你在本地快速搭建 BlogGPT 博客、完成基础配置并发布第一篇文章。

## 环境要求

在开始之前，请确保本地已安装以下环境：

- **Node.js**：Starter 使用 `24.x`（主仓库也支持 `>= 22.12.0`）
- **pnpm**：使用 `package.json` 中锁定的版本

可在终端运行以下命令检查当前版本：

```bash
node --version
pnpm --version
```

## 初始配置

最省心的方式是直接克隆官方提供的 [BlogGPT Starter 精简模板](https://github.com/Raincarnator/astro-theme-BlogGPT-starter)，其中已包含完整的目录结构与示例内容：

```bash
git clone https://github.com/Raincarnator/astro-theme-BlogGPT-starter.git my-blog
cd my-blog
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm dev
```

启动成功后，在浏览器访问 `http://localhost:4321` 即可实时预览博客。

### 修改个人基础信息

正式开始写作前，建议先修改以下三处配置：

1. **`blog.config.ts`**：修改 `site.title`（博客标题）、`site.baseUrl`（正式域名）以及 `author`（你的昵称、简介、头像路径和社交链接）。
2. **`friends.config.ts`**：初始只有官方文档站，可按需添加或清空友链。
3. **`content/pages/`**：编辑内置的 `about` 页面，换上你的个人介绍。

## 写第一篇文章

你可以直接在 `content/posts/` 目录下新建 `.md` 文件，也可以使用内置的 `pnpm new` 命令从模板快速创建：

```bash
# 创建单文件文章：content/posts/hello.mdx
pnpm new post hello --title "我的第一篇文章"

# 创建内容包（Bundle）文章：content/posts/travel/index.mdx（适合包含多张本地配图或附件的文章）
pnpm new post travel --use bundle --title "旅行随笔"
```

打开生成的文件编写 Markdown 正文并保存，浏览器预览会自动热更新。模板默认设置 `draft: true`；准备发布时，请改为 `draft: false`，并设置不晚于构建时间的发布日期。

## 预览正式构建结果

开发模式可通过 JSON 数据进行全文搜索；正式站点使用的 Pagefind 索引与自动生成的 Open Graph 分享封面则在生产构建时生成。如果想在发布前完整验证这些功能，请运行：

```bash
pnpm build
pnpm preview
```

## 常用命令

| 命令                     | 说明                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `pnpm dev`               | 启动本地开发服务器，支持实时热更新（默认显示 `draft: true` 的草稿文章）                      |
| `pnpm new <类型> <slug>` | 基于 `archetypes/` 模板新建文章（`post`）、页面（`page`）、分类（`category`）或标签（`tag`） |
| `pnpm build`             | 生成生产环境静态网页与全文搜索索引至 `dist/` 目录                                            |
| `pnpm preview`           | 在本地启动静态服务器，预览 `dist/` 目录中的正式构建产物                                      |
| `pnpm astro sync`        | 重新生成 Astro 内容集合的 TypeScript 类型定义                                                |
