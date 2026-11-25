---
title: Frontmatter 使用指南：写好每篇文章的元信息
description: 介绍 LogFlow Theme 中 Frontmatter 的必填字段、可选字段、常见写法与排错方式。
pubDate: 2026-03-14
collection: LogFlow Theme
collectionDescription: LogFlow Theme 主题设计、实现与迭代实践
tags:
  - Astro
  - Frontmatter
  - Content
---

Frontmatter 是每篇 Markdown / MDX 文章顶部的 YAML 配置块，用来描述文章元信息。  
在 LogFlow Theme 中，文章集合由 `src/content.config.ts` 校验：必填字段必须存在且类型正确；主题只会读取下文列出的字段。

## 最小可用示例

```yaml
---
title: 我的第一篇文章
description: 这是一篇用于演示 Frontmatter 的示例文章。
pubDate: 2026-03-14
---
```

这三个字段是必填项：

- `title`：文章标题（字符串）
- `description`：文章摘要（字符串）
- `pubDate`：发布日期（可被解析为日期）

## 完整示例

```yaml
---
title: Frontmatter 使用实践
description: 包含必填与可选字段的完整示例。
pubDate: 2026-03-14
updatedDate: 2026-03-15
collection: LogFlow Theme
collectionDescription: LogFlow Theme 主题设计、实现与迭代实践
tags:
  - Astro
  - Frontmatter
heroImage: ./cover.png
---
```

## 字段逐项说明

### title

- 类型：`string`
- 作用：显示在文章页标题、列表页标题和 RSS 输出中，并用于 HTML 标题、Open Graph 与 Twitter 标题元信息。
- 建议：控制长度，确保在列表页可读性。

### description

- 类型：`string`
- 作用：文章摘要，显示在文章页和文章列表中，并用于标准 SEO、Open Graph 与 Twitter 描述元信息，以及 RSS 输出。
- 建议：一句话说清文章主题。

### pubDate

- 类型：`date`（由字符串自动转换）
- 作用：文章排序、时间展示与归档统计。
- 建议：统一使用 `YYYY-MM-DD` 格式。

### updatedDate

- 类型：`date`（可选）
- 作用：在文章页显示“最后更新时间”。
- 建议：仅在内容发生实质更新时填写。

### collection

- 类型：`string`（可选）
- 作用：将文章归入某个专题，展示在专题页面。
- 建议：同一主题文章使用相同名称。

### collectionDescription

- 类型：`string`（可选）
- 作用：专题说明文字，显示在专题列表中；专题详情页也用它作为页面说明和 SEO 描述。
- 建议：同一专题保持一致文案。详情页会采用按发布日期倒序后第一篇带有该字段的文章；专题列表会保留读取到的首个非空说明。

同一 `collection` 的说明不一致时，专题详情页会显示最新一篇带有非空 `collectionDescription` 的文章内容；专题列表则使用内容集合读取顺序中的首个非空说明，因此两处可能不同。若该专题的所有文章均未填写此字段，专题详情页会回退到专题页的默认说明，专题列表不显示说明。为避免不一致，请在同一专题的所有文章中使用相同文案。

### tags

- 类型：`string[]`（可选）
- 作用：生成标签汇总页与对应的标签详情页；详情页列出带有该标签的文章。
- 建议：每篇 2~5 个标签，避免过碎。

### heroImage

- 类型：本地图片的相对路径（可选；构建后解析为 `ImageMetadata`）
- 作用：文章页头图，并输出到 Open Graph/Twitter 元信息。
- 建议：使用项目可处理的本地图片资源，并保持合适的横向比例。

### enableComments

- 类型：`boolean`（可选）
- 作用：单独控制当前文章是否显示评论区。
- 默认：未设置时默认开启评论。
- 建议：仅在需要关闭某篇文章的评论时设为 `false`。全局评论还需 `COMMENTS.enabled` 为 `true` 才生效。

## 常见错误与排查

- 日期解析错误
  - 检查 `pubDate` / `updatedDate` 是否为有效日期字符串。
- 字段名拼写错误
  - 必填的 `pubDate` 写成 `publishDate` 会因缺少 `pubDate` 而校验失败；未在 schema 中定义的额外字段不会被主题使用。
- 类型错误
  - `tags` 必须是数组，不是单个字符串。

## MDX 和 Markdown 一致吗？

一致。`src/content/blog/` 下的 `.md` 与 `.mdx` 都使用同一套 Frontmatter 校验规则。

## 推荐写作模板

复制下面模板可快速开写：

```yaml
---
title: 
description: 
pubDate: 
updatedDate: 
collection: 
collectionDescription: 
tags:
  - 
heroImage: ./cover.png
enableComments: true
---
```
