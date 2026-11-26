---
version: 1.0
name: onepage 设计契约
description: 纸墨朱砂的单页主页设计系统：一套语义令牌 × 五套主题 × 明暗两版，服务「一个 YAML 文件生成个人主页」的静态站点与其排版台编辑器。

colors:
  paper: "#fafaf7"
  card: "#ffffff"
  ink: "#1d232e"
  ink-2: "#5d6673"
  line: "#e6e5dc"
  cell: "#edece3"
  accent: "#c8402e"
  accent-2: "#a33524"

typography:
  display:
    fontFamily: "Inter, Noto Sans SC, system-ui, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 48px
    fontSizeSm: 36px
    lineHeight: 1.1
    fontWeight: 800
    letterSpacing: -0.01em
  heading:
    fontFamily: "Inter, Noto Sans SC, system-ui, sans-serif"
    fontSize: 24px
    lineHeight: 1.33
    fontWeight: 700
    letterSpacing: -0.01em
  card-title:
    fontFamily: "Inter, Noto Sans SC, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
  body:
    fontFamily: "Inter, Noto Sans SC, system-ui, sans-serif"
    fontSize: 16px
    lineHeight: 1.65
    fontWeight: 400
  body-lg:
    fontFamily: "Inter, Noto Sans SC, system-ui, sans-serif"
    fontSize: 18px
    lineHeight: 1.65
  meta:
    fontFamily: "Inter, Noto Sans SC, system-ui, sans-serif"
    fontSize: 14px
    lineHeight: 1.625
  caption:
    fontFamily: "Inter, Noto Sans SC, system-ui, sans-serif"
    fontSize: 12px
    lineHeight: 1.5
  eyebrow:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: 12px
    lineHeight: 1.5
    fontWeight: 600
    letterSpacing: 0.14em
    textTransform: uppercase
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: 12px
    fontWeight: 400
    fontVariantNumeric: tabular-nums
  stat:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: 30px
    fontWeight: 600
    fontVariantNumeric: tabular-nums
  chip:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: 11px

rounded:
  chip: 4px
  control: 6px
  card: 8px
  avatar: 8px

spacing:
  gutter: 20px
  container: 1024px
  containerWide: 1152px
  section: 64px
  cardPad: 24px
  cardPadDense: 16px
  rowPad: 14px

elevation:
  card-hover: "0 2px 12px color-mix(in srgb, {colors.ink} 6%, transparent)"

components:
  card:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.line}"
    rounded: "{rounded.card}"
    padding: "{spacing.cardPad}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    fontWeight: 500
  button-secondary:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.line}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
  icon-button:
    borderColor: "{colors.line}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    size: 44px
  chip:
    backgroundColor: "transparent"
    borderColor: "{colors.line}"
    textColor: "{colors.ink-2}"
    typography: "{typography.chip}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  text-field:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.line}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  thumbnail:
    aspectRatio: "1200 / 630"
    backgroundColor: "{colors.cell}"
    objectFit: contain
  callout-error:
    borderLeftColor: "{colors.accent}"
    backgroundColor: "color-mix(in srgb, {colors.accent} 6%, {colors.card})"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
---

# onepage 设计契约

## Overview

一页纸的个人主页：纸白底、墨色字、朱砂只在数据和印章上落一笔。产品性格是「排印干净的私人印刷品」，不是「带渐变的应用界面」。

三条不可动摇的基调：

1. **零运行时 JS**（主页）。所有交互靠 CSS 与语义 HTML；只有 `/edit` 排版台是 Preact 岛。
2. **一份 YAML 就是整个站点**。设计系统必须能被配置里的 `主题` / `外观` / `强调色` 三个字段整体换肤，因此任何颜色都只能以语义令牌出现，不能以具体色值出现在版式代码里。
3. **中英日混排**。正文行高 1.65、标题 `text-wrap: balance`，中文标题必须按「会换行」来设计。

## Colors

令牌定义在 `src/styles/global.css` 的 `@theme` 块，是全站唯一的颜色来源。

| 令牌 | 语义 | 用在哪 |
| --- | --- | --- |
| `{colors.paper}` | 页面底色（纸） | `body` 背景、主按钮文字 |
| `{colors.card}` | 卡片/控件底色（白纸） | `.card`、`.btn`、`.text-field` |
| `{colors.ink}` | 主文字 + **主按钮底色** | 标题、正文、`.btn-primary` |
| `{colors.ink-2}` | 次级文字、元信息 | 介绍段、描述、日期、页脚 |
| `{colors.line}` | 分隔细线、控件描边 | `border`、`divide` |
| `{colors.cell}` | 缩略图占位底 | `.thumb` |
| `{colors.accent}` | 朱砂：印章、数据、链接强调 | `.eyebrow` 计数、★ 首字、`.link-quiet:hover`、`:focus-visible` |
| `{colors.accent-2}` | 深朱，强调色的 hover/加深版 | hover 态 |

**朱砂不铺底色。** 主按钮是墨底白字，不是朱砂底——朱砂一旦当大面积底色，整页的「印刷品」感就变成「营销页」。

主题 = 一次令牌重指：`朱砂`（默认）、`靛蓝`、`森绿`、`暖褐`、`墨黑` 各自重定义同一组 `--color-*`；暗版由 `--*-d` 变量经一对共享激活块（`[data-appearance="暗"]` 与 `prefers-color-scheme` + `自动`）重指，**不在主题块里重复写暗色 hex**。

`墨黑` 是刻意的极端：`accent` 即 `ink`，强调靠字重与位置，不靠色相。

## Typography

- 拉丁用 Inter（400/500/700 自托管 woff2），数据与序号用 IBM Plex Mono（400/600）。
- 中文没有自托管字体，走 `Noto Sans SC → system-ui → PingFang SC → Microsoft YaHei` 回退链，**所以行高必须按中文字面高度留余量**：标题行高 ≥ 1.1，正文 1.65。
- 字号只用这七档：`{typography.display}`（站名）、`{typography.heading}`（节标题）、`{typography.card-title}`（卡标题）、`{typography.body}` / `{typography.body-lg}`（介绍）、`{typography.meta}`（描述）、`{typography.caption}`（元信息）、`{typography.chip}`。
- **等宽字 = 数据**。凡是被当作「数字/日期/序号/语言名」呈现的东西，一律 `.mono` + `font-variant-numeric: tabular-nums`，保证多行左缘对齐。
- `.eyebrow` 是唯一的全大写小标签（0.14em 字距），只用于区块名与编辑器分组，不用于正文。

## Layout

- 主页容器用 `{spacing.container}`（`max-w-5xl`）+ 左右 `{spacing.gutter}`；编辑器用 `{spacing.containerWide}`（`max-w-6xl`），左右并排放「稿」和「校样」。
- 节奏只有三种：**节与节 `{spacing.section}`**、**卡内 `{spacing.cardPad}`（密集卡 `{spacing.cardPadDense}`）**、**行内 `{spacing.rowPad}`**。
- 分组清单用细线划分条目。宽屏对齐日期、缩略图与正文列，窄屏把日期提到正文上方，给长名称和描述留出空间。
- 缩略图一律 `{components.thumbnail.aspectRatio}`（1200×630，GitHub Social preview 尺寸）。代表作卡用 `object-contain`（图里有字，不能裁），开源节卡用 `object-cover`。

## Elevation & Depth

不用阴影分层。**层级靠描边和留白**：`.card` 1px `{colors.line}` 描边，hover 时描边向墨色加深并浮起 `{elevation.card-hover}` 一层极淡阴影。这是全站唯一的阴影，不要再加第二个。

## Shapes

`{rounded.chip}` 给标签、`{rounded.control}` 给按钮/输入框/图标按钮、`{rounded.card}` 给卡片和头像。没有更圆的东西——不使用 `rounded-full`（除语言色点）。

## Components

主页侧是 `.astro` 组件 + `global.css` 里的语义类（`.card` `.btn` `.btn-primary` `.icon-btn` `.chip` `.eyebrow` `.mono` `.link-quiet` `.stat-num` `.thumb`）；编辑器侧的表单原语集中在 `src/edit/inputs.tsx`（`Group` `Text` `Area` `Check` `Select` `RowControls`）。

新增界面元素时：

- 先在 `global.css` 找有没有对应语义类；没有就补语义类，不要在页面里拼 Tailwind 原子类。
- 编辑器控件必须走 `inputs.tsx` 的 `FIELD` 常量，不要各自写边框/圆角。
- 状态齐全：default / hover / focus-visible / active / disabled / loading / empty / error。主页组件的 hover 是描边加深，编辑器的 error 是 `{components.callout-error}`。

## Interactive 尺寸底线

移动端可点区域 **≥ 24×24 CSS px**（WCAG 2.5.8）。文字型链接（`源码 ↗`、语言切换）必须靠 `py-*` 撑够高度，不能只靠 12px 行高。

## Do's and Don'ts

Do:

- 颜色只写 `var(--color-*)` 或 Tailwind 的 `text-(--color-ink-2)` 形式。
- 新的「数据」呈现走 `.mono` + `tabular-nums`。
- 保持零 JS：主页任何交互先想能不能用 `<details>`、`:target`、CSS `:has()` 解决。
- 用户在 YAML 里手写的 HTML（页脚链接）拿不到类名，靠 `global.css` 的 `footer a` 兜底给出可点线索；新增这类「作者手写区」时照此办理。
- 明暗两版、五套主题都要过 AA（正文 ≥ 4.5:1）。

Don't:

- 不在版式代码里写 hex / `rgb()` / `rgba()`。例外见「已知例外」。
- 不给朱砂铺大面积底色，不用朱砂画正文文字。
- 不加第二个阴影、不加渐变、不加毛玻璃（编辑器吸顶栏的 `backdrop-blur` 是唯一一处）。
- 不用 Tailwind 任意值（`-[...]`）表达设计决策；先做成令牌或语义类。
- 不给标题设 `line-height: 1`。

## 已知例外

以下是刻意保留的非令牌色，新增扫描器噪音时应识别为例外：

1. `src/components/OpenSourceSection.astro` 的 `LANG_COLOR`：GitHub linguist 的官方语言色，属于**外部数据**，不是本系统设计。只出现在 10px 圆点上。
2. `src/layouts/Page.astro` / `src/pages/404.astro` 的 `style="--color-accent:…"`：用户在 YAML 里自定义强调色时的**令牌注入点**，是单一来源机制的一部分。
3. `src/edit/inputs.tsx` 复选框的 `accent-color: var(--color-ink)`：原生控件着色，值本身仍是令牌。
4. `src/edit/ui.ts` 文案里的 `#c8402e`：字段占位提示文本，不是样式。
5. `src/edit/EditApp.tsx` 的 `sm:grid-cols-[1fr_2fr]`：链接行「标签窄 / 地址宽」的比例，Tailwind 刻度里没有 1:2 轨道，用任意值表达比拆成 `col-span` 更直白。

## Responsive Behavior

- 断点用 Tailwind 默认：`sm` 640 / `md` 768 / `lg` 1024。
- 简介与统计随可用宽度并排或换行，统计用网格自动分列。
- 开源网格：`1 → sm:2 → lg:3` 列。代表作走同一套台阶，两处一起改以保持观感一致；但**末行补齐那条耦合只跟开源网格有关**——`lg:grid-cols-3` 与 `scripts/helpers.mjs` 的 `DEFAULT_ALIGN_STEP` 是一对（见 `OpenSourceSection.astro` 的 ⚠ 注释），代表作不参与补齐、列数可以自由。代表作别用 `md:grid-cols-3`：768px 就跳 3 列会把 1200×630 的缩略图压到 ~230px 宽。
- 编辑器：`md-` 单列，「校样」收成按钮展开；`md+` 两栏并排，校样 `sticky`。
- 390px 下主页不允许出现横向滚动。

## Known gaps

- `needs-design-decision`：`<meta name="theme-color">` 目前是写死的默认纸白，暗色外观下移动浏览器色带不跟随。彻底修法是把五套主题的色板抽成一份 JS 单一来源、CSS 变量由它生成，属于重构，未在本轮做。
- `needs-design-decision`：开源节里回退到 GitHub 自动卡片图时，图内已含仓库名与描述，与卡片下方的标题/描述重复。构建时已优先用仓库自定义 Social preview（`fetch-github.mjs` 的 `resolveThumbUrl` + GraphQL 批量确认），重复只发生在**作者没设自定义图**的长尾仓库上；要么说服他们去 GitHub Settings 上传一张，要么裁掉自动卡片的文字区——后者要处理不同语言的文字位置，没做。
- `info`：开源节排序里的「最近更新」取默认分支上最后一条**非 bot** 提交（`github.json` 的 `humanUpdated`），不是 `pushed_at`——后者被 CI、删分支、发 release 顶到今天，会让自动化替作者领活跃度。取不到时回落 `pushed_at`，行为与加这项之前一致。这条只影响条目顺序，不影响版式。
- `info`：`/edit` 用 `client:only="preact"`，首屏 HTML 为空，已用 `<noscript>` 兜底说明；不做 SSR 是因为编辑器表单依赖浏览器态。
- `needs-design-decision`：`/edit` 导入 YAML 失败时走浏览器原生 `alert()`（`EditApp` 的 `load()`），而表单内的校验失败走校样上方的 `{components.callout-error}`——两条错误通道的呈现方式不一致。`alert()` 会打断流程、样式不受主题控制，也没法把「大概第几行出错」一起讲清；改成和校验同一条通道需要先决定在表单哪一处落位。
