---
title: "示例文章：使用 Markdown 写作"
description: "展示标题、引用、列表、代码块和提示框等常用 Markdown 元素。"
publishedAt: 2999-12-30
updatedAt: 2999-12-30
category: "示例"
tags: ["Markdown", "写作", "排版"]
draft: false
---

> 这是一篇随主题提供的示例文章，内容仅用于展示排版效果。

Markdown 让作者把注意力留给内容本身。只需少量标记，就能组织标题、列表、链接与代码；而主题负责把这些内容整理成适合阅读的页面。

## 文本与引用

正文可以包含 **加粗文字**、_强调文字_、~~删除线~~、行内代码 `npm run build`，以及指向 [Astro 文档](https://docs.astro.build) 的链接。

链接可以自然地放在句子里，也可以单独列出。建议让链接文字说明目标，而不是只写“点击这里”。

> 好的排版不会抢走注意力，而是让阅读自然地继续下去。

## 列表

1. 先确定文章想回答的问题。
2. 写出关键结论和内容结构。
3. 补充例子，最后统一校对。

任务清单适合记录发布前的准备工作：

- [x] 填写标题和描述
- [x] 检查文章链接
- [ ] 选择一张合适的封面
- [ ] 在移动端阅读一遍

无序列表也可以嵌套，用来表达层级关系：

- 写作
  - 收集材料
  - 整理提纲
- 发布
  - 本地预览
  - 检查构建结果

## 表格

表格适合呈现结构化信息，但不适合承载很长的段落。下面是一份简单的 Markdown 语法速查表：

| 想表达的内容 | Markdown 写法                 | 适合的场景     |
| ------------ | ----------------------------- | -------------- |
| 二级标题     | `## 标题`                     | 划分主要章节   |
| 链接         | `[文字](https://example.com)` | 引用外部资料   |
| 代码块       | 三个反引号包裹                | 展示命令或代码 |
| 引用         | `> 引用内容`                  | 突出原话或结论 |

## 提示框

主题支持五种提示框，可以把重要信息从正文中轻轻托出来：

> [!NOTE]
> 提示框适合放背景说明、定义或读者可能需要知道的上下文。

> [!TIP] 先写结论
>
> 当文章较长时，可以在章节开头先给出一句结论，再解释原因和过程。

> [!IMPORTANT]
> 提示框不是越多越好。只有真正需要被注意的内容才值得单独显示。

> [!WARNING]
> 发布前请确认代码示例中的路径、命令和版本信息仍然有效。

> [!CAUTION]
> 不要把整篇文章都写成提示框，否则读者会失去正文与重点之间的层次感。

## 代码块

代码块可以添加文件名，较长的代码会自动折叠。下面的示例模拟一个简单的文章筛选函数：

```ts title="src/utils/filterPosts.ts"
interface Post {
  title: string;
  category: string;
  tags: string[];
  draft: boolean;
}

export function filterPosts(posts: Post[], keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) return posts.filter((post) => !post.draft);

  return posts.filter((post) => {
    const searchableText = [post.title, post.category, ...post.tags].join(" ").toLowerCase();
    return !post.draft && searchableText.includes(normalizedKeyword);
  });
}
```

命令行代码也可以单独展示：

```bash title="开始检查文章"
npm install
npm run format
npm run check
npm run build
```

## 交互内容

如果某一段内容不希望直接出现在阅读路径中，可以使用 spoiler。点击下面的文字后，它才会显示：:spoiler[这是一个只用于演示交互效果的隐藏段落。]

> [!TIP]
> 将尚未完成的文章设置为 `draft: true`，生产构建时就不会发布它；开发环境仍然可以用来预览草稿。

Markdown 的价值不在于记住所有语法，而在于用最小的标记把内容结构表达清楚。遇到不确定的写法时，可以先保持简单，再根据实际阅读效果逐步补充。
