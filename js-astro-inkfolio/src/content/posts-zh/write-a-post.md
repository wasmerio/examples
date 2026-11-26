---
title: 写一篇稿子，需要的话写两种语言
description: 文章文件、frontmatter 字段、草稿，以及双语怎么配对。
date: 2026-11-13
cover: /og/posts/zh/write-a-post.png
coverAlt: 写一篇稿子，需要的话写两种语言
tags: [写作]
categories: ['写作']
lang: zh
---

文章是 `src/content/posts/` 里的 Markdown 文件。新建 `my-post.md`，它就变成 `/posts/my-post/`。文件名就是 URL，以后改名等于改 URL，所以一开始就把 slug 想好。

## Frontmatter

```yaml
---
title: 一篇讲某事的文章
description: 一句话，会出现在列表和搜索结果里。
date: 2026-11-13
tags: [随笔]
draft: false
---
```

- `title` 和 `date` 必填；`description` 强烈建议写，它是 meta 描述，也是列表页标题下面那句。
- `tags` 会显示在文章上，但不会生成标签归档页。
- `draft: true` 时文件留在仓库里，但不进列表、不进 RSS、不进 sitemap。
- `updated` 可选，会在发布日期旁边多印一个更新时间。

## 中文版

在 `src/content/posts-zh/` 里建**同名**文件。两个页面就会互相链接，并输出正确的 `hreflang`。某篇没有中文版也不会坏——那篇文章上的语言切换按钮直接不出现，比把人送到 404 好。

不必每篇都翻。常见做法：短笔记只用一种语言，长文两版都写。

## 图片

图片放 `public/`，在 Markdown 里从根目录引：

```markdown
![说明文字](/images/photo.jpg)
```

正文样式会自动加边框和圆角。文件尽量小——这个主题不含图片处理管线，这是故意的。

## 代码块

用围栏代码块（三个反引号），有样式，超宽可横向滚动。缩进式代码块不支持。
