# astro-theme-aonote

[English](README.md) | 中文

[![在线演示](https://img.shields.io/badge/演示-在线-0ea5e9)](https://astro-theme-aonote.vercel.app)
[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white)](https://astro.build)

基于 **[Astro](https://astro.build) 6** 的静态博客主题 — GFM、MathML 公式、Shiki 代码块、归档、标签与 RSS/Atom。

| | |
| --- | --- |
| **在线演示** | https://astro-theme-aonote.vercel.app |
| **上游项目** | https://github.com/runsli/Aonote |

## 截图

| 首页 — 文章列表、标签云、深色/浅色切换 | 文章页 — 目录导航、MathML 公式、代码高亮 |
| --- | --- |
| ![首页，展示最新文章、标签云与主题切换](docs/screenshots/home.png) | ![文章页，展示侧边目录、数学公式渲染与语法高亮代码块](docs/screenshots/post.png) |

## 特性

- GFM：表格、任务列表、脚注、定义列表、提示块
- 数学公式输出为 **MathML**（temml），无需 KaTeX 全局样式
- Shiki 代码块，支持标题、行高亮、diff 等 Aonote 风格元数据
- 归档、标签、RSS / Atom、站点地图
- 浅色 / 深色主题，中英文界面文案
- 支持子路径部署时的站内链接

## 快速开始

### 作为 Astro 模板（推荐）

```bash
npm create astro@latest my-blog -- --template runsli/astro-theme-aonote
cd my-blog
npm install
npm run dev
```

### 克隆本仓库

```bash
git clone https://github.com/runsli/astro-theme-aonote.git
cd astro-theme-aonote
npm install
npm run dev
```

浏览器打开 http://localhost:4321，然后修改：

1. `src/site.config.ts` — 站点标题、`baseUrl`、语言、版权
2. `src/content/posts/` — Markdown 文章
3. `src/content/pages/about.md` — 关于页

**Node：** ≥ 22.12.0（Astro 6），建议使用 Node 22 LTS。

## 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frunsli%2Fastro-theme-aonote)

1. 在 [Vercel](https://vercel.com/new) 或 [Netlify](https://app.netlify.com/start) 导入仓库（或点上方按钮）。
2. **构建：** `npm run build` · **输出：** `dist`（框架选 Astro）。
3. 部署完成后，将 `src/site.config.ts` 里的 `baseUrl` 改为线上地址。

已包含 `vercel.json`（CSP 头）。Netlify 使用相同构建命令与发布目录。

若要通过 GitHub 派生：在仓库 **Settings** 中勾选 **Template repository**，再用 **Use this template** 或 `npm create astro@latest -- --template runsli/astro-theme-aonote`。

## 自定义

| 内容 | 文件 |
| --- | --- |
| 站点标题、URL、语言 | `src/site.config.ts` |
| 界面文案 | `src/i18n.ts` |
| 全局布局 / 导航 | `src/layouts/BaseLayout.astro` |
| 主题样式 | `src/styles/aonote.css` |
| Markdown 管线 | `src/integrations/aonote-markdown.ts` |
| 订阅条目数量 | `src/utils/feed.ts` |
| `robots.txt` / Sitemap 地址 | `src/pages/robots.txt.ts`（读取 `site.config.ts`） |

## 目录结构

```text
src/
├── site.config.ts
├── content/
│   ├── posts/          # 文章
│   └── pages/          # about、404
├── layouts/
├── components/
├── pages/              # 路由
├── integrations/       # Markdown / Shiki
└── styles/aonote.css
```

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 → `dist/` |
| `npm run preview` | 预览构建结果 |
| `npm run check` | `astro check` |

## 参与贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

MIT — 见 [LICENSE](LICENSE)。原版 Aonote 设计与样式 © [runsli](https://github.com/runsli)。
