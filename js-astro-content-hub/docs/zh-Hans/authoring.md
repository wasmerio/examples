---
title: "编写内容"
description: "在中心仓库内直接撰写博客文章与文档:i18n 模型、slug 约定、回退机制,以及添加产品或语言。"
order: 2
---

本指南介绍如何在**中心仓库内**(位于 `src/content/` 之下)直接撰写博客文章与
文档。若要从*独立*仓库贡献内容,请参阅[内容同步](./content-sync.md)。

中心是一个 Astro 7 静态站点。内容以 Markdown 形式存放在 `src/content/` 中,
采用 locale 前缀的本地化方案:默认语言 `en` 没有 URL 前缀;其他语言位于
`/<locale>/...` 之下(当前为 `zh-Hans`)。

## i18n 模型

`src/lib/i18n.ts` 是 locale、UI 字符串(`t`)、落地页文案(`home`)及产品页文案
(`productCopy`)的唯一事实来源。`products` 数组位于仓库根目录的 `site.config.ts`。
`src/content.config.ts` 通过遍历 `products × locales`(文档)和 `locales`(文章)
自动生成集合。集合名通过 `collectionSuffix()` 使用 PascalCase 语言后缀
(例如 `zh-Hans` -> `postsZhHans`、`viteDocsZhHans`)。添加产品或语言只需改动一行。

### Slug 约定(关键)

一个文件的 **slug** 是其相对于 locale 目录、去掉 `.md` 后的路径。中心的回退
机制按 slug 匹配同一页面的 `en` 与 `zh-Hans` 版本,因此**各语言之间的文件名必须
逐字节一致。**

| 文件 | Slug |
|------|------|
| `posts/en/hello-world.md` | `hello-world` |
| `posts/zh-Hans/hello-world.md` | `hello-world` |
| `posts/en/mytool/foo.md` | `mytool/foo` |
| `docs/en/getting-started.md` | `getting-started` |

`en/getting-started.md` 与 `zh-Hans/Getting-Started.md` 会产生不同的 slug,从而破坏
回退。务必先写 `en` 版本。

### 回退

回退是逐页、内容级别的 —— 绝不是重定向。缺失的 `zh-Hans` 页面依然在 `/zh-Hans/.../` 解析,
并在 `zh-Hans` 外壳中渲染 `en` 正文,同时显示一条可见提示。URL 始终为 `/zh-Hans/...`。

## 博客文章

文章位于 `src/content/posts/<locale>/`。嵌套目录会成为路径片段
(`posts/en/mytool/foo.md` → `/posts/mytool/foo/`)。

**Frontmatter**(`postSchema`):

```yaml
---
title: "Post Title"                          # 必填
date: 2025-07-21                             # 必填,YYYY-MM-DD
description: "One-line summary."             # 必填
tags: ["announcement"]                       # 可选,默认为 []
author: "Your Name"                          # 可选
source: "https://github.com/owner/repo"      # 可选
draft: false                                 # 可选;草稿会被排除
---
```

步骤:

1. 创建 `src/content/posts/en/<slug>.md`。
2. 可选:以相同 slug 添加 `src/content/posts/zh-Hans/<slug>.md`。若省略,该 `en` 文章
   仍会出现在 `/zh-Hans/posts/`(带 `EN` 徽章),并在 `/zh-Hans/posts/<slug>/` 渲染英文正文。
3. `zh-Hans` 文章中的内部链接应指向 `/zh-Hans/...` 路径。
4. 运行 `npm run build`。无需改动路由 —— 默认路由(`src/pages/posts/...`)
   与通用非默认路由(`src/pages/[locale]/posts/...`)已服务所有语言。

## Markdown 中的交互

普通 `.md` 文件就能承载真正的交互:直接写在 Markdown 里的 `<script>` 标签会
原样输出并在浏览器中执行。这是给 docs 与 posts 添加交互的**推荐**方式 ——
包括从外部仓库同步的内容,因为交互就住在内容文件本身(自包含,无需 hub
侧代码、无需框架)。

### 你能做什么

参考页 [`docs/en/interactive-md.md`](./interactive-md.md)(渲染于
`/astro-content-hub/docs/interactive-md/`)演示了这些模式,全部带可复制的
源码:

| 能力 | 模式 | 参考 |
|-----------|---------|-----------|
| **按钮** | `onclick` 处理器修改 `<span>` | 计数器(增 / 减 / 加倍 / 重置) |
| **标签页** | 标签栏 + 面板,用 class 切换 | npm / pnpm / yarn 面板 |
| **图标** | 内联 SVG,静态或点击切换 | 太阳 ↔ 月亮切换 |
| **图表** | JS 函数生成数据,画成 SVG | 随机游走折线/柱状图,可重新生成 |

任何能表达为 DOM 读写 + 数学的事情都可以做:表单校验、计算器、带排序的
数据表、简单的可视化。脚本是纯 JS —— 无模块、无框架、无构建步骤。

### 模式

一个带 `onclick` 的按钮,加一小段修改页面的脚本:

```html
<button class="btn btn-secondary" onclick="myCounter('plus')">+</button>
<span id="my-counter">0</span>

<script>
  var n = 0;
  function myCounter(action) {
    if (action === 'plus') n++;
    document.getElementById('my-counter').textContent = String(n);
  }
</script>
```

### 最佳实践(由中心的内容校验强制)

- **自包含**:样式与脚本都在 `.md` 文件里;给 class/id 加前缀(如 `demo-`
  或你的产品 slug)避免冲突。
- **无外部请求**:避免 `fetch`/`XMLHttpRequest`、`eval` 与 cookie 访问 ——
  中心的 review 与校验会把关。
- **末尾放一个 `<script>`** 定义所有函数,而非散落的内联处理器。
- **复用中心的 CSS 类**(`btn`、`btn-primary`、`btn-secondary`),让控件
  与站点一致;只为自定义部分加一个小 `<style>` 块。

## Markdown 与 MDX(最小支持)

模板在 docs 与 posts 中也接受 **`.mdx`** —— 可导入组件的 Markdown。模板
**不内置组件库**;支持 `.mdx` 是为了让你可以:

- 在 `.mdx` 文件里写纯 Markdown 内容(与 `.md` 完全一样);
- 为更丰富的交互导入**你自己的** `.astro` 组件(MDX 集成注册了 `.mdx`
  内容类型;import 相对于文件解析)。

交互式文档请优先使用带内联 `<script>` 的纯 `.md`(更简单、无需 import、
处处可用)。只有当你确实需要在内容页中嵌入组件时,才用 `.mdx`。

## 为已有产品编写文档

文档位于 `src/content/docs/<product>/<locale>/`。产品来自 `products` 数组
(`site.config.ts`;示例:vite、astro、json-server)。

**Frontmatter**(`docSchema`):

```yaml
---
title: "Page Title"          # 必填
description: "Short summary" # 可选
order: 2                     # 可选,控制侧边栏排序(默认 0)
---
```

- `index.md` 是文档落地页(服务于 `/<product>/docs/`,而不是
  `/<product>/docs/index/`)。无论 `order` 为何,它始终排在最前;其余页面按
  `order` 排序,再按标题排序。
- 中文版:以相同 slug 添加 `src/content/docs/<product>/zh-Hans/<slug>.md`。缺失的
  `zh-Hans` 页面会回退到 `en` 正文并显示提示。
- `zh-Hans` 文档中的内部链接应指向 `/zh-Hans/<product>/docs/...`。

## 添加一个新产品

唯一会触及配置的编写任务:

1. 在仓库根目录的 `site.config.ts` 中注册产品:

   ```ts
   export const products: Product[] = [
     // ...已有...
     { slug: 'mytool', name: 'MyTool', github: 'https://github.com/owner/mytool', badges: ['Tool'], featured: true, description: { en: 'A short one-liner.', 'zh-Hans': '一句话简介。' } },
   ];
   ```

   这会自动生成 `mytoolDocsEn` / `mytoolDocsZhHans` 集合,以及落地页卡片
   (`featured: true` 时含导航下拉项)。

2. 添加内容:

   ```
   src/content/docs/mytool/en/index.md
   src/content/docs/mytool/en/getting-started.md
   src/content/docs/mytool/zh-Hans/index.md   # 可选;回退到 en
   ```

3. 路由是自动生成的(产品页面是动态的)。运行 `npm run build` 并验证
   `/mytool/docs/` 与 `/zh-Hans/mytool/docs/` 能正常渲染。

### product-info 文件

注册的产品在提供每语言的结构化 `product-info` 文件后,会自动渲染**丰富落地页**:

```
src/content/product-info/<locale>/<slug>.md
```

其 frontmatter(`tagline`、`description`、`highlights`、`features`、`install`、
`links`,以及可选的 `sections` 列表)通过 `src/lib/landing-sections.ts` 中的
注册表驱动落地页的各区块。没有 `product-info` 文件时,产品仍会从注册表条目
获得通用回退落地页(hero + 徽章 + 关于 + CTA) —— 因此裸产品也像样,而有
`product-info` 文件则让它*更丰富*。完整结构参见 `src/content/product-info/`
下的示例文件(如 `en/astro.md`)。

## 配置导航与页脚

顶部导航与页脚由 `site.config.ts`(仓库根目录)中的 `site` 段数据驱动。内置骨架
(logo、Posts、Products 下拉、locale/theme)始终渲染;你通过配置追加条目:

- **`site.orgUrl`** —— 导航 CTA 与页脚链接使用的 git 托管地址。改为你的组织/仓库即可。
- **`site.nav.links`** —— 追加在 Posts/Products 之后的自定义条目。普通条目是
  `{ label, href, external?, activePrefix? }`;下拉是 `{ label, children: [...] }`
  (children 为普通链接)。`activePrefix` 是路径段列表——当前路径包含其中任意一段即高亮;
  下拉在任一 child 命中时点亮。标签按 locale:`{ en: '...', 'zh-Hans': '...' }`。
- **`site.footer.links`** —— 页脚列,按数组顺序渲染在品牌块之后。自定义列是
  `{ title, items: [...] }`;自动生成的 Products 列是 `{ type: 'products', all?, limit? }`
  —— 默认列出 featured 产品(`all: true` 列出所有),设 `limit` 截断列表并在超出时显示
  指向 `/products` 的 "All products" 链接。

内部 href 会自动加 locale/base 前缀;外部链接使用绝对 `https://...`(并设
`external: true` 以新标签打开)。

## 自定义产品落地页

每个产品落地页(`/<product>/`)按以下顺序解析:

1. **自定义覆盖** —— `src/components/product-landing/<slug>.astro` 处的组件
   优先胜出。
2. **结构化落地页** —— `src/content/product-info/<locale>/<slug>.md` 处的
   `product-info` Markdown 文件通过区块注册表渲染丰富、数据驱动的落地页
   (tagline、highlights、features、install 等)。参见下方
   [product-info 文件](#product-info-文件)。
3. **回退** —— 无覆盖且无 `product-info`:`ProductLandingDefault.astro`
   直接从 `Product` 注册表条目(name、description、badges、github、文档链接)
   渲染像样的页面 —— hero + 徽章 + 关于 + CTA。因此**只注册(且可选地提供
   文档)的产品,零额外内容也能得到体面的公开页面**。

要为某个产品提供自定义落地页,只需添加一个以产品 **slug** 命名的组件:

```
src/components/product-landing/<slug>.astro     # 例如 src/components/product-landing/vite.astro
```

`src/lib/product-landing.ts` 在构建时预先 glob 该目录,因此该文件会被自动发现 -- 无需配置,无需改动路由。两个落地路由(默认 `/<product>/` 路由及其 `/<locale>/<product>/` 双生路由)都会自动采用该覆盖;没有匹配文件的产品则继续使用通用落地页。文档子路由(`/<product>/docs...`)不受影响,仍为数据驱动。

覆盖只渲染 **`<main>` 区块**(hero、自定义区块、CTA)。路由仍负责 `Layout` + `Nav` + `Footer` 与 `<head>`,因此不存在第二份文档外壳。它接收与回退相同的 props:

| Prop | 含义 |
|------|------|
| `product` | 来自仓库根目录 `site.config.ts` 的完整 `Product` 条目。 |
| `locale` | 当前 locale(默认路由传入 `'en'`,双生路由传入循环变量)。 |
| `c` | 已按 locale 解析的 UI 字符串(`ProductCopy`)-- 复用 `c.viewSource`、`c.documentation`、`c.ctaTitle` 等。 |
| `docsHref` | 已感知 base、带 locale 前缀的文档链接,由路由预先计算。 |

要本地化覆盖专属文案,可在组件内部按 `locale` 分支;v1 为每个产品提供一份覆盖,跨所有 locale 使用(按语言拆分的覆盖文件如 `vite.zh-Hans.astro` 是未来的扩展)。示例 `src/components/product-landing/vite.astro` 展示了这一约定 -- 复用共享 CSS 类(`.product-hero`、`.section`、`.btn`、`.feature-grid` 等),仅当全局类不适用时才添加 scoped `<style>`。

## 添加一门新语言

添加语言是**纯数据变更** —— 无需创建或镜像路由文件,因为非默认路由是通用的
(`src/pages/[locale]/...` 遍历 `locales`)。以添加 `ja` 为例:

1. 在 `src/lib/i18n.ts` 的 `locales` 中追加 `'ja'`;为每个 `Record<Locale, …>`
   表添加 `ja` 块:`localeLabel`、`localeCode`、`t`、`home` 与 `productCopy`。
   由于每个表都类型化为 `Record<Locale, …>`,遗漏任一(或其键偏离 `en` 种子)
   都是编译错误 —— 在 `ja` 补全前 `astro check` 不会通过。
2. 创建 `src/content/posts/ja/` 与 `src/content/docs/<product>/ja/`
   (集合从 `locales` 自动生成)。
3. **无需改动路由。** `src/pages/[locale]/...` 已遍历 `locales`,因此 `ja`
   页面自动服务于 `/ja/...`。`Layout`/`Nav`/`Footer`/`LocaleSwitcher`
   通过 `localeFromPath` 从 URL 推断 locale 并查找 `t[locale]`;`localeFromPath`
   的正则同时匹配双字母前缀(`/ja/...`)与带子标签的前缀(`/zh-Hans/...`)。

运行 `npm run build` 并验证 `/ja/...` 页面能渲染,且切换器提供了新语言。
(在没有 `ja` 内容时,每个 `/ja/...` 页面都会在 `ja` 外壳中回退到 `en` ——
这是在翻译前确认路由可用的有效方式。)

## 常见陷阱

- **各语言 slug 不一致** —— 保持文件名逐字节一致。
- **从 `zh-Hans` 页面链接到 `/<product>/docs/...`** —— 应使用
  `/zh-Hans/<product>/docs/...`,让读者留在本地化外壳中。
- **忘记 `order`** —— 默认 `order: 0` 的新文档会聚集在一起;为稳定排序请设置
  明确的值。
- **`index` slug 是特殊的** —— 切勿链接到 `/<product>/docs/index/`;它不存在。
  `buildNav` 会将 index 文档映射到基础路径。

## 验证

```bash
npm run build   # 必须 0 错误/0 警告/0 提示(运行 astro check)
```

然后在 `dist/` 中抽查:

```bash
grep -o '<html lang="[^"]*"' dist/zh-Hans/vite/docs/getting-started/index.html
grep -c 'rel="alternate"' dist/zh-Hans/vite/docs/getting-started/index.html   # 期望 = 语言数
grep -c '此页暂无中文翻译' dist/zh-Hans/posts/localized-sample/index.html       # 回退提示
```
