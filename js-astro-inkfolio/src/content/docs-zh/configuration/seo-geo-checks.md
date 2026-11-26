---
title: SEO 与 GEO 自检
order: 6
description: "npm run seo 在构建后检查什么，以及为什么放进构建。"
---

`npm run build` 之后，主题会检查自己的产物。它不是排名工具，管的是那些会悄悄让页面丢掉元数据的结构性错误。

```bash
npm run seo          # 针对已有的 dist/
```

它遍历每一个构建出来的 HTML，报告：

- 缺 `<link rel="canonical">` 的页面
- 没有 JSON-LD，或 JSON-LD 解析失败的页面
- 只列一种语言的 `hreflang`（alternates 必须互指）
- 缺失 `llms.txt` 或 `sitemap.xml`
- 多页共用同一个 `<title>`

缺 canonical、JSON-LD 不可靠、hreflang 不互指会让检查失败；构建会打印报告后继续，不因为一处文案问题卡住发布。

`llms.txt` 在构建期从文章与文档集合生成，不会和实际发布内容脱节。里面的描述取自各条目的 frontmatter——描述为空只是条目变短，不会出错。
