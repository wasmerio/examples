# 构建与部署

BlogGPT 在构建后会输出纯静态的 HTML、CSS 与 JavaScript 文件（位于 `dist/` 目录），无需任何后端服务器即可部署在 Vercel、Netlify、Cloudflare Pages 或 GitHub Pages 等任意静态托管平台。

## 一键部署（Starter）

如果你还没有克隆仓库，可以直接基于 [BlogGPT Starter 精简模板](https://github.com/Raincarnator/astro-theme-BlogGPT-starter) 一键创建并部署新博客：

[使用此模板创建仓库](https://github.com/Raincarnator/astro-theme-BlogGPT-starter/generate)

<div class="deploy-badges">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRaincarnator/astro-theme-BlogGPT-starter)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Raincarnator/astro-theme-BlogGPT-starter)

</div>

- **Vercel**：点击 Starter 仓库首页的 **Deploy with Vercel** 按钮，授权 GitHub 后即可自动完成构建配置（构建命令 `pnpm build`，输出目录 `dist`）。
- **Netlify**：点击 **Deploy to Netlify** 按钮，模板内置的 `netlify.toml` 会自动配置好构建命令与发布目录。

## 配置生产地址（Production URL）

在正式部署前，请务必设置站点的线上完整域名，否则 RSS 订阅源、Sitemap、Canonical 规范链接以及社交分享卡片（Open Graph）的图片地址将无法生成正确的绝对路径。

你可以在 `blog.config.ts` 中直接修改 `site.baseUrl`：

```ts
export default {
  site: {
    baseUrl: 'https://blog.example.com',
    // ...
  },
};
```

如果使用 Starter 默认配置，也可以在托管平台中设置 `SITE_URL`（例如 `SITE_URL=https://blog.example.com`）。模板优先读取该变量，其次使用 Vercel 生产域名或 Netlify 站点地址。绑定自定义域名后，请设置 `SITE_URL` 并重新构建。主仓库的 `blog.config.ts` 不读取这个环境变量，使用主仓库或已改为固定 `baseUrl` 时，请直接修改配置。

> **子路径部署：** 支持 `https://example.com/blog/` 这样的地址。请将完整地址（含部署子目录）写入 `site.baseUrl`，主题会据此生成路由与资源路径。

## 构建检查

每次上线或大规模修改配置前，建议先在本地跑一次完整的生产构建检查：

```bash
pnpm build
pnpm preview
```

重点确认以下事项：

1. `pnpm build` 无报错退出，且终端显示已完成 Pagefind 搜索索引生成。
2. 标记了 `draft: true` 的草稿文章没有出现在正式构建列表中。
3. 在 `pnpm preview` 中测试站内搜索、RSS（默认配置下为 `/zh/rss.xml`，其他语言按前缀策略调整）和 Sitemap（`/sitemap-index.xml`）均可正常访问。

## 手动部署与 GitHub Pages

### 常规静态托管平台（Cloudflare Pages、Nginx、对象存储等）

- **安装依赖命令**：`pnpm install`
- **构建命令**：`pnpm build`
- **输出目录**：`dist`
- **Node.js 版本**：Starter 使用 `24.x`；主仓库支持 `22.12.0` 及以上

### GitHub Pages 部署

使用 GitHub Actions 自动部署时：

1. 进入 GitHub 仓库的 **Settings → Pages**，将 **Build and deployment → Source** 设置为 **GitHub Actions**。
2. 按实际访问地址设置 `site.baseUrl`：用户站点可使用 `https://<username>.github.io/`，项目站点则包含仓库子目录，如 `https://<username>.github.io/my-blog/`。
3. 在 `.github/workflows/deploy.yml` 中配置使用 Node.js 24 与仓库锁定版本的 `pnpm` 执行 `pnpm install && pnpm build`，并将 `dist/` 目录上传至 GitHub Pages。
