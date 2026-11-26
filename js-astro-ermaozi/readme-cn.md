# ermaozi

[English](./README.md) | 简体中文

`ermaozi` 是一个面向博客、知识库和产品文档的 Astro 静态主题。内置双语路由、自动文档侧栏、Pagefind 全文搜索、深色模式、分类、标签、归档、SEO 和增强 Markdown。

> The ermaozi Astro theme with full-text search, dark mode, taxonomies, SEO, and enhanced Markdown.

> [!WARNING]
> 当前 `0.2` 系列仍处于测试阶段。功能和配置尚未完全稳定，后续版本可能包含破坏性更新；测试期间请固定版本，并在升级前查看 Release 说明。

在线演示：<https://astro.ermao.net>

创建新站点并自动安装依赖：

```bash
npm create astro-theme-ermaozi
```

也可以直接指定目录，或使用对应包管理器的创建命令：

```bash
npm create astro-theme-ermaozi my-site
pnpm create astro-theme-ermaozi my-site
yarn create astro-theme-ermaozi my-site
```

交互向导可选择简体中文或 English 作为根语言，并决定是否显示多语言入口。自动化创建可追加 `-- --yes --lang=en-US --multilingual`；生成器会同步调整内容目录、永久链接、翻译关系和站内链接。

## 开始使用

需要 Node.js 22.12+，可使用 npm、pnpm 或 Yarn。

```bash
# npm
npm install
npm run dev

# pnpm
pnpm install
pnpm dev

# Yarn
yarn install
yarn dev
```

`dev` 直接启动支持热更新的 Astro 开发服务器。开发模式不生成 Pagefind 索引；需要验收搜索和生产产物时运行 `npm run build && npm run preview`。`dev:fast` 作为旧命令别名保留。

## 定制站点

第一次搭建建议按[零基础快速开始](./content/docs/guide/getting-started.md)操作。日常只需要修改 `site.config.mjs` 和 `content/`；不改 `theme/` 更便于以后更新主题。`defineSiteConfig()` 会为常用配置提供编辑器补全，`npm run check` 会定位常见配置错误。

1. 在 [`site.config.mjs`](./site.config.mjs) 修改域名、站名、作者、导航和可选服务。
2. 替换 [`public/img/logo.svg`](./public/img/logo.svg)。
3. 删除 `content/` 中的示例文章并添加自己的 Markdown。
4. 运行当前包管理器对应的 `validate` 命令。

中文文章放在 `content/blog/分类/`，英文文章放在 `content/en/blog/category/`。文档放在 `content/docs/` 和 `content/en/docs/`，设置 `type: doc` 后会自动生成分组侧栏和上下篇导航。建议为长期页面设置稳定的 `permalink`；英文版本通过 `translationOf` 指向中文路由。

最小 frontmatter：

```yaml
---
title: My post
description: What the reader will learn.
permalink: /blog/my-post/
createTime: 2026-08-05
tags: [Astro]
type: post # post、doc 或 page
---
```

文档可使用 `group`、`order` 和 `badge` 控制侧栏分组、排序和徽章。没有设置 `permalink` 时，主题会根据文件路径生成路由，并移除文件或目录开头用于排序的 `数字.` 前缀。

## 内置功能

- 静态输出，以及博客、普通页面和文档三种内容模式
- 中文/英文内容及 `hreflang`
- Pagefind 全文搜索
- 浅色、深色和系统主题
- 分类、标签、归档和客户端分页
- 自动文档侧栏、移动端文档目录、上下篇导航和 Markdown 源文导出
- Shiki 双主题代码高亮、标题、行号、行高亮和代码复制
- 脚注、提示框、任务列表、`==标记==`、文件树、代码树、步骤、窗口、表格复制、折叠面板、标签页和 Mermaid
- 构建时 PBKDF2 + AES-GCM 页面/局部内容加密、二维码和 npm/GitHub 状态徽章
- 图片点击预览，以及 YouTube、Bilibili、音频、视频和 PDF 嵌入
- canonical、Open Graph、JSON-LD、sitemap、robots、llms.txt
- 可选 Giscus 评论和自托管互动 API

评论、浏览量、点赞和热门文章默认关闭。启用前需要在 `site.config.mjs` 配置对应功能与服务地址；纯静态部署不需要任何后端。静态站点的内容加密不能替代服务端访问控制：不要把密码或真正机密的内容提交到公开仓库。Algolia、Waline、Twikoo 和 Artalk 仍需要接入真实服务。

## 命令

```bash
npm run check          # Astro 与 TypeScript 检查
npm run build          # 静态构建与搜索索引
npm run deploy         # 生成可部署的 dist/，不会上传到任何平台
npm test               # 构建产物测试
npm run test:visual    # 浏览器交互与响应式测试
npm run audit          # 路由、SEO、隐私和危险标记审计
npm run validate       # 发布前完整非浏览器检查
```

上表使用 npm 展示；pnpm 和 Yarn 同样使用这些脚本名。为避免与 pnpm 自带的 `deploy` 命令冲突，请写成 `pnpm run deploy`。

## 静态部署

创建向导可生成 GitHub Pages、GitLab Pages、Netlify、Vercel 或 Firebase Hosting 配置，也可选择 Custom。三种包管理器都会生成同一份 `dist/`：

```bash
npm install && npm run deploy
pnpm install && pnpm run deploy
yarn install && yarn deploy
```

选择 Custom 时，将 `dist/` 设为静态站点发布目录即可。托管平台的构建命令使用上面任意一行，输出目录填写 `dist`。项目站部署在子路径时设置 `site.config.mjs` 的 `base`；CI 也可通过 `SITE_ORIGIN` 和 `BASE_PATH` 覆盖域名与子路径。完整步骤见[部署站点](./content/docs/guide/deployment.md)。

依赖审计命令因包管理器不同而不同：分别使用 `npm audit --omit=dev`、`pnpm audit --prod` 或 `yarn npm audit --environment production`。

## 发布初始化器

`npm create astro-theme-ermaozi` 会由 npm 解析并执行 `create-astro-theme-ermaozi` 的正式版本。发布前在初始化器目录检查模板包：

```bash
cd internal/create
npm test
npm pack --dry-run
npm publish --access public
```

只有最后一步成功发布到 npm 后，公开的 `npm create astro-theme-ermaozi` 命令才会生效；本项目不会在构建或测试时自动发布。正式版本使用 npm `latest` 标签，预发布版本使用 `beta`。

后续版本可由 [`.github/workflows/publish-npm.yml`](./.github/workflows/publish-npm.yml) 自动发布：

1. 在 npm 的 `create-astro-theme-ermaozi` 包设置中配置 GitHub Actions Trusted Publisher：用户 `ermaozi`、仓库 `astro-theme-ermaozi`、工作流 `publish-npm.yml`，并允许 `npm publish`。
2. 不需要创建 `NPM_TOKEN` 或 GitHub Actions secret；工作流使用短期 OIDC 凭证发布。
3. 将初始化器的 `package.json` 版本改为 `x.y.z`，通过完整校验后创建并发布标签为 `vx.y.z` 的 GitHub Release。

工作流会重新安装依赖、执行 `pnpm validate`、校验 Release 标签与包版本完全一致，再通过 npm Trusted Publisher 发布；标签不匹配或版本已存在时会停止。

## 项目结构

顶层只保留日常内容、公开资源、站点配置和 Astro 必需文件；主题实现与维护脚本统一收在 `theme/`，普通使用无需进入该目录。

- `content/`：中英文页面和示例文章
- `public/`：Logo、图片和其他原样发布的静态文件
- `site.config.mjs`：站点身份、导航和可选服务
- `theme/components/`：无业务配置的界面组件与少量客户端交互
- `theme/lib/`：共享的内容、导航、Markdown 和 SEO 逻辑
- `theme/styles/`：全局变量、主题样式和 Plume 兼容样式
- `theme/scripts/audit.mjs`：独立项目审计

新增功能时优先复用 `theme/lib/` 的共享逻辑；页面负责组装数据，组件负责显示，站点差异留在 `site.config.mjs` 和 Markdown 中。这样初始化器模板与普通站点使用同一套代码，不需要维护两份实现。

## 许可证与署名

`theme/styles/vendor/` 包含来自 VuePress Theme Plume 的兼容样式，其 MIT 许可证保存在 [`theme/styles/vendor/LICENSE`](./theme/styles/vendor/LICENSE)。

项目代码使用 [`MIT License`](./LICENSE)，第三方说明见 [`theme/licenses/THIRD_PARTY_NOTICES.md`](./theme/licenses/THIRD_PARTY_NOTICES.md)。代码许可证不会自动覆盖你添加的文章、图片和第三方素材。
