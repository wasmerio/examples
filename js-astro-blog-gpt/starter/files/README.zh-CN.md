# BlogGPT Starter 精简模板

这是 [BlogGPT](https://github.com/Raincarnator/astro-theme-BlogGPT) 的官方初始化模板，助你快速搭建受 ChatGPT 界面启发的 [Astro](https://astro.build/) 个人博客。

- **在线演示**：[https://demo.bloggpt.reincarnatey.net](https://demo.bloggpt.reincarnatey.net)
- **完整文档**：[https://bloggpt.reincarnatey.net/](https://bloggpt.reincarnatey.net/)

[English](README.md) · **简体中文**

[使用此模板创建仓库](https://github.com/__STARTER_REPOSITORY__/generate)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F__STARTER_REPOSITORY__)
&nbsp;
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/__STARTER_REPOSITORY__)

模板链接会创建你自己的 GitHub 仓库；部署按钮还会配置静态站点托管。之后向自己的仓库提交更改，即可触发重新构建。上游 Starter 自动同步不会覆盖通过模板创建的个人仓库。

## 快速开始

### 1. 环境要求

- **Node.js** `24.x`
- **pnpm** `package.json` 中锁定的版本

### 2. 安装依赖并启动预览

```bash
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm dev
```

启动后在浏览器访问 `http://localhost:4321` 即可查看实时效果。

### 3. 新建文章

使用内置命令行工具快速生成带有 Frontmatter 的文章：

```bash
# 创建普通单文件文章
pnpm new post my-post --title "你好，世界"

# 创建内容包（Bundle）文章，方便将配图和附件与正文放在同一目录
pnpm new post travel-notes --use bundle --title "旅行随笔"
```

新建文章默认是草稿。准备发布时，请设置 `draft: false`，并选择不晚于构建时间的发布日期。初始的 `content/posts/hello-world.md` 和 `content/pages/about.md` 可以直接修改或删除；友链页面初始只包含官方文档站。

## 目录结构说明

- `blog.config.ts` — 核心配置文件（站点标题、作者名片、外观主题、侧栏导航与功能开关）。
- `friends.config.ts` — 友情链接分组配置。
- `content/` — 存放所有写作内容（`posts/` 文章、`pages/` 独立页面、`categories/` 分类、`tags/` 标签）。
- `archetypes/` — `pnpm new` 使用的默认内容模板。
- `custom/` — 自定义扩展目录（`head.html` 注入头部标签、`styles.css` 覆盖样式、`client.ts` 客户端脚本）。
- `public/` — 静态资源目录（如图标 `favicon.svg`、头像等）。

## 构建与部署

```bash
# 生成正式静态产物至 dist/ 目录
pnpm build

# 在本地预览正式构建结果（含全文搜索索引）
pnpm preview
```

你可以将构建生成的 `dist/` 目录直接部署到 **Vercel**、**Netlify**、**Cloudflare Pages** 或 **GitHub Pages**。模板优先读取 `SITE_URL`，其次使用 Vercel 生产域名或 Netlify 站点地址；本地构建回退到 `https://example.com/`。绑定自定义域名后，请设置 `SITE_URL` 并重新构建，或在 `blog.config.ts` 中把 `site.baseUrl` 改成固定地址。详细步骤请参阅[构建与部署指南](https://bloggpt.reincarnatey.net/guide/deployment)。

主题代码采用 [Apache-2.0](LICENSE)，资源与依赖的许可信息见[第三方声明](THIRD_PARTY_NOTICES.md)。
