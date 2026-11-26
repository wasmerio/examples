# 部署

Wisp 构建为纯静态站点，输出目录为 `dist/`，可以部署到任何静态托管平台。本文介绍 Netlify、Cloudflare Pages 和 GitHub Pages 的设置，以及 `site` 和图表源文件的响应头。

## 发布前检查

1. 把 `astro.config.ts` 中的 `site` 改成正式域名（必须包含协议，如 `https://blog.example.com`）。它决定 Sitemap、RSS 和 draw.io 链接中的绝对地址。
2. 确认 `site.title`、`site.description`、`site.author` 已修改。
3. 运行：

   ```bash
   pnpm check      # 类型、ESLint、Prettier、单元测试、对比度和图表清单
   pnpm diagram check  # 图表源文件与 .wisp.svg 一致
   pnpm build      # 应当零警告通过
   pnpm preview    # 本地检查 dist/
   ```

4. 确认没有遗留的 `draft: true` 文章需要发布，或确认草稿不应公开。生产构建会过滤草稿。

## 构建环境

所有平台都使用同样的构建命令：

| 项目     | 值                                          |
| -------- | ------------------------------------------- |
| 构建命令 | `pnpm build`                                |
| 发布目录 | `dist`                                      |
| Node.js  | ≥ 22.23.4                                   |
| 包管理器 | pnpm 12.18.0（使用锁文件 `pnpm-lock.yaml`） |

构建环境只需要 Node 和 pnpm。`pnpm diagram build` 不需要在部署环境中运行，因为生成的 `.wisp.svg` 已经提交进仓库；构建时只复制源文件和读取已提交的 SVG。CI 中运行 `pnpm diagram check` 即可确认它们与源文件一致。

各平台指定 Node 版本的方式不同，请以平台文档为准。例如 Netlify 可以用环境变量 `NODE_VERSION=22.23.4`。仓库通过 `package.json#packageManager` 声明 pnpm 版本，平台若不自动读取该字段，可在构建设置中显式指定 `12.18.0`。

## Netlify

1. 在 Netlify 中导入 Git 仓库。
2. 构建设置：
   - Build command：`pnpm build`
   - Publish directory：`dist`
3. 在环境变量中设置 `NODE_VERSION=22.23.4`。
4. 部署。之后每次推送都会自动构建。

响应头可以通过 `public/_headers` 文件设置（构建后位于发布目录根下），见下文。

## Cloudflare Pages

1. 在 Cloudflare 控制台中创建 Pages 项目，连接 Git 仓库。
2. 框架预设选择 **None**，或 Astro（如果平台提供），然后设置：
   - Build command：`pnpm build`
   - Build output directory：`dist`
3. 在环境变量中设置 `NODE_VERSION=22.23.4`。
4. 部署。

Cloudflare Pages 同样支持 `_headers` 文件，放在发布目录的根下即可。

## GitHub Pages

GitHub Pages 通过 Actions 部署。在 `.github/workflows/` 中使用官方的 Pages 工作流，核心步骤如下：

```yaml
- uses: pnpm/action-setup@v4
- uses: actions/setup-node@v4
  with:
    node-version: 22.23.4
    cache: pnpm
- run: pnpm install --frozen-lockfile
- run: pnpm build
- uses: actions/upload-pages-artifact@v3
  with:
    path: dist
```

之后再使用 `actions/deploy-pages` 发布。

注意两点：

- 部署在 `https://<用户>.github.io/<仓库>/` 这样的子路径下时，在 `astro.config.ts` 中设置 `base` 即可，主题内部链接和 RSS 会自动带上该子路径。
- GitHub Pages 不支持自定义响应头，无法设置 `_headers`。图表源文件的下载依赖 HTML 的 `download` 属性，通常仍能正常保存，但文件的 `Content-Type` 由服务器决定。

## site 的设置

Astro 的 `site` 对以下功能有影响：

| 功能                            | 影响                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Sitemap（`/sitemap-index.xml`） | 所有 URL 使用 `site` 作为前缀                                                        |
| RSS（`/rss.xml`）               | 频道链接和条目链接的绝对地址                                                         |
| canonical 与 Open Graph         | 页面的规范地址                                                                       |
| 在 draw.io 中打开               | `.drawio` 的链接会生成为 `https://app.diagrams.net/#U<绝对地址>`，地址由 `site` 决定 |

默认值 `https://example.com` 只用于开发和示例。忘记修改时，RSS 和 Sitemap 会指向错误的域名。

## 图表源文件的响应头

图表源文件通过 `/diagrams/...` 提供下载。它们的扩展名决定了 `Content-Type`：

- `.excalidraw`：`application/json; charset=utf-8`
- `.drawio`：`application/xml; charset=utf-8`

这些类型在开发服务器中已经设置。部署后，静态平台可能把 `.excalidraw` 和 `.drawio` 当作 `application/octet-stream` 提供。这不影响下载，但如果希望浏览器以对应类型处理，可以在发布目录中添加 `_headers` 文件（放在 `public/_headers`，构建时会被复制到 `dist/_headers`）：

```text
/diagrams/*
  X-Content-Type-Options: nosniff

/diagrams/*.excalidraw
  Content-Type: application/json; charset=utf-8

/diagrams/*.drawio
  Content-Type: application/xml; charset=utf-8
```

说明：

- `_headers` 的路径模式语法由平台决定。Netlify 和 Cloudflare Pages 都使用这种格式，但扩展名通配符的支持范围请以各自文档为准。
- 部署后用 `curl -I https://<你的域名>/diagrams/<文件名>` 检查 `Content-Type` 是否符合预期。如果平台不支持按扩展名匹配，可以只保留 `nosniff` 规则。
- `public/` 目录下的 `_headers` 不会被 Wisp 生成或修改，需要你自己创建。

## 检查清单

- [ ] `astro.config.ts` 的 `site` 已改为正式域名
- [ ] `pnpm build` 零警告
- [ ] `pnpm check` 通过（或 CI 中的 `pnpm diagram check` 通过）
- [ ] 首页、文章页、标签页、RSS 和 Sitemap 可以访问
- [ ] 图表的源文件下载链接可以下载
- [ ] （可选）`_headers` 已设置并验证
