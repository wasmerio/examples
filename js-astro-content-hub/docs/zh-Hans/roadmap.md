---
title: "优化路线图"
description: "分阶段计划,弥合当前模板与其愿景之间的差距:组织前门、更强的默认产品落地页,以及定位。"
order: 5
---

> 本页是**计划**,跟踪实现进度。每个阶段都是可独立完成、可审阅、可单独
> 上线的自包含块。阶段旁的 ✓ 表示已合并。

## 为什么会有这份路线图

[愿景](./vision.md)描述了一个**组织与产品门户**:组织前门、每个产品一个
品牌落地页、聚合文档,全部免费且可升级。模板已经具备其中大部分机制 ——
但有两个缺口让它**看起来**还不像那个愿景:

1. **没有组织介绍。** 落地页是 hero + 产品网格 + 最新文章。组织自身的故事
   (使命、团队、链接)缺失了,而这正是组织站点访客最先期待的。
2. **默认产品落地页太单薄。** 只有文档的产品得到一个极简页面,读起来像
   文档索引,而不是产品页。愿景承诺"写文档,得好看的页面" —— 今天只有在
   产品同时提供 `product-info` 文件(或自定义落地页)时才成立。

## 阶段 1 — 组织前门(价值最高、改动面最小)✅ 已完成

**目标:** 落地页介绍的是*组织*,而不只是产品。

**状态:** 已合并。实现为:

- `src/config/copy.ts` 新增 `org` 块(`eyebrow`、`title`、`mission`、
  `linksLabel`、`links`),与其他文案表一样按语言。
- 两个落地页(`src/pages/index.astro` 及其 `[locale]/` 孪生)在 hero 与
  最新文章之间渲染 **#mission** section:eyebrow、标题、使命导语、
  居中的链接行。
- 文案从 `src/lib/i18n.ts` re-export(唯一的文案导入面),因此没有页面
  需要直接导入 `config/copy`。
- 样式复用现有 `.section-header`/`.eyebrow`/`.btn` 原语;仅向
  `global.css` 添加了 `.mission-lead` 与 `.mission-links`。

全部位于 "Your site" 层(`copy.ts` + 落地页 + 一个样式块) —— 无
Machinery 改动。

### 验收

- ✓ 落地页展示来自 `copy.ts` 的、按语言本地化的组织使命与链接(两个
  语言都按 hero → mission → posts 的顺序渲染 mission section)。
- ✓ 修改 `copy.ts` 中的 `org` 块即可更新落地页,无需触碰组件。

### 任务(最初范围)

- 在 `src/config/copy.ts` 中新增 `org` 块:
  `name`、`tagline`、`mission`、`cta`(label + href)、`links`(GitHub、
  联系方式等)。按语言,遵循现有 `Record<Locale, …>` 模式。
- 在 `src/pages/index.astro` 中新增**"关于组织" section**(位于 hero 与
  最新文章之间):使命文字 + 一行链接。
- 在 `ProductLandingDefault.astro` 中加 `mission`/`org` section?**不** ——
  组织文案只属于组织落地页。产品落地页保持产品导向。
- 一切都在 "Your site" 层:`copy.ts` + `index.astro` 都是实例文件。
  不需要改 Machinery。

## 阶段 2 — 更强的默认产品落地页 ✅ 已完成

**目标:** 只有**文档**的产品也能得到像样的产品页;提供 `product-info`
的产品得到更好的页面 —— 除写内容外零额外工作。

**状态:** 已合并。实现为:

- `ProductLandingDefault.astro` 的回退分支(无 `product-info`)现在直接从
  `Product` 注册表条目渲染真正的产品页:**hero**(名称 + 本地化
  `description` 导语 + 文档/仓库按钮)、**徽章**(highlight-badge 信任条)、
  **关于** section(description + 阅读文档/查看源码)、以及 CTA。只注册
  (且可选地提供文档)的产品现在也能得到像样的页面 —— 无需任何
  `product-info`,"写文档,得页面"的承诺成立。
- `product-info` 路径不变(仍是经由区块注册表的丰富落地页);回退升级
  纯粹是增量。
- `docs/en/authoring.md`(及 zh-Hans)现在记录三级解析:自定义覆盖 →
  `product-info` 结构化落地页 → 注册表回退,并在"添加一个新产品"下新增
  "product-info 文件"小节。

### 验收

- ✓ 只注册(文档可选)的产品渲染出的页面读起来是产品 —— hero 带描述
  导语、徽章、关于、CTA(已用临时无 `product-info` 产品验证;双语都渲染)。
- ✓ `product-info` 文件成为通往丰富页面的、有文档的路径(authoring.md
  现在解释了这条阶梯)。
- ✓ 对现有产品无破坏性变更(所有示例产品保持 `product-info` 驱动的落地页;
  构建保持 0 错误 / 0 警告)。

### 现状(改动前)

- 默认(`ProductLandingDefault.astro`):极简 hero + 文档链接 + 仓库链接。
  读起来像文档索引。
- 有 `product-info`:`landing-sections/*` 提供丰富落地页(tagline、
  features、install、highlights)。
- 有自定义覆盖:`src/components/product-landing/<slug>.astro`。

### 任务(最初范围)

- **升级默认落地页**(`ProductLandingDefault.astro`),利用 `Product`
  注册表已有的 `description`、`badges`、`logo`,渲染真正的产品卡 ——
  是什么、为什么用、快捷链接(文档、仓库、GitHub)。
- **把 `product-info` 从"扩展"提升为"推荐的默认"。** 在 `site.config.ts`
  中允许产品声明 `landing: 'default' | 'info' | 'custom'`(或只文档化
  升级路径)。保持 Machinery 不变;这是文档 + 示例内容的改动。
- **为每个示例产品添加 `product-info` 样例**,让采用者看到推荐模式,并
  更新 `docs/en/authoring.md` 说明:"有文档 → 好页面;加 product-info →
  更好页面。"

### 范围说明

- 最初的"把 product-info 提升为推荐默认"任务通过**在 authoring.md 中
  文档化阶梯**解决,而不是给 `Product` 接口加 `landing:` 字段 —— 保持
  Machinery 接口稳定(对采用者更少破坏性变更)。示例产品已全部携带
  `product-info` 文件,因此无需改动示例内容。

## 阶段 3 — 定位与文档 ✅ 已完成

**目标:** 仓库*清晰讲述*组织门户的故事,让对的人找到它。

**状态:** 已合并。实现为:

- **README** 从"内容中心模板"重构为"组织与产品门户":以组织前门 +
  每产品落地页 + 聚合文档开头,再把同步/PR 机制作为手段描述。
- 新增 **`docs/en/vision.md`**(及 zh-Hans)作为"为什么"(理念的家),
  并从 README 与两个文档索引链接它。
- `README.md` 与 `docs/en/index.md` 的文档表(附 zh-Hans 镜像)现在列出
  Vision 与这份路线图。
- 已在 GitHub 设置**仓库描述与 topics**(属仓库设置改动,非代码或文档):
  描述改用「组织与产品门户」定位,并附加 19 个便于发现的 topics ——
  `astro`、`astro-template`、`static-site-generator`、`docs-generator`、
  `documentation`、`documentation-site`、`markdown`、`typescript`、`i18n`、
  `github-pages`、`developer-portal`、`content-aggregation`、`ssg`、
  `jamstack`、`cloudflare-pages`、`knowledge-base`、`landing-page`、`blog`、
  `open-source`。`package.json` 的 `description`/`keywords` 已同步对齐,
  避免 npm 元数据漂移。

全部是文案/文档 —— 无 Machinery 改动。

### 任务

- **README** —— 从"内容中心模板"重构为"组织与产品门户":以组织前门 +
  每产品落地页 + 聚合文档开头,再把同步/PR 机制作为手段。
- **`docs/en/vision.md`** —— "为什么"(理念的家;从 README 和文档索引
  链接它)。
- **文档索引/表格** —— 在 `README.md` 和 `docs/en/index.md` 的文档表
  中加入 `Vision` 与这份路线图(附 zh-Hans 镜像)。
- **仓库描述与 topics** —— ✅ 已完成:描述与 topics 已更新为组织门户定位
  ("org & product portal"、"multi-project docs"、"landing pages"),并同步了
  `package.json` 的 keywords。

### 验收

- ✓ README 与文档以组织门户的价值主张开头。
- ✓ `vision.md` 和 `roadmap.md` 已从文档索引链接,双语。
- ✓ GitHub 仓库描述与 topics 与组织门户定位一致。

## 阶段 4(延后)— 版本化文档

**目标:** 每个产品支持 `v1.x`、`v2.x` 文档(如
[MultiDocumenter.jl](https://github.com/juliacomputing/multidocumenter.jl/) 与
[DocBuilder](https://github.com/inful/docbuilder) 所做),面向 SDK/API 型
产品。

延后是因为核心愿景(组织 + 产品落地页 + 文档聚合)并不需要它。若要做,
应遵循扩展模式:产品上的 `versions` 字段 + 文档布局中的版本切换器 ——
作为可选能力加入,而非破坏性变更。

## 每个阶段的验证

- `npm run validate:content` —— 0 错误(slug parity、index、
  product-info 检查)。
- `npm test` —— 全套通过。
- `npm run build` —— 0 错误,0 警告。
- 抽查 `dist/` 中受影响的路线。
- 若 `examples/` 或 `skills/` 有改动:`npm run check:examples`。

## 如何开始

阶段 1–3 已合并上线。剩下的唯一项是延后的阶段 4(版本化文档),核心愿景
并不需要它 —— 只有当 SDK/API 型产品需要时才做,并遵循上文描述的扩展
模式。
