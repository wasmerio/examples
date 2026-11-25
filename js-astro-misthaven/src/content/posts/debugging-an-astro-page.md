---
title: "示例文章：调试一个不再更新的 Astro 页面"
description: "从数据来源、渲染时机和浏览器状态三个方向，记录一次页面内容没有更新的排查过程。"
publishedAt: 2026-08-09
updatedAt: 2026-08-11
category: "技术"
tags: ["Astro", "调试", "前端"]
draft: false
---

页面没有报错，却一直显示旧内容，是前端调试中很容易让人困惑的一类问题。它可能来自构建缓存、数据筛选、客户端状态，也可能只是浏览器还没有加载到真正的页面。

这篇文章用一个简化的 Astro 页面作为例子，记录我会如何缩小问题范围。

## 先确认问题发生在哪一层

不要一开始就修改组件。先把问题分成三层：

1. **数据层**：源文件或接口返回的内容是否已经变化？
2. **渲染层**：服务器生成的 HTML 是否包含新内容？
3. **交互层**：页面加载后，浏览器脚本是否把内容改回旧状态？

如果直接查看生成的 HTML 就能看到新标题，问题通常位于客户端；如果 HTML 也是旧的，就应该回到数据读取和构建流程。

> [!NOTE]
> 每次只改变一个变量，并记录观察结果。调试记录越接近事实，最后越容易复用。

## 检查集合查询

假设页面通过内容集合读取文章，可以先确认查询是否意外过滤了目标文章：

```ts title="src/utils/posts.ts"
import { getCollection } from "astro:content";

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  return posts
    .filter(({ data }) => data.publishedAt <= new Date())
    .sort((left, right) => right.data.publishedAt.getTime() - left.data.publishedAt.getTime());
}

export function findPostBySlug(posts: Awaited<ReturnType<typeof getPublishedPosts>>, slug: string) {
  return posts.find((post) => post.id === slug);
}
```

这里有两个值得注意的边界：草稿是否应该在当前环境中出现，以及日期比较是否使用了同一个时区。它们都可能让“明明存在的文章”看起来像是消失了。

## 对比构建前后的结果

本地开发服务器和生产构建的行为并不完全相同。可以按顺序执行：

```bash title="检查内容是否进入生产构建"
npm run check
npm run build
rg "文章标题" dist
```

如果 `dist` 中没有目标文本，说明问题已经发生在构建阶段；如果 `dist` 中存在文本，而浏览器没有显示，则继续检查路由、缓存和客户端脚本。

> [!WARNING]
> 不要只依赖浏览器强制刷新来判断缓存问题。先查看生成文件和响应头，才能知道旧内容究竟来自哪里。

## 检查客户端更新

当页面包含搜索、排序或评论等客户端功能时，初始 HTML 可能是正确的，但脚本加载后又根据旧数据重绘了列表。此时可以暂时禁用脚本，或者在关键节点打印数据：

```ts title="调试客户端数据"
const response = await fetch("/search-index.json");
const entries = await response.json();

console.table(
  entries.map((entry: { title: string; publishedLabel: string }) => ({
    title: entry.title,
    publishedAt: entry.publishedLabel,
  })),
);
```

如果搜索索引仍然是旧内容，应当检查生成索引的接口和构建缓存，而不是继续调整搜索组件的样式。

## 最后的排查清单

- [ ] 源文件内容与 frontmatter 是否正确。
- [ ] 内容集合是否把文章过滤掉。
- [ ] 路由参数是否与文件名一致。
- [ ] 生产构建是否生成了新 HTML。
- [ ] 客户端请求是否拿到了新数据。
- [ ] 浏览器或代理是否缓存了旧响应。

> [!CAUTION]
> 调试完成后要删除临时日志，尤其是可能包含用户数据、请求参数或内部路径的输出。

这类问题通常不是某一行代码单独造成的，而是数据、构建和浏览器之间的边界没有被看见。把边界逐个照亮，答案往往会比想象中更简单。
