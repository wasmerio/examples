---
title: "轻松撰写内容"
date: 2026-01-26
description: "如何使用 Markdown 与 frontmatter 在本中心撰写文章或文档页。"
tags: ["guide", "markdown"]
---

# 轻松撰写内容

一个页面就是一个带少量 frontmatter 的 Markdown 文件。

```md
---
title: "我的页面"
date: 2026-01-26
description: "一句话摘要。"
tags: ["guide"]
---

# 我的页面

在此撰写内容。
```

文章位于 `src/content/posts/<locale>/`,文档位于
`src/content/docs/<product>/<locale>/`。构建过程会校验 frontmatter 并为你重写相对
链接,因此你可以在源码中保留对 GitHub 友好的路径。
