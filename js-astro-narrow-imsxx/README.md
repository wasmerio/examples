<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Narrow Imsxx](https://github.com/imsxx/astro-narrow) Astro theme by imsxx, copied from commit `215d926cc22573d5af7422bd12cfd48e00eff589` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-narrow-imsxx.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
- **Environment variables:** None.
- **Credit:** theme by [imsxx](https://github.com/imsxx), AGPL-3.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro-narrow

[English](./README.en.md) · **简体中文**

[hugo-narrow](https://github.com/tom2almighty/hugo-narrow) 的 Astro 移植版。

这不是逐行翻译模板，而是按 Astro 的方式重写了一遍：功能与视觉对齐上游，实现上凡是能换成 Astro 原生能力的地方都换掉了（图片管线、代码高亮、目录、配置校验）。

- 上游版本：`hugo-narrow v2.1.4`（上游 v2 线已停止维护，不再跟踪新特性）
- 技术栈：Astro 7 + Tailwind CSS 4
- 在线示例：[imsxx.com](https://imsxx.com)——作者的博客，跑的就是这个主题，没有二次定制

## 已实现

- 布局骨架：单栏正文、浮动 dock、面包屑上下文栏、页脚
- 外观面板：12 套配色、明暗/跟随系统、宽度 / 模糊 / 噪点滑杆
- 文章页：元信息、正文排版、可固定目录面板、阅读进度、上下篇、相关文章、系列进度条与浮层
  上下文栏会随滚动收起成标题胶囊，点一下展开回面包屑
- 列表页：分页文章列表、按年月归档、标签、分类、系列
- 搜索：MiniSearch 索引（中日韩按词切分）+ `Ctrl+K` 弹窗，关掉搜索则按钮、弹窗、脚本一并消失
- 代码块：Shiki 双主题、语言标签、复制、折叠
- 数学公式：KaTeX 构建时渲染
- 图表：Mermaid 按需加载，切换主题时重绘
- 图片：相邻图片自动成组，单按钮在 justified / masonry / grid 之间循环切换，间距、列数等可配置
- 嵌入组件：按钮、链接卡、标签页（禁用 JS 时也能看到首个面板）、Bilibili、腾讯视频（MDX 组件）
- 独立页：关于、简历、时间线、项目
- 评论：giscus、disqus、utterances、waline、artalk、twikoo、comentario，主题切换自动同步
- 统计：Google、百度、Clarity、Umami
- 界面语言：由上游 i18n 文件生成的 14 种语言
- 订阅与元数据：RSS、sitemap、SVG 图标 sprite、web manifest

## 功能开关

开关关掉就是彻底关掉——没有残留标记、不加载脚本、不发请求。全部集中在 `src/config/site.ts`，由 Zod 校验。

| 开关 | 默认 | 关闭后的效果 |
| --- | --- | --- |
| `announcement.enabled` | `false` | 不显示公告条 |
| `toc.enabled` | `true` | 无目录面板，dock 上的目录按钮一并隐藏 |
| `readingProgress.enabled` | `true` | 无阅读进度条 |
| `search.enabled` | `true` | dock 上的搜索按钮、弹窗、搜索脚本全部不加载，索引端点返回 `[]` |
| `comments.enabled` + `provider` | `false` | 无评论结构；需填对应服务商配置 |
| `analytics.provider` | `""` | 不加载统计脚本 |
| `katex.enabled` | `true` | 公式保持原文，KaTeX 插件不注册 |
| `mermaid.enabled` | `true` | 图表按代码块显示，运行时不加载 |
| `gallery.enabled` | `true` | 图片退回普通 `<img>` |
| `lightbox.enabled` | `true` | 画廊没有灯箱 |
| `codeblock.collapse.enabled` | `true` | 无折叠按钮 |
| `post.showRelated` | `true` | 无相关文章区块 |

> 从 1.x 升级：`comments.system` 已更名为 `comments.provider`（站点配置与文章 front matter 都是），
> 沿用旧键名会显示「未配置」提示。搜索新增 `search.enabled`，默认开启，行为与之前一致。

### 页面级覆盖

单篇文章可以在 front matter 里覆盖站点默认值：

```yaml
toc: false
comments: false # 或 { enabled: true, provider: "giscus" }
gallery:
  defaultLayout: masonry # 覆盖站点默认，还可写 gap / columns / targetRowHeight / columnWidth
katex: false
mermaid: false
lightbox: false
license: "CC BY-ND 4.0" # 或 false 隐藏
```

`key: false` 和 `key: { enabled: false }` 两种写法都支持，与上游一致。`katex` 和 `mermaid` 在 Markdown 渲染前就已判定，关闭后整块保持原样，不会出现「渲染了一半」。

## 尚未移植

- 内容级多语言路由（界面文案可切换，文章保持单语言）
- 上游脚本自带的三种画廊布局之外的扩展
- 本地图片的响应式宽度阶梯与 WebP 变体。上游只对 Hugo 的 page bundle / `assets` 资源做处理，
  Markdown 里的普通路径与静态目录图片同样保持原样；Astro 侧需要响应式图片时用 MDX 里的
  `<Image>` / `<Picture>`，由 `astro:assets` 在构建期生成。

## 环境要求

- Node.js 22.23.4+（Astro 7）
- pnpm 10

## 开发

```bash
pnpm install
pnpm dev
```

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 本地开发服务器 |
| `pnpm build` | 构建静态站点到 `dist/` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm check` | 检查 `.astro` 与 `.ts` 类型 |
| `pnpm format` | 用 Biome 格式化 |
| `pnpm i18n` | 从上游快照重新生成语言字典 |
| `pnpm upstream:pull <tag>` | 把 `upstream/hugo-narrow` 更新到指定标签 |

Biome 负责脚本、配置和数据文件。`.astro` 不在格式化范围内——它的实验性 HTML 解析器读不了 Astro 的 `define:vars`。模板的类型安全由 `pnpm check` 保证。

## 部署

产物是全静态的，`pnpm build` 之后发布 `dist/` 即可。下面三种方式，按省心程度排。

### 一、交给 AI agent

如果手边有能读写 GitHub 仓库的 agent（Claude Code、Codex、WorkBuddy 都行），把这句话发给它：

> 帮我部署 <https://github.com/imsxx/astro-narrow>，域名用 blog.example.com

agent 需要走完四步：

1. clone 仓库，`corepack pnpm install`
2. 把 `astro.config.ts` 里的 `site` 改成目标域名
3. `corepack pnpm build`
4. 把 `dist/` 发布到任意静态托管，绑定域名

Node 用 `.node-version` 里的 24。如果站点部署在子路径（`example.com/blog`），还要把 `base` 设成 `"/blog"`——这一步容易漏，漏了所有站内链接都会指向根目录。

### 二、一键部署按钮

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/imsxx/astro-narrow)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/imsxx/astro-narrow)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/imsxx/astro-narrow)

三点说明：

- **Cloudflare 按钮部署的是 Workers，不是 Pages。** Cloudflare 的一键按钮目前只支持 Workers 应用，仓库里的 `wrangler.jsonc` 已经把 `dist/` 配成静态资源目录，`not_found_handling` 指向 404 页面。
- **Vercel 和 Netlify 会自动识别 Astro**，不需要额外配置。
- 按钮会把仓库复制一份到你的账号，之后改的是你自己那份，不会影响上游。

### 三、手动构建

```bash
corepack pnpm install
corepack pnpm build
# 把 dist/ 上传到服务器，或交给 CI 发布
```

`site` 和 `base` 会贯穿到站内链接、封面图、图标 sprite、搜索索引、manifest 与 RSS：

```ts
// astro.config.ts
export default defineConfig({
  site: "https://example.com", // 你的域名，决定 canonical、sitemap 和 robots.txt
  base: "/", // 子路径部署改成 "/repo"
  // ...
})
```

Node 版本由 CI 读取 `.node-version`，请保持在 24；Node 25 目前在 Windows 上构建会崩。

## 示例内容

`src/content/posts` 里有四篇示例文章。其中三篇组成「主题使用指南」系列，分别讲 Markdown 排版、MDX 嵌入组件和页面级开关；第四篇是同样内容的英文版。换成自己的文章后可以删掉——它们的 front matter 本身就是一份字段参考。

`src/content/pages` 放关于 / 简历 / 时间线，`src/content/projects` 放项目列表。

## 目录结构

```
src/
├── config/       # 站点配置，Zod 校验
├── content/      # 文章（.md / .mdx）与独立页
├── components/
│   ├── ui/       # dock、上下文栏、目录、搜索、外观、菜单
│   ├── content/  # 卡片、栅格、列表、分页、相关文章
│   ├── embeds/   # 替代 Hugo shortcode 的 MDX 组件
│   └── features/ # 评论
├── layouts/      # 基础布局
├── pages/        # 路由、订阅、搜索索引、sprite 端点
├── lib/          # 数据聚合、日期、分页、rehype 插件
├── i18n/         # 类型化字典
├── styles/       # Tailwind 入口 + 上游样式
├── icons/        # 上游 SVG 图标
└── scripts/      # 上游交互脚本
upstream/         # 上游只读快照，用于 diff
```

## 移植策略

`src/styles`、`src/icons`、`src/scripts` 从上游原样复制——`main.css` 只多了一行 Shiki 的 `@import`。其余部分都是 Astro 组件。逐文件的对应关系见 [PORTING.md](./PORTING.md)。

## 许可证

AGPL-3.0-only。原主题版权归其作者所有，详见 [LICENSE](./LICENSE)。
