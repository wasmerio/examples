---
title: "05-内容与Markdown"
slug: 05-nei-rong-yu-markdown
index: 0
description: "Markdown 渲染说明。"
category: "二次开发"
tags: ["二次开发"]
series: "二次开发文档"
series_order: 6
published: 2026-09-16 19:08:29
---

## 1. 文章目录与文件约定

| 项 | 约定 |
| --- | --- |
| 存放位置 | `src/content/posts/**/*.{md,mdx}`（支持子目录，loader 的 `pattern: '**/*.{md,mdx}'`） |
| 文件格式 | `.md` 与 `.mdx`（MDX 额外支持表达式、JSX 与组件导入，见 4.1） |
| URL 来源 | frontmatter 的 `slug`（最终成为 `post.id`），与文件名无关 |
| 图片位置 | 任意位置，只要在 `src/content/` 下即可（通过 `/content-images/{hash}.ext` 路由访问） |
| 派生数据 | `.generated/post-index.json`（由构建脚本生成，不要手改） |

> 文件名不是 URL：
>
> `src/content/posts/我的第一篇文章.md` 的 URL 由 frontmatter 里的 `slug` 决定。若 slug 是 `my-first-post`，URL 就是 `/posts/my-first-post/`。
>
> 但文件名影响两件事：
>
> 1. `scripts/ensure-post-slugs.js` 在 slug 缺失时，用 `title`（不是文件名）生成拼音 slug；
> 2. `scripts/format-post-meta.js` 与 `update-post-updated.js` 会用文件路径做状态键。

## 2. Frontmatter 字段完整参数表

```markdown
---
title: "示例文章"
slug: shi-li-wen-zhang
index: 0
description: "一句话摘要，会用于 SEO 与列表摘要"
category: "示例"
tags: [Markdown, 教程]
# 连载（同一主题 3 篇以上、需按顺序阅读）才填写，零散文章留空：
# series: "系列名"
# series_order: 1
published: 2026-01-01 00:01:02
updated: 2026-01-01 00:01:03
draft: false
---
```

| 字段 | 类型 | 必填 | 默认值 | 说明 | 校验规则（`src/content.config.ts`） |
| --- | --- | --- | --- | --- | --- |
| `title` | `string` | 是 | — | 文章标题 | `min(1)`，空字符串会构建失败 |
| `slug` | `string` | 否 | 自动生成 | URL 标识，最终即 `post.id` | 正则 `^[a-z0-9]+(?:-[a-z0-9]+)*$`，只允许小写字母/数字/单连字符；`.nullish()` 可省略或留空 |
| `index` | `number` | 否 | `0` | 置顶权重。`0` = 不置顶；`>0` = 置顶，数值越大越靠前 | `int().min(0)`，负数会构建失败 |
| `description` | `string` | 是 | — | 文章描述。用于 SEO、OG、列表摘要、文章页副标题 | `min(1)` |
| `category` | `string \| string[]` | 否 | `'未分类'` | 分类。传数组时只取归一化后的第 1 项 | `normalizeList()` 后取首项 |
| `tags` | `string \| string[]` | 否 | `''` | 标签。字符串按逗号拆分 | `normalizeList()`：trim → 去空 → 按 `toLowerCase()` 去重 |
| `published` | `Date` | 是 | — | 发布时间，建议格式 `YYYY-MM-DD HH:mm:ss`（无时区字符串按 UTC 解析） | `z.preprocess(parseDateAsUtc, z.date())`，非法日期报错 |
| `updated` | `Date` | 否 | — | 更新时间。开启 `autoUpdatePostUpdated` 时由脚本按 mtime 写入 | `z.preprocess(parseDateAsUtc, z.date()).optional()` |
| `draft` | `boolean` | 否 | `false` | 草稿。仅生产构建过滤，dev 下可见 | `boolean().default(false)` |
| `series` | `string` | 否 | 无（不填=不连载） | 系列名。同一主题 ≥3 篇、需按顺序阅读时填写；零散文章不填 | `z.string().trim().optional()`，空串视为无系列 |
| `series_order` | `number` | 否 | — | 系列内阅读顺序（从 1 开始），仅配合 `series` 使用 | `int().min(1)`；缺省按发布时间升序兜底排序 |

> 系列使用规则：系列是与分类/标签互不影响的可选属性。判定标准——同一主题已有 3 篇以上且需按顺序阅读（如连载教程）才建系列，零散文章不填。有 `series` 的文章会出现在 `/series/` 系列页与独立的系列总览页；文章页会显示系列信息（头部一行 + 可折叠的系列目录），底部上一篇/下一篇在系列内按 `series_order` 相邻衔接。系列内排序规则：`series_order` 升序 → 发布时间升序兜底。

### 2.1 `normalizeList()` 的确切行为

```ts
// 输入字符串：按逗号拆分
"a, b, a"        → ['a', 'b']
// 输入数组
['Markdown', 'markdown', ' 教程 '] → ['Markdown', '教程']
```

处理步骤：`split(',')`（字符串时）→ `trim()` → 跳过空串 → 按 `toLowerCase()` 去重（保留首次出现的原始大小写）→ 输出。

### 2.2 `category` 传数组会怎样

```yaml
category: [技术, 前端]
```

归一化得到 `['技术', '前端']`，然后 `transform(v => normalizeList(v)[0] ?? '未分类')` → 最终 `category = '技术'`。第二项及之后会被静默丢弃，不要依赖多分类。

### 2.3 日期格式的坑

`published` / `updated` 在 `content.config.ts` 里经 `parseDateAsUtc()` 处理（无时区字符串补 `Z` 按 UTC 解析，YAML 裸日期已是 `Date` 对象则直通）。以下写法的解析结果：

| 写法 | 结果 |
| --- | --- |
| `published: 2026-01-01 00:01:02` | YAML 解析为字符串，补 `Z` 按 UTC 解析 → 时刻 `2026-01-01T00:01:02Z`（项目全站采用此格式；`new-post.js` 生成的即是 UTC） |
| `published: 2026-01-01` | YAML 可能解析为 `Date` 对象，schema 直通，时刻为 `UTC 00:00`（等价于按 UTC 解析） |
| `published: "2026/01/01"` | 依赖引擎实现，不推荐 |

建议统一用 `YYYY-MM-DD HH:mm:ss`（不加引号），与 `scripts/new-post.js` 生成的模板格式一致。脚本生成的 `published` 取的是当前 UTC 时间（如东八区本地 08:01:02 会写成 `00:01:02`）；站内显示统一按 UTC（`formatDate` / `monthDay` 用 `dayjs.utc()` 格式化），所有访问者看到一致的时间，不随时区变化。

### 2.4 slug 自动生成规则

`scripts/ensure-post-slugs.js` 的 `titleToSlug(title)`：

| 步骤 | 说明 |
| --- | --- |
| 1 | `pinyin(title, { toneType: 'none', type: 'array', nonZh: 'consecutive', v: true })` → 中文转无声调拼音，非中文连续保留 |
| 2 | `join(' ')` → `toLowerCase()` |
| 3 | 非 `[a-z0-9\s-]` 字符替换为空格 |
| 4 | 空白折叠为 `-`，连续 `-` 折叠为单个，去首尾 `-` |
| 5 | 空结果回退为 `'post'` |

去重：若 slug 已被占用，依次尝试 `{base}-1`、`{base}-2`…；仍冲突则追加时间戳后缀（`Date.now().toString(36).slice(-4)`）。

> 「示例」→ slug 是什么？
>
> `title: "Markdown语法样例"` → `markdown-yu-fa-yang-li`（见现有文章）。中文与英文混排时英文原样保留。

## 3. 新建文章的三种方式

### 方式一：脚本（推荐）

```bash
pnpm new-post my-first-post          # 生成 .md
pnpm new-post my-mdx-post --mdx      # 生成带 Callout 导入的 .mdx
```

生成 `src/content/posts/my-first-post.md`：

```markdown
---
title: "my-first-post"
slug:
index: 0
description: "一句话摘要"
category: "未分类"
tags: []
published: 2026-01-01 12:00:00
---

从这里开始写作。
```

带 `--mdx` 时改为生成 `.mdx`，在 frontmatter 之后多一行 `Callout` 导入与一段示例（导入路径按文件所在目录动态计算，顶层文章是 `../../components/mdx/Callout.astro`）：

```mdx
import Callout from '../../components/mdx/Callout.astro'

从这里开始写作。

<Callout type="tip" title="提示">
支持 Markdown 的提示框，type 可取 info / tip / warning / danger。
</Callout>
```

| 行为 | 说明 |
| --- | --- |
| 参数 | 首个非 `--` 参数作为 slug，缺省为 `post-{YYYY-MM-DD}`；`--mdx` 生成 `.mdx`，其他 `--*` 参数打印警告后忽略 |
| 越界校验 | slug 解析后的文件路径必须仍留在 `src/content/posts` 内，`../../foo` 与绝对路径打印 `invalid slug` 并 `exit 1` |
| 已存在 | 打印 `already exists: <path>` 并 `exit 1`，不覆盖 |
| 目录 | `mkdirSync(path.dirname(file), { recursive: true })`，嵌套 slug（如 `all/xx`）也可用 |
| `slug` | 留空，构建时由 `ensurePostSlugs` 自动填充 |
| `published` | 取当前 UTC 时间 |

### 方式二：手动创建

在 `src/content/posts/` 下新建 `.md`，粘贴上面的模板。`slug` 可以留空，`pnpm dev` / `pnpm build` 启动时会自动补全并写入文件。

### 方式三：子目录归类

```text
src/content/posts/
├── 教程/
│   ├── 入门.md
│   └── 进阶.md
└── 随笔/
    └── 2026-01.md
```

loader 的 `pattern: '**/*.{md,mdx}'` 会递归扫描。相对链接的解析也支持跨目录（见#8）。

## 4. Markdown 语法支持矩阵

| 语法 | 支持 | 实现 | 说明 |
| --- | --- | --- | --- |
| 标题 `#`–`######` | ✅ | 原生 + `rehypeSlug` + `rehypeAutolinkHeadings` | 自动加 `id`，悬停显示 `#` 锚点；左侧有层级色条 |
| 段落 / 换行 | ✅ | `remarkBreaks` | 单个换行即换行（不需要行尾两空格） |
| 强调 / 粗体 / 删除线 | ✅ | GFM | `~单波浪删除线~` 也支持 |
| 无序 / 有序列表 | ✅ | GFM | — |
| 任务列表 | ✅ | GFM | `accent-color: var(--wp-accent)` |
| 表格 | ✅ | GFM + `rehypeTableWrap` | 包成 `figure.md-table`（表头栏 + 表体）：左侧开关切换「换行显示 / 横向滚动」，默认换行、勾选后表体容器出横向滚动条；交互纯 CSS（`:has()`），状态文案与 aria-label 由 `postContent.ts` 的 `bindTableModes()` 注入 i18n |
| 链接 | ✅ | 原生 + `rehypeExternalLinks` | 站外链接自动 `target="_blank"`（按 host 判断，同 host 不加） |
| 图片 | ✅ | `rehypeImages` | 包 `.img-frame` + `a.img-lightbox`；首图 eager，其余 lazy；注入 LQIP 渐变与 `width`/`height`（防布局位移） |
| 引用块 `>` | ✅ | 原生 | 左侧 3px 主题色边框 + 4% 主题色底 |
| 行内代码 / 代码块 | ✅ | `rehypeCodeBlock`（Prism） | 头部栏带语言图标、换行切换与复制按钮：默认不换行横向滚动；点换行按钮后按容器宽度折行，行号栏保留，仅发生折行的逻辑行隐藏自己的行号，其余行号由 `postActions.ts` 的 `syncWrappedGutter()` 按折行后实际高度逐行对齐（窗口变化会重算）；19 个 Prism 语法组件 |
| 水平线 | ✅ | 原生 | `---` / `***` / `___` |
| 脚注 | ✅ | GFM + `remarkRehype` | id 前缀为 `post-`（不是默认的 `user-content-`） |
| 数学公式 | ✅ | `remarkMath` + `rehypeKatex` | 行内 `$…$`、块级 `$$…$$`；KaTeX 的 CSS 按需加载（见下） |
| Emoji 短代码 | ✅ | `remarkEmoji` | `:smile:` → 😄 |
| 自动链接 | ✅ | GFM | `<https://…>`、`www.example.com` |
| 内联 HTML | ✅ 页面 / ✅ RSS | 由 Astro 的 markdown 处理器保留 raw 节点 | 页面输出原生标签；RSS 的 `content:encoded` 用 CDATA 包裹，见下方说明 |
| 提示容器 | ✅ | `remarkContainers`（自定义） | `:::info` / `tip` / `warning` / `danger` / `details` |
| MDX / 组件嵌入 | ✅（`.mdx`） | `@astrojs/mdx` | 表达式、JSX、`import` 组件，与 `.md` 共用同一套插件链，见 4.1 |
| 缩进式代码块（4 空格） | ❌ | — | 见下方说明 |

> 数学公式的 CSS 按需加载
>
> `katex/dist/katex.min.css` 不再随文章页静态引入。`PostPage.astro` 在页面初始化时判断 `document.querySelector('.katex')`，只有正文真的渲染出公式才把 KaTeX 的 CSS 注入 `<head>`：
>
> ```ts
> const { default: css } = await import('katex/dist/katex.min.css?inline')
> const style = document.createElement('style')
> style.dataset.katexCss = '1'   // 换页（Swup）后不重复注入
> style.textContent = css
> document.head.appendChild(style)
> ```
>
> 这里用 `?inline` 取 CSS 文本而不是直接 `import '…css'`，是因为 `astro.config.mjs` 的 `build.inlineStylesheets: 'always'` 会把动态 import 出来的 CSS 资源一并内联进页面 HTML 并删掉资源文件——直接 import 会让公式页额外发出一个 404 的样式请求；取文本放进按需加载的 JS 分片里，才是真正的按需下载。
>
> 因此：无公式的文章页不会下载任何 KaTeX 资源；含公式的页面多下载一个 JS 分片 + woff2 字体（构建期由 `postbuild.js` 裁掉 ttf/woff，见 [06-构建与脚本.md#5](./06-构建与脚本.md#5-scriptspostbuildjs)）。
>
> 自查方式：DevTools → Network 过滤 `katex`；或 `performance.getEntriesByType('resource')` 里搜索 `katex`。

> 内联 HTML：页面与 RSS 都以原生标签输出

页面渲染：✅ 正常。 已实测 `dist/posts/markdown-yu-fa-yang-li/index.html` 中 `<kbd>Ctrl</kbd>`、`<span style="color:red;">红色文字</span>` 都是以原生标签输出的（Astro 的 markdown 处理器内部开启了 `allowDangerousHtml` 并把 raw 节点保留到最终 HTML）。

RSS：✅ 已改为 CDATA 包裹。 早期版本里 `<content:encoded>` 输出的是 `&lt;p&gt;&lt;kbd&gt;Ctrl&lt;/kbd&gt;…`，原因是 `@astrojs/rss` 会对 `content` 字段做 XML 转义且没有关闭开关（与 `renderMarkdownHtml` 无关——后者本身输出的仍是原生 HTML）。现在 `src/pages/rss.xml.ts` 不再走 `@astrojs/rss`，而是自己拼整份 XML：

- `content:encoded` 用 `cdata()` 包裹，`]]>` 按 XML 规则拆成 `]]]]><![CDATA[>`；
- `title` / `link` / `description` / `category` 等文本节点仍走 `escapeXml()` 转义；
- `link` 与 `guid` 自己拼成绝对 URL，`pubDate` 用 `toUTCString()`（RFC 822），与原行为一致。

自查：`grep -c '&lt;p&gt;' dist/rss.xml` 应为 `0`；`<!\[CDATA\[` 与 `]]>` 的出现次数应相等。

> 内联 HTML 的安全边界

Markdown 里写什么 HTML 就会输出什么（无净化）。不要在文章里粘贴来源不可信的内联 HTML/`<script>`——astro.config 的 `rehypePlugins` 里没有 `rehype-sanitize`。

不要用缩进创建代码块！

`Markdown语法样例.md` 明确提示：「请勿使用缩进 4 个空格或一个制表符来创建代码块，因为不会显示。」

原因是 `remarkBreaks` 把单换行转为 `<br>`，缩进块在解析阶段的边界行为与预期不符。请统一用围栏代码块 ``` ``` ```。

### 4.1 MDX（`.mdx`）文章支持

`.mdx` 与 `.md` 共用同一套 markdown 处理器，只是多了一层 MDX 编译，因此上文矩阵里的语法能力全部保留，额外获得三类能力：

| 能力 | 写法 | 说明 |
| --- | --- | --- |
| 内联表达式 | `{2 ** 10}` | 任意 JavaScript 表达式，构建期求值后静态输出 |
| 导出变量 | 文件顶部 `export const year = 2026`，正文写 `{year}` | 全篇可引用 |
| JSX 与组件导入 | `import Callout from '../../components/mdx/Callout.astro'`，正文写 `<Callout type="tip" title="标题">内容</Callout>` | 导入路径相对当前文章文件解析；组件的子内容支持 Markdown |

接入只需两处：`astro.config.mjs` 的 `integrations` 加 `mdx()`，`content.config.ts` 的 loader `pattern` 改为 `'**/*.{md,mdx}'`。`mdx()` 默认 `extendMarkdownConfig: true`，直接复用 `markdown.processor` 的自定义 unified 管线（`rehypeCodeBlock`、`remarkContainers`、`rehypeKatex` 等全部生效），不需要为 MDX 另维护一份插件链。

与 `.md` 的差异点：

| 差异 | 说明 |
| --- | --- |
| `raw` 节点转换 | `rehypeCodeBlock` / `rehypeImages` 会把节点替换成 `raw` 类型，`.md` 交给 `rehypeStringify` 直出，`@mdx-js` 编译阶段则不识别 `raw`。`src/lib/md/rehypeRawToElements.ts`（仅对 `.mdx` 生效）负责把 `raw` 逐个解析成真实 hast 元素；必须逐节点包 wrapper 树解析，不能对整棵树调 `rehype-raw`——MDX 管线最前面已有一次内置的 `rehype-raw` 往返，二次整树往返会把解析结果重复插入 |
| 图片写法 | 用 Markdown 语法 `![alt](../images/x.webp)`。写成 JSX 的 `<img src="…">` 不经过 `rehypeImages`，没有 `.img-frame` 灯箱与 LQIP 占位（`generate-lqips.js` 的扫描正则同样只认 Markdown 图片语法） |
| 裸花括号 | 正文里单独出现的 `{` 会按表达式解析，写普通文本要用反引号包裹（如 `` `{}` ``）或转义成 `\{` |
| 字数统计 | `post.body` 对 `.mdx` 保留的是 MDX 源码，`wordCount()` / `readMinutes()` 直接可用（JSX 标签会按词计入，略有高估） |
| RSS | `.mdx` 条目不走 `pipeline.ts`，由 `astro/container` 把 `render(post)` 的 Content 组件渲染成 HTML（见 [07-页面与路由.md#4.4](./07-页面与路由.md#44-rsssrcpagesrssxmlts)） |

完整示例见 `src/content/posts/MDX示例文章.mdx`（slug：`mdx-example`），演示了表达式、导出变量、`.map()` 列表、内联样式与 `src/components/mdx/Callout.astro` 组件的导入用法。

## 5. 提示容器（`remarkContainers`）

### 5.1 语法

```markdown
:::info 标题可选
容器内容，支持 markdown 语法。
:::

:::tip
不写标题时，标题默认显示类型名（如 `tip`）。
:::

:::warning
警告内容
:::

:::danger
危险内容
:::

:::details 点击展开
details 是唯一可折叠的容器，标题变成 `<summary>`。
:::
```

### 5.2 五种类型对照表

| 类型标识 | 生成 class | 标题元素 | 左边框色 | 标题色变量 |
| --- | --- | --- | --- | --- |
| `info` | `md-container md-container-info` | `<p class="md-container-title">` | `#6fa8dc`（写死） | `--wp-info-title` |
| `tip` | `md-container md-container-tip` | 同上 | `#7ba05b`（写死） | `--wp-tip-title` |
| `warning` | `md-container md-container-warning` | 同上 | `#d9a441`（写死） | `--wp-warn-title` |
| `danger` | `md-container md-container-danger` | 同上 | `#c96a5b`（写死） | `--wp-danger-title` |
| `details` | `md-container md-container-details` | `<summary class="md-container-title">` | `var(--wp-text-tertiary)` | 默认文字色 |

### 5.3 解析规则（`src/lib/md/remarkContainers.ts`）

| 规则 | 实现 |
| --- | --- |
| 开启标记 | 行首 `:::类型` + 可选标题（正则 `^:::([a-zA-Z]+)[ \t]*(.*)$`） |
| 合法类型白名单 | `CONTAINER_TYPES = new Set(['info','tip','warning','danger','details'])` |
| 结束标记 | 单独一行 `:::` |
| 未闭合 | 不报错，降级：内容按普通段落展开，`:::opener` 行也按普通文本保留（与类型不在白名单的行为一致，作者能直接看到问题），不生成容器 |
| 类型不在白名单 | 视为普通段落，保留原样文本 |
| 标题缺省 | 显示类型名（`title \|\| type`） |
| 连续行合并 | `mergeLineRuns()` 把相邻行用 `<br>` 连接成一个段落，块级节点（列表、代码块）原样保留 |

### 5.4 增加一个自定义容器类型（如 `:::success`）

需要改三个文件：

第 1 步：`src/lib/md/remarkContainers.ts`

```ts
const CONTAINER_TYPES = new Set(['info', 'tip', 'warning', 'danger', 'details', 'success'])
```

第 2 步：`src/styles/markdown.css`（加样式）

```css
.post-content .md-container-success { border-left-color: #4a9d6a; }
.post-content .md-container-success .md-container-title { color: var(--wp-success-title); }
```

第 3 步：`src/styles/main.css`（加标题色的变量）

```css
:root { --wp-success-title: #2f7048; }
.dark { --wp-success-title: #7bc39a; }
```

> 改 `remarkContainers` 后需要重启 dev
>
> 它在 `astro.config.mjs` 里被静态 import 进 markdown 处理器，改动后 Vite 不会热更新 markdown 配置，请重启 `pnpm dev`。重启时 `scripts/sync-md-cache.js` 会比对渲染管线指纹并自动清掉 Astro 内容缓存，避免没改过的文章仍沿用插件改动前的 HTML（详见 [09-常见改造与排错.md](./09-常见改造与排错.md) 的 Q9）。

## 6. 代码块实现与可调参数

### 6.1 生成的 HTML 结构

```html
<div class="code-block">
  <div class="code-header">
    <span class="code-lang"><svg …/>python</span>
    <div class="code-actions">
      <button class="code-wrap" type="button" aria-pressed="false" onclick="window.__blogToggleCodeWrap(this)"><svg …/></button>
      <button class="code-copy" type="button" onclick="window.__blogCopyCode(this)"><svg …/><span>复制</span></button>
    </div>
  </div>
  <div class="code-body">
    <div class="code-gutter"><span>1</span><span>2</span>…</div>
    <pre class="code-pre"><code class="language-python">…token 化的 HTML…</code></pre>
  </div>
</div>
```

> 头部动作区（`code-actions`）里换行按钮在复制按钮左侧。默认不换行、横向滚动；点开后 `code-pre code` 变 `pre-wrap` 按容器宽度折行，**行号栏保留**——`postActions.ts` 的 `syncWrappedGutter()` 会测量每个逻辑行折行后的实际高度，写回 `.code-gutter span` 的 `height`，并给发生折行的行加 `.is-folded` 隐藏其行号，未折行的行号仍逐行对齐。窗口宽度变化会重新测量。

### 6.2 支持的语言（Prism 语法）

`src/lib/md/rehypeCodeBlock.ts` 顶部 import 了这些 Prism 组件：

| Prism 语法 key | 说明 |
| --- | --- |
| `markup` | HTML/XML 基础（`html` / `xml` 也走它） |
| `clike` | C 类语法基础（被多数语言依赖） |
| `javascript` | JS |
| `typescript` | TS |
| `json` | JSON |
| `css` | CSS |
| `bash` | Shell |
| `yaml` | YAML |
| `markdown` | Markdown |
| `python` | Python |
| `java` | Java |
| `c` | C |
| `cpp` | C++ |
| `go` | Go |
| `rust` | Rust |
| `sql` | SQL |
| `diff` | diff（`+`/`-` 着色；完整差异对比请用 `:::diff` 容器） |
| `ini` | INI |
| `toml` | TOML |

加一门语言：在 `rehypeCodeBlock.ts` 顶部追加 `import 'prismjs/components/prism-xxx'`（注意 Prism 组件有依赖顺序，例如 `prism-jsx` 需要在 `prism-markup` + `prism-javascript` 之后）。

### 6.3 语言图标映射

`langIconMap`（源码第 45–77 行）：

| 语言标识（支持别名） | 图标 |
| --- | --- |
| `javascript` `js` | `mdi-language-javascript` |
| `typescript` `ts` | `mdi-language-typescript` |
| `json` | `mdi-code-json` |
| `css` | `mdi-language-css3` |
| `html` `markup` | `mdi-language-html5` |
| `xml` | `mdi-xml` |
| `bash` `shell` `sh` `zsh` | `mdi-bash` |
| `yaml` `yml` `ini` `toml` | `mdi-file-cog-outline` |
| `markdown` `md` | `mdi-language-markdown` |
| `python` `py` | `mdi-language-python` |
| `java` | `mdi-language-java` |
| `c` | `mdi-language-c` |
| `cpp` `c++` | `mdi-language-cpp` |
| `go` `golang` | `mdi-language-go` |
| `rust` `rs` | `mdi-language-rust` |
| `sql` | `mdi-database` |
| `diff` | `mdi-file-compare` |
| 其他任意语言 | `mdi-code-braces`（通用图标） |

加语言图标：在 `langIconMap` 里加映射即可（图标常量需已存在于 `src/lib/icons.ts`，否则 `IconName` 类型会报错）。

### 6.4 未知语言的处理

```ts
function normalizeLanguage(raw) {
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '')
  return Prism.languages[cleaned] ? cleaned : ''   // 不在 Prism 里则返回空串
}
```

| 情况 | 结果 |
| --- | --- |
| 已知语言 | 正常高亮，`<code class="language-{lang}">` |
| 未知语言（如 ` ```foobar `） | `langClass` 变为 `language-text`，内容走 `Prism.util.encode()` 纯转义，不高亮 |
| 无语言标识（` ``` `） | 语言标签显示 `text`，同上 |
| 语言含额外信息（如 ` ```js:title=foo `） | `langIcon()` 会按 `[\s:{\[]` 截断取首段作为图标 key |

### 6.5 服务端代码块的「硬编码中文复制按钮」

> `rehypeCodeBlock.ts` 里写死了「复制」
>
> 源码第 110 行：
>
> ```ts
> `…<button class="code-copy" …>${iconSvg('mdi-content-copy')}<span>复制</span></button>…`
> ```
>
> 这个 `复制` 是构建期硬编码的中文。`PostPage.astro` 在客户端用 `window.__blogCopyIdleHtml` / `__blogCopyDoneHtml`（由 i18n 的 `post.copy` / `post.copied` 生成）覆盖它，所以最终显示是正确的。
>
> 但有一个副作用：代码块在 JS 加载前短暂显示「复制」。若你的站点非中文且在意这个 FOUC，请把 `rehypeCodeBlock.ts` 的复制按钮做成不含文本的空按钮（保留图标），完全交给客户端填充。

### 6.6 可调参数

| 想改什么 | 位置 | 当前值 |
| --- | --- | --- |
| 代码字体大小 | `markdown.css` `.code-body` 的 `--code-font-size` | `0.85rem` |
| 代码行高 | 同上 `--code-line-height` | `1.7` |
| 行号栏宽度 | `.code-gutter` 的 `min-width` | `2.8em` |
| 是否显示行号 | 删掉 `rehypeCodeBlock.ts` 中 `buildLineNumbers()` 的调用与 `.code-gutter` 那段 HTML | 显示 |
| 折行时行号的处理 | `markdown.css` 的 `.code-block.is-wrapped .code-gutter span.is-folded` | `visibility:hidden` 隐藏发生折行那几行的行号（行号栏本身保留） |
| 行号与折行行对齐 | `postActions.ts` 的 `syncWrappedGutter()` | 镜像测量每个逻辑行折行后的实际高度，写回 `.code-gutter span` 的 `height`；窗口 resize 重算 |
| 复制成功提示时长 | `PostPage.astro` 的 `setTimeout(..., 2000)` | 2000ms |
| 代码块圆角 | `markdown.css` `.code-block { border-radius }` | `12px` |
| 代码块头部背景 | `markdown.css` `.code-header { background }` | 亮色 `rgba(255,255,255,.35)` / 暗色 `rgba(255,255,255,.03)` |

## 7. 图片处理与 LQIP 占位

### 7.1 图片引用的三种写法

| 写法 | 转换结果 | 说明 |
| --- | --- | --- |
| `![alt](../images/logo.webp)` | `/content-images/{sha1前16位}.webp` | 相对路径，跨目录用 `../` |
| `![alt](/avatar.webp)` | 原样保留 | 以 `/` 开头 → `public/` 下的文件 |
| `![alt](https://example.com/a.png)` | 原样保留 | 外链图片 |

`rehypeImages` 会把每个 `<img>` 包成：

```html
<span class="img-frame is-sized" style="--img-lqip:linear-gradient(135deg,#aabbcc 0%,#ddeeff 50%,#112233 100%)">
  <a class="img-lightbox" href="{src}" title="…" data-pswp-width="512" data-pswp-height="512">
    <img src="{src}" alt="…" width="512" height="512" loading="lazy" decoding="async" />
  </a>
</span>
```

| 细节 | 规则 |
| --- | --- |
| 首图 | `loading="eager" fetchpriority="high"`（每个文件只有第一张） |
| 其余图 | `loading="lazy" decoding="async"` |
| `data:` 开头的 src | 跳过包装，不处理 |
| `title` 属性 | 存在则同时写到 `<img>` 与 `<a>` |
| 尺寸已知 | 加 `is-sized` 类并写 `width`/`height`（来自 `.generated/lqips.json`）；`.img-frame.is-sized` 在加载期就用 `width: fit-content` 贴合图片，因此不会先撑满容器再回缩 |
| 尺寸未知 | 保持 `class="img-frame"`，加载期仍是 `min-height: 8rem` 的 shimmer 骨架（`public/` 图片、外链图片、SVG 等） |
| 灯箱尺寸 | 尺寸已知时同时给 `<a>` 写 `data-pswp-width`/`data-pswp-height`，PhotoSwipe 打开幻灯片前就能拿到原始尺寸，首次点击的缩放动画即为正确尺寸，不需要等图片 load |

### 7.2 LQIP（主色渐变占位）

| 环节 | 实现 |
| --- | --- |
| 采样 | `scripts/generate-lqips.js`：`sharp(input).metadata()` 取原始宽高，再 `sharp(input).resize(2,2,{fit:'fill'}).removeAlpha().raw()` 取 4 像素，用第 1、2、4 个像素（偏移 0、3、9 字节）拼成 18 位十六进制 |
| 存储 | `.generated/lqips.json`：`{ "/content-images/883d9fc6f4cc516e.webp": { "c": "632d1b6a301b582816", "w": 512, "h": 512 } }`（`c` 是 3 个像素拼接的 18 位十六进制，`w`/`h` 是原始尺寸） |
| 消费 | `rehypeImages.ts` 读取（带 mtime 缓存）：`c` → `--img-lqip` 的 `linear-gradient(135deg, c1 0%, c2 50%, c3 100%)`；`w`/`h` → `<img>` 的 `width`/`height` 与 `.img-frame` 的 `is-sized` 类 |
| 旧格式兼容 | 读到 `"c"` 形态的字符串（早期版本）或缺少 `w`/`h` 的条目时按「无尺寸」处理：仍生成渐变，但不写 `width`/`height`；下次构建会自动重算成新结构 |
| 兜底 | 取色失败 → 无 `--img-lqip` → CSS 回退灰白 shimmer（`markdown.css` 的 `.img-frame:not(.is-loaded)`） |
| 强制重算 | `LQIP_FORCE=1 pnpm build`（PowerShell：`$env:LQIP_FORCE=1; pnpm build`） |
| 增量 | 默认只处理 `.generated/lqips.json` 里不是当前结构的 key（缺 `c`/`w`/`h` 都会重算）；改了图片文件内容但路径不变时不会重算，需 `LQIP_FORCE=1` |

### 7.3 图片路由 `/content-images/[file]`

`src/pages/content-images/[file].ts` 是一个 `prerender = true` 的静态路由：

| 项 | 说明 |
| --- | --- |
| 输入 | `params.file` = `contentImageName(rel)` = `sha1(rel).slice(0,16) + ext` |
| 枚举 | `getStaticPaths()` 递归遍历 `src/content/` 下所有图片文件（9 种扩展名） |
| 输出 | 文件二进制 + `Content-Type` |
| 缓存 | 生产 `public, max-age=31536000, immutable`；开发 `public, max-age=3600` |
| 未找到 | 404 |

支持的图片扩展名：`.webp` `.png` `.jpg` `.jpeg` `.gif` `.svg` `.avif` `.ico` `.bmp`

> 为什么用 hash 而不是原文件名？
>
> 好处是避免中文文件名 URL 编码问题、天然去重、可长缓存（文件内容变了路径不变，但通过重新构建会有新 hash… 注意：hash 只基于相对路径，不基于内容。改了图片内容但路径不变时 hash 不变，浏览器可能命中长缓存。此时需要清理缓存或改名）。

### 7.4 灯箱（PhotoSwipe）

由 `PostPage.astro` 的 `initPhotoswipe()` 初始化：

| 参数 | 值 | 说明 |
| --- | --- | --- |
| `gallery` | `'.post-content'` | 图库容器 |
| `children` | `'a.img-lightbox'` | 可点击项 |
| `showHideAnimationType` | `'zoom'` | 缩放动画 |
| `imageClickAction` | `'next'` | 点击图片切换到下一张（而不是关闭） |
| `bgOpacity` | `0.85` | 遮罩透明度 |
| 自定义 UI | `custom-caption`（order 9） | 底部居中白字显示 `{宽} × {高}` |
| 尺寸获取 | 优先 `img.naturalWidth`，否则等 `load`；最多等 2500ms | |
| 尺寸写入 | `a.dataset.pswpWidth` / `pswpHeight`（已写过则跳过） | |
| 懒初始化 | 通过 `requestIdleCallback`（超时 1000ms）或双 rAF + setTimeout 降级 | |
| 依赖加载 | `import('photoswipe/lightbox')` + `import('photoswipe')` 动态引入（已加入 `optimizeDeps.include`） | |

### 7.5 图片骨架状态机

| class | 时机 | 样式 |
| --- | --- | --- |
| （初始） | — | `background: var(--wp-surface-hover)` + LQIP 渐变 + `img-shimmer` 动画 |
| `is-loaded` | `img.complete && naturalWidth > 0`，或 `load` 事件 | 取消动画，`width: fit-content`，图片淡入（`opacity 0.35s`） |
| `is-error` | `error` 事件 | 隐藏 `<img>`，容器高度降到 `3rem` |

## 8. 相对链接自动转换

### 8.1 支持的写法

| 写法 | 转换结果 |
| --- | --- |
| `[文本](./其他文章.md)` | `/posts/{其他文章的slug}/` |
| `[文本](./其他文章.md#某标题)` | `/posts/{slug}/#某标题` |
| `[文本](../posts/其他.md?query=1)` | `/posts/{slug}/?query=1` |
| `![图](../images/logo.webp)` | `/content-images/{hash}.webp` |
| `[不支持](../data/file.json)` | 保持原样 + 构建期警告 |

### 8.2 解析流程（`src/lib/md/linkResolve.ts`）

解析逻辑集中在 `linkResolve.ts` 的 `resolveHrefTarget()`；`src/lib/md/rehypeRelativeLinks.ts` 只是它的 rehype 外壳（遍历 hast 树、把命中的 `href` 换掉），构建期的反向链接统计（`scripts/ensure-post-slugs.js`）也调用同一个函数，两处判定不会各自漂移。

```text
1. 只处理 isRelativeSrc(href) 的链接（非 http(s)/非 //、非 /、非 #、非 data:）
2. 用 [?#] 拆分 pathPart 与 suffix（后缀会拼回结果）
3. resolveContentPath(pathPart, filePath)
   → 以 src/content/ 为根做安全拼接，遇到 .. 出界返回 null（并警告）
4. 查 .generated/post-index.json：
   - 命中 → 用 entry.slug
   - 未命中但扩展名是 .md/.markdown → 直接读文件 frontmatter 取 slug
   → 输出 /posts/{slug}/{suffix}
5. 若是图片扩展名 → resolveContentImage → /content-images/{hash}.ext
6. 其他 → 保持原样 + 警告
```

`resolveHrefTarget()` 的最后一个参数是警告回调（默认 `warnRelLink`）。反向链接统计会传一个空回调，避免与 `rehypeRelativeLinks` 的构建期警告重复打印。

### 8.3 构建期警告一览

| 警告文本 | 触发条件 |
| --- | --- |
| `relative link escapes src/content/, kept as-is` | `../` 超出了 `src/content/` 根 |
| `links to a draft post which is not built in production` | 链接到 `draft: true` 的文章，且当前是生产构建 |
| `target post not found, kept as-is` | `.md` 目标文件不存在或没有可用 slug |
| `unsupported relative link target, kept as-is` | 目标既不是文章也不是已知图片类型 |

> 为什么链接失效只警告不报错？
>
> 因为预取（Swup preload）会请求该 URL 返回 404，但不影响页面正常显示。项目选择「构建期警告 + 保留原样」的宽松策略。请留意构建输出，及时修正。

## 9. 文章页面的 TOC（目录）

### 9.1 数据来源

`render(post)` 返回的 `headings`（Astro 内置，来自 `rehypeSlug` 生成的 `id` 与标题文本）。

| 变量 | 计算 |
| --- | --- |
| `hasToc` | `headings.length > 0` |
| `tocMinLevel` | `Math.min(...headings.map(h => h.depth))`，无标题时回退 `2` |
| 缩进 | `padding-left: ${12 + (h.depth - tocMinLevel) * 14}px` |

### 9.2 两种呈现

| 形态 | 触发条件 | DOM |
| --- | --- | --- |
| 桌面侧边固定 | `xl`（≥1280px）显示（`hidden xl:block`） | `#toc-affix` > `.toc-affix` > `.toc-affix-list` |
| 移动端弹窗 | 点右下 `#toc-fab` 打开 | `#toc-modal` |
| 右下按钮 | `ScrollControls.css` 里 `@media (min-width: 1280px) { .toc-btn { display: none } }` | `#toc-fab` |

### 9.3 可调参数（`PostPage.astro` 内常量）

| 常量 | 值 | 作用 |
| --- | --- | --- |
| `TOC_OFFSET` | `80` | 锚点滚动时距顶部的偏移（px），同时也是「当前标题」判定阈值基准（+16） |
| `TOC_SNAP_RANGE` | `80` | 「吸附」范围：标题进入 `[threshold, threshold+80]` 区间时优先选中 |
| `tocScrollDelta` 的 `pad` | `12` | 侧栏自动滚动时距边缘的留白 |
| 侧栏宽度 | `.toc-affix` 的 `w-52` | `13rem` |
| 侧栏左偏移 | `PostPage.css` 的 `left: calc(50% + 26rem)` | 贴住玻璃卡片右缘：外框 `max-w-[832px]` 的一半 = 416px = 26rem |
| 侧栏顶部 | `.toc-affix { top: 96px }` | — |
| 侧栏最大高度 | `max-height: calc(100vh - 190px)` | — |

> 改内容区宽度要同步 TOC
>
> `BaseLayout` 的 `<main class="max-w-[832px]">` 与 `PostPage.css` 的 `left: calc(50% + 26rem)` 是耦合的。`832px` 是玻璃卡片外框宽度（正文内容 800px + 左右 `px-4` 各 16px ），而 `26rem = 416px = 832 / 2`——侧栏是 `fixed` 定位，`50%` 从视口中线起算，偏移半个外框宽度即贴住卡片右缘。
>
> 换算公式：内容宽改为 `W` 时，外框 = `W + 32`，侧栏偏移 = `calc(50% + (W + 32) / 2 px)`。例如内容 900px → 外框 932px → 偏移 466px ≈ `calc(50% + 29rem)`。
>
> 参考 [03-主题与样式定制.md#53-常用排版参数调整位置](03-主题与样式定制.md#53-常用排版参数调整位置)

### 9.4 高亮与滚动逻辑

| 环节 | 实现 |
| --- | --- |
| 监听 | `window` 的 `scroll`（passive）+ `requestAnimationFrame` 节流 |
| 算法 | 遍历 `.post-content` 内 `h1..h6`：记录最后一个「顶部已越过 threshold」的标题（`currentByPassed`）；同时找 `[threshold, threshold+80]` 区间内最近的标题（`snapId`）；优先 `snapId`，否则 `currentByPassed`，再否则第一个标题 |
| 高亮 | 给所有 `.toc-link` 切换 `toc-active` 类（`PostPage.css` 定义样式：主题色 + 左侧边框 + 7%/10% 主题色背景） |
| 自动滚动 | `tocScrollDelta()` 计算需要滚动的像素，`list.scrollTop += delta` |
| 点击跳转 | 拦截 `a.toc-link` 点击 → `smoothScrollToHeading()` → `history.replaceState` 更新 hash → 关闭移动端弹窗 |
| 锚点容错 | `findAnchorTarget(id)` 依次尝试：原始 id → `decodeURIComponent(id)` → `encodeURIComponent(id)` |

> 上表「点击跳转」只针对同页目录链接。跨页面的锚点链接（如 markdown 相对链接带 `#`）由 `BaseLayout` 的点击委托接管：SPA 导航到页顶 → 加载后按同样的 80px 偏移平滑滚动（含直接打开 `#` 深链接场景），详见 [07-页面与路由.md#84](./07-页面与路由.md#84-跨页锚点链接的平滑跳转)。

## 10. 内容创作完整流程示例

```bash
# 1. 新建文章
pnpm new-post my-post

# 2. 编辑 src/content/posts/my-post.md
#    填 title / description / category / tags / published
#    slug 留空，构建时自动生成

# 3. 元数据排序（可选，但推荐）
pnpm format-post-meta
#    → 输出：formatted N posts 或 all post meta already in canonical order

# 4. 本地预览
pnpm dev
#    → 访问 http://localhost:4321

# 5. 构建（会补 slug、生成 LQIP、生成搜索索引）
pnpm build

# 6. 检查构建警告（相对链接、LQIP 取色失败等）
#    7. 预览产物
pnpm preview

# 8. 提交（先 build 再 commit，让 slug/updated 改动一起进版本库）
git add -A && git commit -m "post: my-post"
```

### `pnpm format-post-meta` 的字段顺序

`scripts/format-post-meta.js` 定义的规范顺序：

```js
order = ['title', 'slug', 'index', 'description', 'category', 'tags', 'published']
last  = ['updated', 'draft']
```

最终顺序：`order` 中存在的字段（按序）→ 其他未列出的自定义字段（保持原相对顺序）→ `last` 中存在的字段（按序）。

| 特性 | 说明 |
| --- | --- |
| 幂等 | 若顺序已正确则跳过（不写文件），输出 `all post meta already in canonical order` |
| 换行符保留 | 检测原文件是 `\r\n` 还是 `\n` 并沿用 |
| 多行值支持 | 按 `^([A-Za-z_][\w-]*):` 识别字段起始，后续非字段行归入当前字段 |
| 不改内容 | 只重排，不修改值 |

> 加了自定义 frontmatter 字段（如 `cover`）后，它会落在「其他字段」区；想固定位置请把它加入 `ORDER` 或 `LAST`。
