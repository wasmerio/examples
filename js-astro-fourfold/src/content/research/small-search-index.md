---
title: "搜索索引可以先做得很小"
description: "一篇预印本式笔记：先匹配标题、摘要、正文和标签，等文章变多再换引擎。"
locale: zh-cn
translationKey: research-small-search-index
publishedAt: 2026-05-06
kind: preprint
version: "0.3"
tags: [搜索, 架构]
paperUrl: https://docs.astro.build/en/guides/content-collections/
codeUrl: https://github.com/Liyuk/astro-fourfold
draft: false
---

当前搜索不是一个服务。构建期把已发布文章导出成 `/search-index.json`，页面再用查询词在浏览器里过滤，并把查询同步到 `?q=`。

## 这个版本故意不做的事

- 不按相关度打分
- 不支持分词器或同义词
- 不在服务端记录查询

文章到了数百篇，这些省略会变成问题。到那时换 Pagefind 或 MiniSearch，frontmatter 不用改。

## 关于示例链接

「论文」指向 Astro 内容集合的公开文档，「代码」指向本仓库。两者都是占位，用来让 `paperUrl` 和 `codeUrl` 在页面上可见、可点击。发表自己的笔记时换成真实地址。版本号 `0.3` 表示这还不是定稿。
