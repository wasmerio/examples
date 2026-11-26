---
title: 写第一篇
order: 3
description: 一个 Markdown 文件就是一篇文章，文件名就是 URL。
---

在 `src/content/posts/` 里新建文件：

```bash
src/content/posts/my-first-post.md
```

它就会变成 `/posts/my-first-post/`。改名等于改 URL，所以一开始就把 slug 想好。

## Frontmatter

```yaml
---
title: 我的第一篇文章
description: 一句话，给列表页和搜索结果用。
date: 2026-11-16
tags: [随笔]
draft: false
---
```

`title` 和 `date` 必填，`description` 强烈建议写——它就是 meta 描述。`draft: true` 时文件留在仓库里，但不进任何列表、RSS 和 sitemap。

## 正文

普通 Markdown。围栏代码块有高亮，文档页还带复制按钮；图片用站点根路径：

```markdown
![说明文字](/images/photo.jpg)
```

> [!TIP]
> 图片放 `public/`。主题故意不做图片处理管线——提交前自己压好。

保存后开发服务器就能看到。草稿标记关掉、构建通过，它就上线了。

下一篇：把站点配置改对。
