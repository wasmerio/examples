# 快速开始

本文介绍如何在本地运行 Wisp、创建第一篇文章并构建站点。

## 环境要求

- **Node.js ≥ 22.23.4**（Astro 7 的要求，低于此版本会安装失败）
- **pnpm 12.18.0**（版本由 `package.json#packageManager` 固定，锁文件为 `pnpm-lock.yaml`）

## 方式一：用 starter 创建新站点

Wisp 以 Astro 集成包 `astro-wisp` 分发。starter 只包含站点配置和示例内容，主题本身从 npm 安装：

```bash
pnpm create astro@latest my-blog -- --template xingcanlee/astro-wisp/template
cd my-blog
pnpm dev
```

得到的项目结构：

```text
my-blog/
├─ astro.config.ts          # site + wisp({...})
├─ src/content.config.ts    # 内容集合（astro-wisp/content 的 loader 与 schema）
├─ src/content/posts/       # 文章
├─ src/content/pages/       # about.md
└─ src/styles/custom.css    # 可选的样式覆盖
```

## 方式二：加到已有的 Astro 项目

```bash
pnpm astro add astro-wisp
```

`astro add` 会安装包并把 `wisp()` 加进 `astro.config.ts`。然后：

1. 在 `astro.config.ts` 中设置 `site`（正式域名）。
2. 按 [配置参考 · 内容集合](./configuration.md#内容集合) 在 `src/content.config.ts` 中声明 `posts` 和 `pages`。
3. 删掉 `src/pages/` 里与主题路由重名的页面（如 `index.astro`），或用 `routes` 开关关闭对应的主题路由。

## 方式三：克隆仓库开发主题

```bash
git clone https://github.com/xingcanlee/astro-wisp.git
cd astro-wisp
pnpm install
pnpm dev                # 演示站，直接使用 packages/astro-wisp 的源码
pnpm build:template     # 构建 starter
```

开发服务器默认运行在 <http://localhost:4321>。修改 `packages/astro-wisp/` 或 `src/content/` 下的文件会自动刷新页面。

## 第一次修改

1. **站点信息**：编辑 `astro.config.ts`：把 `site` 改成正式域名（用于 Sitemap、RSS 和部署后的绝对链接，详见 [部署](./deployment.md)），把 `wisp({ site })` 中的 `title`、`author` 改成你自己的。
2. **导航**：修改 `wisp({ nav })`，它整体替换默认导航。
3. **写一篇文章**：在 `src/content/posts/` 下新建目录，参见 [写作指南](./writing.md)。
4. **关于页**：编辑 `src/content/pages/about.md`。

## 升级主题

```bash
pnpm up astro-wisp
```

主题的页面、布局、组件和样式都在 `node_modules/astro-wisp` 中，站点仓库里只有配置、内容和你自己的覆盖文件，所以升级不会和你的修改冲突。跨大版本升级前请阅读 CHANGELOG：配置项、可覆盖组件的名称和 props 的不兼容改动只出现在大版本。

完整配置项见 [配置参考](./configuration.md)。

## 构建与预览

```bash
pnpm build      # 生成静态站点到 dist/
pnpm preview    # 在本地预览 dist/
```

`pnpm build` 应当零警告通过。发布前可以运行质量门禁：

```bash
pnpm check
```

starter 的 `pnpm check` 包括 `astro check` 和图表 manifest 校验（`wisp diagram check`）。主题仓库额外把 `tsc`、ESLint、Prettier、Vitest 和对比度检查纳入同一个质量门禁。

## 可选：图表工具

只使用 Mermaid 图表时不需要额外工具。需要在本地**生成** Excalidraw 或 draw.io 图表（`pnpm diagram build`、`pnpm diagram export`）时，还需要：

- **Playwright Chromium**：Excalidraw 导出和 draw.io 的 browser 方式。安装依赖后执行 `pnpm exec playwright install chromium`。
- **draw.io**（可选）：draw.io desktop CLI 或 Docker 镜像。不装时会回退到 browser 方式。

执行 `pnpm diagram probe` 可以查看当前可用的导出方式。CI 只运行 `pnpm diagram check`，不需要这些工具。详见 [图表指南](./diagrams.md)。

## 下一步

- [写作指南](./writing.md)：frontmatter、Markdown 与 MDX、公式、代码、中文写作建议
- [图表指南](./diagrams.md)：三类图表、引用语法、源文件下载
- [交互组件](./explainers.md)：在文章中使用交互讲解
- [部署](./deployment.md)：发布到静态托管平台
