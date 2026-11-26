# 配置参考

主题配置写在 `astro.config.ts` 中，作为参数传给 `wisp()` 集成。它用 zod 校验并与默认值深度合并：

- 没有写的字段使用默认值。
- 对象逐字段合并，只覆盖你写的字段。
- 数组（`nav`、`social`、`customCss`）整体替换默认值，不会合并。
- 类型不符或超出范围时，启动和构建会报错，并指出字段路径，例如 `home.pageSize: ...`。

```ts
// astro.config.ts
import { defineConfig } from 'astro/config';
import wisp from 'astro-wisp';

export default defineConfig({
  site: 'https://blog.example.com', // 正式域名：Sitemap、RSS、canonical、图表“在线打开”链接都用它
  integrations: [
    wisp({
      site: { title: '我的博客', description: '记录学习笔记', author: '张三', lang: 'zh-CN' },
      nav: [
        { label: '归档', href: '/archive/' },
        { label: '关于', href: '/about/' },
      ],
      social: [
        { kind: 'github', href: 'https://github.com/example' },
        { kind: 'rss', href: '/rss.xml' },
      ],
      home: { featuredCount: 3, pageSize: 10 },
      features: { mermaid: true, diagramDownload: true },
      rss: { fullText: true },
    }),
  ],
});
```

配置较长时可以放到单独的文件里：`export default defineWispConfig({...})`（从 `astro-wisp` 导入，带类型提示和校验），再在 `astro.config.ts` 中 `wisp(config)`。

## site

| 字段                | 类型   | 默认值                   | 说明                                                         |
| ------------------- | ------ | ------------------------ | ------------------------------------------------------------ |
| `site.title`        | string | `Wisp`                   | 站点标题，用于页头和 RSS 频道名                              |
| `site.description`  | string | `专注长文阅读的技术博客` | 站点描述，用于首页和 RSS                                     |
| `site.author`       | string | `""`                     | 作者名                                                       |
| `site.authorGithub` | URL    | —                        | 配置后页脚作者名链接到 GitHub                                |
| `site.lang`         | string | `zh-CN`                  | 站点语言，默认写入 `<html lang>`；交互组件的界面语言也跟随它 |

正式域名不在这里配置，使用 Astro 自己的 [`site`](https://docs.astro.build/en/reference/configuration-reference/#site) 选项（见上例）。未设置时构建会给出警告，并暂用 `https://example.com`。

## nav

| 字段  | 类型                                | 默认值                                          | 说明               |
| ----- | ----------------------------------- | ----------------------------------------------- | ------------------ |
| `nav` | `{ label: string; href: string }[]` | 归档 `/archive/`、标签 `/tags/`、关于 `/about/` | 顶部导航。整体替换 |

## social

| 字段     | 类型                       | 默认值                                | 说明                                         |
| -------- | -------------------------- | ------------------------------------- | -------------------------------------------- |
| `social` | `{ kind, href, label? }[]` | `[{ kind: 'rss', href: '/rss.xml' }]` | 页脚的社交链接（为空数组时不显示）。整体替换 |

`kind` 只能是：`github`、`x`、`mastodon`、`bluesky`、`email`、`rss`、`link`。`label` 可选，用于无障碍名称。

## home

| 字段                 | 类型     | 默认值 | 说明                                                           |
| -------------------- | -------- | ------ | -------------------------------------------------------------- |
| `home.featuredCount` | 整数 ≥ 0 | `3`    | 首页精选区最多显示的文章数（`featured: true` 的文章）          |
| `home.pageSize`      | 整数 ≥ 1 | `10`   | 列表页每页文章数；首页分页（`/page/n/`）只在站点没有系列时存在 |

## features

| 字段                       | 类型    | 默认值  | 说明                                                                                           |
| -------------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------- |
| `features.codeCopy`        | boolean | `true`  | 代码块右上角显示复制按钮                                                                       |
| `features.lineNumbers`     | boolean | `true`  | 代码块显示行号                                                                                 |
| `features.codeWrap`        | boolean | `false` | 代码块默认自动换行；读者可用题注行的「自动换行」按钮切换（存在 localStorage `wisp-code-wrap`） |
| `features.math`            | boolean | `true`  | 启用 KaTeX 公式（`remark-math` 与 `rehype-katex`）                                             |
| `features.mermaid`         | boolean | `true`  | 构建期用 Pele 渲染 `mermaid` 代码块。关闭后它们作为普通代码块显示                              |
| `features.toc`             | boolean | `true`  | 文章页显示目录。文章 frontmatter 的 `toc: false` 可以单独关闭某篇                              |
| `features.diagramDownload` | boolean | `true`  | 图表显示源文件下载链接，并在构建时复制源文件到 `dist/diagrams/`                                |

## mermaid

| 字段             | 类型    | 默认值  | 说明                                                                    |
| ---------------- | ------- | ------- | ----------------------------------------------------------------------- |
| `mermaid.strict` | boolean | `false` | `false`：渲染失败时开发环境显示代码块并警告。`true`：渲染失败时构建失败 |

## rss

| 字段           | 类型    | 默认值 | 说明                                                                                                                       |
| -------------- | ------- | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| `rss.fullText` | boolean | `true` | `true` 时 `/rss.xml` 输出全文；`false` 时只输出摘要。含交互组件的文章无法在 RSS 中渲染，两种设置下都会降级为摘要加原文链接 |

## fonts

| 字段               | 类型                                 | 默认值   | 说明                                                                                                                   |
| ------------------ | ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `fonts.cjkDisplay` | `'swap' \| 'fallback' \| 'optional'` | `'swap'` | 控制思源黑体（Noto Sans SC）分片 CSS 的 `font-display` 策略；正文栈已通过 `Wisp CJK Fallback` 对齐行高，可抑制加载跳变 |

## taxonomy

| 字段               | 类型                     | 默认值 | 说明                                                           |
| ------------------ | ------------------------ | ------ | -------------------------------------------------------------- |
| `taxonomy.slugMap` | `Record<string, string>` | `{}`   | 把标签或分类名映射为指定的 URL 段，例如 `{ "机器学习": "ml" }` |

标签和分类的 URL 段默认由名字生成：小写，空格转 `-`，中文保留，浏览器会做 URL 编码。如果两个不同的名字生成了相同的 URL 段，构建会报错，此时请用 `slugMap` 区分它们。

## routes

| 字段                | 类型    | 默认值 | 说明                                       |
| ------------------- | ------- | ------ | ------------------------------------------ |
| `routes.home`       | boolean | `true` | `/` 与 `/page/[n]/`                        |
| `routes.posts`      | boolean | `true` | `/posts/[...id]/`                          |
| `routes.archive`    | boolean | `true` | `/archive/`                                |
| `routes.tags`       | boolean | `true` | `/tags/`、`/tags/[tag]/`                   |
| `routes.categories` | boolean | `true` | `/categories/`、`/categories/[cat]/`       |
| `routes.about`      | boolean | `true` | `/about/`（渲染 `pages` 集合中的 `about`） |
| `routes.rss`        | boolean | `true` | `/rss.xml`                                 |
| `routes.notFound`   | boolean | `true` | `/404`                                     |

主题通过 Astro 的 `injectRoute` 注入这些页面。Astro 不允许同一路径同时由站点和集成提供，想自己实现某个页面时，先把对应开关设为 `false`，再在 `src/pages/` 中编写，可以复用主题的布局和工具函数：

```astro
---
// src/pages/about.astro
import Page from 'astro-wisp/layouts/Page.astro';
import { getPosts } from 'astro-wisp/utils';
const posts = await getPosts();
---

<Page title="关于">
  <p>已经写了 {posts.length} 篇文章。</p>
</Page>
```

## components

| 字段         | 类型                   | 默认值 | 说明                                               |
| ------------ | ---------------------- | ------ | -------------------------------------------------- |
| `components` | `Record<组件名, 路径>` | `{}`   | 用站点自己的文件替换主题组件或布局。路径相对项目根 |

主题内部所有组件和布局都通过虚拟模块（`virtual:wisp/components/<名称>`）互相引用，所以覆盖一个组件后，主题中所有使用它的地方都会换成你的实现。可以覆盖的名称（与 `astro-wisp/components/`、`astro-wisp/layouts/` 下的文件名一致）：

- 组件：`BackToTop`、`CopyButton`、`Diagram`、`Figure`、`Footer`、`Header`、`Icon`、`Lightbox`、`Pagination`、`PostCard`、`PostMeta`、`PrevNext`、`ReadingProgress`、`SkipLink`、`TagList`、`ThemeToggle`、`Toc`
- 布局：`Base`、`Post`、`Page`

覆盖组件收到与默认组件相同的 props（0.4.0 起 `Base` 与 `Header` 多了可选的 `running` prop，用于页眉书眉，包装时请用 `{...props}` 透传），也可以导入默认实现再包装。样式覆盖前请先读主题的外观规范 `node_modules/astro-wisp/DESIGN.md`：

```astro
---
// src/components/PostCard.astro
import Default from 'astro-wisp/components/PostCard.astro';
const props = Astro.props;
---

<div class="rounded-lg border border-border p-4">
  <Default {...props} />
</div>
```

写了不存在的名称时，启动会报错并列出全部可选名称。

## customCss

| 字段        | 类型       | 默认值 | 说明                                                                                         |
| ----------- | ---------- | ------ | -------------------------------------------------------------------------------------------- |
| `customCss` | `string[]` | `[]`   | 追加的样式文件。以 `./` 开头的路径相对项目根，否则按包名解析（如 `@fontsource/lxgw-wenkai`） |

这些文件在主题样式之后加载，并且**不在 cascade layer 里**，所以总能覆盖主题，不需要提高选择器特异性。主题样式的分层：页面骨架与组件在 `@layer components`，正文内容样式（prose、代码块、图、公式、讲解组件）与 `@tailwindcss/typography` 同在 `@layer utilities`。站点页面里直接写的 Tailwind 工具类（如 `bg-surface`、`text-muted`、`mt-8`）能覆盖主题组件样式。

## palette

| 字段      | 类型       | 默认值 | 说明                                                                   |
| --------- | ---------- | ------ | ---------------------------------------------------------------------- |
| `palette` | 路径或对象 | —      | 覆盖调色板。与默认调色板深度合并，只写要改的键；数组（字体栈）整体替换 |

```ts
wisp({ palette: { color: { base: { accent: { light: '#0a5c36', dark: '#5ad19a' } } } } });
// 或指向一个 JSON 文件（结构同主题的 design/palette.json，可以只包含要改的部分）
wisp({ palette: './design/palette.json' });
```

集成在构建期生成令牌 CSS（写入 Astro 的 codegen 目录，不需要运行任何命令），并检查对比度：正文色、次要文字、强调色和 8 个 hue 与背景的对比度低于 4.5:1 时给出警告。页面、Mermaid、图表的 `--wd-*` 映射都随之改变；已生成的 `.wisp.svg` 不需要重新构建（它们在页面中引用令牌）。

## 内容集合

内容集合由站点在 `src/content.config.ts` 中声明（Astro 的规定），主题提供 loader 和 schema：

```ts
import { defineCollection } from 'astro:content';
import { pagesLoader, pagesSchema, postsLoader, postsSchema } from 'astro-wisp/content';

export const collections = {
  posts: defineCollection({
    loader: postsLoader(), // 默认 ./src/content/posts，可传 { base }
    schema: postsSchema(),
  }),
  pages: defineCollection({ loader: pagesLoader(), schema: pagesSchema() }),
};
```

`extend` 也可以是函数 `({ image }) => z.object({...})`，用于图片字段。

## 与 Astro 配置的关系

`wisp()` 会自动注册 `@astrojs/mdx`、`@astrojs/sitemap`（设置了 `site` 时）和 Tailwind 的 Vite 插件，并设置 `markdown.processor`（remark / rehype 插件）与 Shiki 配置。站点已经自己注册了 MDX 或 Sitemap 时不会重复添加。交互讲解组件需要的 `@astrojs/react` 由站点自行添加（`pnpm astro add react`）。Astro 自身的其他配置（如 `base`、`trailingSlash`）照常写在 `astro.config.ts` 中。
