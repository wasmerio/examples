---
title: "部署"
description: "将 astro-content-hub 模板指向 GitHub Pages 和/或 Cloudflare Pages。"
order: 4
---

中心是一个静态 Astro 7 站点,可免费部署到 **GitHub Pages** 与 **Cloudflare
Pages**。本页介绍如何将该模板指向你自己的基础设施。

## 部署前

1. **设置站点 URL。** 在 `astro.config.mjs` 中,将 `site` 设为你的部署源 -- 例如
   GitHub Pages 项目站点 `https://your-name.github.io/astro-content-hub`,或自定义域名
   `https://your-domain.com`。该值用于构建规范链接、Open Graph 与 `hreflang`
   绝对 URL。模板默认填入 awareride 项目地址作为示例。
2. **设置站点名称。** 在 `src/lib/i18n.ts` 中,将 `siteName`(默认
   `'Astro Content Hub'`)改为你的项目名称。它会出现在 `<title>`、导航与页脚中。
3. **按你的 URL 选择部署目标。** 模板生成**根绝对**链接与资源路径
   (`/posts`、`/_astro/...`、`/favicon.ico`),因此在**站点根目录**下可直接使用:
   - **Cloudflare Pages**(`<project>.pages.dev`)或 GitHub Pages 的**自定义域名**
     -- 无需额外路径配置。若使用 GitHub Pages 自定义域名,请新建 `public/CNAME`
     文件并写入你的域名(模板默认不提供该文件)。
   - **GitHub Pages 项目路径**(`https://<owner>.github.io/<repo>/`)属于**子路径**
     部署:需在 `astro.config.mjs` 中设置 `base: '/<repo>/'`,并将所有根绝对链接与
     资源路径加上 `import.meta.env.BASE_URL` 前缀。(模板默认使用根绝对路径,因此根
     或自定义域名部署最为简单。)
4. **替换示例内容。** 删除 `src/content/` 下的示例文章与文档,添加你自己的
   内容(参见[编写内容](./authoring.md))。

## 部署工作流

`.github/workflows/deploy.yml` 仅作为**模板配置**提交 —— 它未连接到任何真实
目标。它通过 Actions 选项卡的 **手动** 触发(`workflow_dispatch`);它**不会**
在推送到 `main` 时自动运行。

该工作流包含三个作业:

1. **build** —— 检出代码、运行 `npm ci`、用 `npm run build` 构建,并将 `dist/`
   作为 Pages 产物上传。
2. **deploy-gh-pages** —— 将产物部署到 GitHub Pages(需要为仓库启用 Pages)。
3. **deploy-cf-pages** —— 通过 `wrangler` 将 `dist/` 部署到 Cloudflare Pages。

## 启用 GitHub Pages

- 在仓库 **Settings → Pages** 中,将来源设为 "GitHub Actions"。
- 从 Actions 选项卡运行工作流("Run workflow")。
- 除非你通过 `public/CNAME` 设置了自定义域名,否则线上地址为
  `https://<owner>.github.io/<repo>/`。项目路径属于子路径部署 -- 参见上方第 3
  步:需要设置 `base: '/<repo>/'` 并使用 base 感知的链接。自定义域名(配合
  `public/CNAME`)部署在根目录,无需 `base`。

## 启用 Cloudflare Pages

1. 在仓库(**Settings → Secrets and variables → Actions**)中创建 API token 与
   account ID 密钥:`CLOUDFLARE_API_TOKEN`(具有 Pages 部署权限)与
   `CLOUDFLARE_ACCOUNT_ID`。
2. 将仓库变量 `CF_PROJECT` 设为你的 Cloudflare Pages 项目名
   (**Settings -> Secrets and variables -> Actions -> Variables**)。`deploy-cf-pages`
   作业以它为开关:若不设置,则仅部署到 GitHub Pages。
3. 运行工作流。`wrangler pages project create` 步骤是幂等的(`|| true`),因此
   重复运行是安全的。

## Node 版本

工作流使用 **Node 22**(`setup-node@v4`,`node-version: 22`),与项目支持的运行时
一致。使用 `npm`,而非 `pnpm`/`yarn`。

## 验证

```bash
npm run build   # 必须 0 错误(astro check + build)
```

手动运行后,抽查部署出的 `dist/`:

```bash
ls dist/
ls dist/vite/docs/   # 示例产品文档
ls dist/zh-Hans/     # 本地化路由
```
