# Wisp 架构

## 1. 技术栈（2026-11 锁定的大版本）

| 包                                                       | 版本                                        | 用途                                                                                                            |
| -------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| astro                                                    | ^7.4                                        | 框架（要求 Node ≥ 22.23.4）                                                                                     |
| @astrojs/mdx                                             | ^8                                          | MDX                                                                                                             |
| @astrojs/react, react, react-dom                         | ^7 / ^19                                    | 交互组件 island                                                                                                 |
| @astrojs/rss, @astrojs/sitemap                           | ^4 / ^3                                     | RSS、Sitemap                                                                                                    |
| tailwindcss, @tailwindcss/vite, @tailwindcss/typography  | ^4.3 / ^0.5                                 | 样式                                                                                                            |
| remark-math, rehype-katex, katex                         | ^6 / ^7 / ^0.19                             | 公式                                                                                                            |
| pele                                                     | ^1.13（锁定次版本，布局输出可能随版本变化） | Mermaid → SVG                                                                                                   |
| motion                                                   | ^14                                         | 交互组件动画                                                                                                    |
| @fontsource-variable/{inter,noto-sans-sc,jetbrains-mono} | ^5                                          | 字体文件来源：Inter / JetBrains Mono 经 Astro Fonts API（npm provider）注册，思源黑体直接引入 CSS（见 ADR D18） |
| 开发依赖：svgo、subset-font、playwright、vitest、tsx     |                                             | 图表流水线、测试                                                                                                |

> 实施者注意：Astro 7 的 API 以官方文档为准（content layer、`astro.config` 中的 markdown 配置、`render()`）。本文档中的代码是意图示例，不是可以直接复制的 API 契约；遇到不一致时按官方文档实现，并在 PR 说明中注明。

## 2. 目录结构

仓库是 pnpm 工作区：主题包、使用主题的演示站（根目录）、starter。

```
astro-wisp/
├─ packages/astro-wisp/              # 主题包（npm: astro-wisp），以 TS 源码发布
│  ├─ index.ts                       # 默认导出 wisp() 集成；导出 defineWispConfig、类型
│  ├─ virtual.d.ts                   # 虚拟模块类型（集成用 injectTypes 注入站点 .astro/）
│  ├─ design/palette.json            # 默认调色板（设计令牌唯一来源）
│  ├─ bin/wisp.mjs                   # wisp CLI：wisp diagram …、wisp skills
│  ├─ scripts/                       # 维护者脚本：gen-tokens、check-contrast；diagram CLI
│  ├─ skills/                        # wisp-diagram、wisp-writer（随包分发）
│  └─ src/
│     ├─ integration.ts              # 注入路由、虚拟模块、Markdown 管线、依赖的集成
│     ├─ config.ts                   # zod schema + defineWispConfig
│     ├─ fonts.ts                    # Astro Fonts API 字体族（Inter、JetBrains Mono、Excalifont）
│     ├─ content.ts                  # postsLoader/postsSchema、pagesLoader/pagesSchema（astro-wisp/content）
│     ├─ routes/                     # 注入的页面（index、page/[page]、posts/[...id]、tags、categories、archive、about、rss、404）
│     ├─ layouts/{Base,Post,Page}.astro        # 可覆盖；Base 与 Header 接收可选的 running prop（书眉）
│     ├─ components/*.astro          # 可覆盖
│     ├─ plugins/                    # remark-pele、remark-diagram、remark-reading-time、remark-has-math、rehype-a11y
│     ├─ lib/                        # render-diagram（图表渲染与 manifest 只读校验）、diagram-assets、icons
│     ├─ utils/                      # getPosts、taxonomy、date（astro-wisp/utils）
│     ├─ tokens/                     # palette 读取 / 合并、令牌生成、对比度检查
│     ├─ styles/                     # layers.css、global.css、prose/code/figure/…；tokens/pele/diagram.css 为生成文件
│     ├─ explainers/                 # 分步讲解积木（astro-wisp/explainers），见 explainers.md
│     └─ assets/fonts/excalifont/    # 手绘图字体（OFL）
├─ template/                         # starter：astro.config.ts、content.config.ts、示例内容；依赖 astro-wisp
├─ astro.config.ts                   # 演示站：wisp({...}) + react()
├─ src/content.config.ts             # 演示站内容集合
├─ src/content/posts/<slug>/         # 演示文章；diagrams/、images/、文章私有组件（如 MatMul.tsx）
├─ diagrams.manifest.json            # 演示站图表 manifest
├─ tests/e2e/                        # Playwright（以演示站为对象）
└─ docs/
```

站点项目（starter 或已有项目）只有 `astro.config.ts`、`src/content.config.ts`、`src/content/`，以及站点自己选择的覆盖组件、`customCss`、调色板文件和 `src/pages/` 中的自定义页面。

## 3. 内容模型

内容集合必须由站点声明，主题在 `astro-wisp/content` 中提供 loader 和 schema：

```ts
// 站点的 src/content.config.ts
import { postsLoader, postsSchema, pagesLoader, pagesSchema } from 'astro-wisp/content';
export const collections = {
  posts: defineCollection({ loader: postsLoader(), schema: postsSchema({ extend /* 可选 */ }) }),
  pages: defineCollection({ loader: pagesLoader(), schema: pagesSchema() }),
};

// postsLoader()：glob({ pattern: ['**/index.{md,mdx}', '*.{md,mdx}'], base: './src/content/posts' })
// postsSchema() 的字段：
const posts = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      description: z.string().max(200),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      category: z.string().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      cover: image().optional(),
      lang: z.string().optional(),
      toc: z.boolean().default(true),
      series: z.object({ id: z.string().min(1), order: z.number().int().min(1) }).optional(),
    }),
});
```

- **id / slug**：目录形式 `posts/attention/index.mdx` 的 id 为 `attention`。URL 为 `/posts/<id>/`。
- **`getPosts()`**（`astro-wisp/utils`）：唯一的取数入口。生产环境过滤 draft，按 pubDate 降序。所有页面都必须调用它，不能直接调用 `getCollection`。
- **标签和分类**：URL 段为 `slugify(name)`：小写，空格转 `-`，中文保留原样，由浏览器做 URL 编码。`wisp({ taxonomy: { slugMap } })` 可以覆盖。构建时如果检测到两个不同的名字产生同一个 slug，直接报错。

## 4. Markdown 管线

```
remark:  (管线指纹) → remark-cjk-friendly → remark-math → remark-pele → remark-diagram
         → remark-reading-time → remark-has-math → remark-heading-text
rehype:  (Shiki 内置高亮 + Wisp transformers) → rehype-katex → rehype-figure → rehype-a11y → rehype-citations
         → (Astro：图片、heading id)
```

- **Astro 7 默认的 Markdown 处理器是 Sätteri**，它不运行 remark/rehype 插件。Wisp 在 integration 中显式设置 `markdown.processor = unified({...})`（来自 `@astrojs/markdown-remark`）。插件只能通过这个处理器注册，不能写在旧的 `markdown.remarkPlugins` 里。
- `remark-pele` 必须在 Shiki 之前处理 `mermaid` 代码块。remark 阶段天然早于高亮，满足这一要求。
- 插件由集成（`packages/astro-wisp/src/integration.ts`）统一注册。MDX 继承同一套 markdown 配置。
- **remark-pele**：`render(code)` → `<figure class="wisp-figure wisp-pele" role="img" aria-label="…"><div class="pele">SVG</div></figure>`。出错时，dev 环境退化为代码块并打印警告；`mermaid.strict: true` 时构建失败。aria-label 依次取 `accTitle`、`accDescr`、图类型名。
- **remark-reading-time**：统计 CJK 字符数 ÷ 350 + 西文词数 ÷ 200，代码块按 0.3 的权重计入，向上取整，最少 1 分钟。结果写入 `remarkPluginFrontmatter.readingTime`。
- **remark-has-math**：检测到 math 节点时写入 `hasMath: true`，Post 布局据此按需引入 `katex.css`。
- **TOC**：使用 `render()` 返回的 headings，取 depth 2–3；标题锚点 id 由 Astro 的 Markdown 管线生成（内部使用 github-slugger），支持中文。含行内公式的标题例外：Astro 在 KaTeX 渲染之后取文字会得到乱码，`remark-heading-text` 改用源码生成 id（公式只留 ASCII 字母数字，如 `含公式 $H^{res}$ 的标题` → `含公式-hres-的标题`）；不含公式的标题 id 不变。
- **remark-cjk-friendly**：`**文字。**后文` 这类紧挨全角标点的强调也能闭合（CommonMark 的分界规则不认 CJK 标点）；`.md` 与 `.mdx` 都生效。
- **`.md` 与 `.mdx` 一致**：两者用同一个 processor 的插件。区别只在缓存：内容层把 `.md` 渲染好的 HTML 存在 `.astro/data-store.json`，只有文件内容或 astro 配置的 JSON 摘要变化时才重渲染，而插件是函数、进不了摘要。所以 remark 列表第一项是一个只带「管线指纹」选项的空插件（`pipelineDigest()`：主题插件 / Shiki transformer 源码、主题版本、pele / katex 等依赖版本的哈希）——升级主题后摘要变化，内容层整体失效。`integration.test.ts` 用同一段源码比较两条路径的产物。
- **横向溢出与键盘**：rehype-a11y（表格、公式）和 shiki.ts（代码块）写 `tabindex=0 data-wisp-tab`，这是无 JS 时的回落；Base 布局的脚本首帧接管，只给确实溢出的容器保留 tabindex 和「…，可横向滚动」的名称。

## 5. 路由

路由由集成通过 `injectRoute` 注入，入口文件在 `packages/astro-wisp/src/routes/`。每组路由都可以用 `routes.<键>: false` 关闭，站点再在 `src/pages/` 中自己实现（Astro 不允许同一路径重复定义）。

| 路由                                | 开关                       | 说明                                                                                                                               |
| ----------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                 | `home`                     | 精选（featured，最多 `home.featuredCount` 篇）+ 最新列表第 1 页                                                                    |
| `/page/[n]/`                        | `home`                     | 分页：Astro `paginate()`，每页 `home.pageSize` 篇，第 1 页即 `/`；**只在站点没有系列时生成**（有系列时首页是总目录，没有分页列表） |
| `/posts/[...id]/`                   | `posts`                    | 详情页：TOC、上一篇/下一篇、更新时间                                                                                               |
| `/archive/`                         | `archive`                  | 按年份分组                                                                                                                         |
| `/tags/` `/tags/[tag]/`             | `tags`                     | 标签列表（含文章数）、某标签下的文章                                                                                               |
| `/categories/` `/categories/[cat]/` | `categories`               | 同上                                                                                                                               |
| `/about/`                           | `about`                    | 渲染 `pages` 集合中的 `about`                                                                                                      |
| `/404`                              | `notFound`                 |                                                                                                                                    |
| `/rss.xml`                          | `rss`                      | 默认输出全文（container API + MDX 渲染器），`rss.fullText=false` 时只输出摘要                                                      |
| `/sitemap-index.xml`                | —                          | 集成自动注册 `@astrojs/sitemap`（需要 `site`）                                                                                     |
| `/diagrams/<post-id>/<file>`        | `features.diagramDownload` | 图表源文件下载，见 diagrams.md §5                                                                                                  |

## 6. 主题切换脚本

放在 `Base.astro` 的 `<head>` 中，`is:inline`，必须先于样式表执行：

```html
<script is:inline>
  (() => {
    const k = 'wisp-theme',
      s = localStorage.getItem(k) ?? 'system';
    const dark =
      s === 'dark' || (s === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.themePref = s;
  })();
</script>
```

ThemeToggle 组件负责切换三态、写入 localStorage，并在 `system` 模式下监听 `matchMedia` 的 change 事件。

## 7. 站点配置

```ts
// astro.config.ts
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    wisp({
      site: { title: 'Wisp', description: '…', author: '…', lang: 'zh-CN' },
      nav: [
        { label: '归档', href: '/archive/' },
        { label: '标签', href: '/tags/' },
        { label: '关于', href: '/about/' },
      ],
      social: [
        { kind: 'github', href: '…' },
        { kind: 'rss', href: '/rss.xml' },
      ],
      home: { featuredCount: 3, pageSize: 10 },
      features: {
        codeCopy: true,
        lineNumbers: true,
        math: true,
        mermaid: true,
        toc: true,
        diagramDownload: true,
      },
      mermaid: { strict: false },
      rss: { fullText: true },
      taxonomy: { slugMap: {} },
      // 扩展点（§8）
      components: {},
      customCss: [],
      palette: undefined,
      routes: {},
    }),
  ],
});
```

`defineWispConfig` 用 zod 校验配置并深度合并默认值。正式域名用 Astro 的 `site`，主题不再单独配置。

## 8. 扩展点与实现

参照 Starlight 的做法，全部基于 Astro / Vite 提供的能力：

| 能力            | 实现                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 页面            | `injectRoute`；`routes` 开关                                                                                                                                                                                                                                                                                                                                                                                                |
| 运行时配置      | Vite 虚拟模块 `virtual:wisp/config`（服务端）；`virtual:wisp/locale`（只有语言，供客户端 island 使用，避免把配置和项目路径打进浏览器 bundle）                                                                                                                                                                                                                                                                               |
| 组件 / 布局覆盖 | 每个可覆盖项对应虚拟模块 `virtual:wisp/components/<Name>`，默认 re-export 主题文件，`components` 中配置后改为站点文件。主题内部互相引用一律经过虚拟模块                                                                                                                                                                                                                                                                     |
| 类型            | `astro:config:done` 中 `injectTypes` 注入 `virtual.d.ts`                                                                                                                                                                                                                                                                                                                                                                    |
| 调色板覆盖      | `astro:config:setup` 中合并调色板、检查对比度，生成 CSS 写入 `createCodegenDir()`；`virtual:wisp/theme-css` 指向生成文件或包内默认文件                                                                                                                                                                                                                                                                                      |
| 站点样式        | `virtual:wisp/user-css` 依次 import `customCss`，在 Base 布局最后引入                                                                                                                                                                                                                                                                                                                                                       |
| 依赖的集成      | `updateConfig({ integrations })` 补齐 MDX、Sitemap；Tailwind 以 Vite 插件注册                                                                                                                                                                                                                                                                                                                                               |
| 字体            | `updateConfig({ fonts })` 注册 Fonts API 字体族（与站点的 fonts 拼接）；Base 布局 `<Font>` 输出 Inter / JetBrains Mono 并预加载 Inter latin，Post 布局在有手绘图时输出 Excalifont。Fonts API 的族名带哈希，令牌用 `var(--font-wisp-*, 原族名)` 引用。npm provider 的薄包装（`src/fonts.ts`）：从主题依赖解析包、多入口合并（Inter 正体 + 斜体）、`file://` → 路径（适配 Astro 7.4 的抓取器）、按文件名补子集供 preload 过滤 |
| SSR 打包        | `vite.ssr.noExternal`：`@astrojs/mdx`（RSS 静态导入其服务端渲染器）、`@fontsource-variable/*`（布局在服务端 import 思源黑体的 CSS）                                                                                                                                                                                                                                                                                         |

### 样式分层

```
@layer theme, base, components, utilities;   ← layers.css，Base 布局最先引入
```

| 层           | 内容                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| （不分层）   | 令牌（`--wisp-*`、`--pele-*`、`--wd-*` 自定义属性）、`@font-face`、站点 `customCss`                                                     |
| `utilities`  | Tailwind 工具类；`@tailwindcss/typography` 的 `.prose`；主题的正文内容样式：prose 覆盖、代码块、figure、Lightbox、KaTeX、图表、讲解组件 |
| `components` | 主题的页面骨架与组件样式（含所有 `.astro` 中的 `<style>`）                                                                              |
| `base`       | Tailwind preflight 与主题的元素级基础样式                                                                                               |

正文内容样式必须与 typography 插件同层，才能按特异性 / 顺序覆盖插件默认值（重构前它们不分层，效果相同；已用全页截图逐像素对比确认）。组件样式在 `components`，所以站点页面里的 Tailwind 工具类能覆盖主题组件；`customCss` 不分层，总能覆盖一切。

### 主题以源码发布

包的 `exports` 直接指向 `.ts` / `.astro` 源文件（与 Starlight 相同），由站点的 Vite 编译；`bin/wisp.mjs` 用 tsx 的 ESM 钩子加载 TS。发布前用 `pnpm pack` 安装到工作区外的临时站点验证 build / dev / astro check。

## 9. JS 预算

| 脚本               | 加载页面                                 | 大小       |
| ------------------ | ---------------------------------------- | ---------- |
| 主题初始化（内联） | 全部                                     | < 0.5KB    |
| ThemeToggle        | 全部                                     | < 1KB      |
| 代码复制           | 含代码块的文章                           | < 1KB      |
| TOC 当前章节高亮   | 文章页                                   | < 1KB      |
| React + 讲解组件   | 只有用到交互组件的文章，`client:visible` | 约 60KB 起 |

## 10. 质量门禁

`pnpm check`：`astro check` + `tsc` + vitest + 对比度检查 + `wisp diagram check`；CI 另外构建 starter（`pnpm build:template`）。
`pnpm build` 必须零警告通过；Lighthouse 中 a11y ≥ 95、performance ≥ 95（使用示例文章测试）。
