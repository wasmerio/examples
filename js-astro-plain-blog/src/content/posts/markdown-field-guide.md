---
title: "Markdown 排版实验手记"
date: "2025-06-14"
---

## 写在前面

这是一篇为 PlainBlog 编写的演示文章，并非作者的真实工作记录。排版首先要让文字能读，然后才轮到各种边界条件。**重点**和*轻声提醒*都应该留在同一条阅读线上；行内的 `const value = 1` 不需要另起一行。

### 一份小清单

- 留下可追溯的标题
  - 再补上发布日期
- 检查正文的链接与图片

1. 从最小示例开始
2. 在窄屏重新阅读

- [x] 检查有序和无序列表
- [ ] 记录下一次修改

> 如果每一段都在争夺注意力，读者就没有地方停下来。

### 链接、图片与宽内容

可以阅读 [Markdown Guide](https://www.markdownguide.org/basic-syntax/)，也可以测试一条很长的链接：<https://example.org/notes/this-is-a-deliberately-long-path-for-testing-how-links-wrap-on-very-narrow-devices/without-breaking-the-whole-page>。图片放在 `src/assets/posts/文章文件名/`，用可读文件名，不堆在资源根目录，也不请求远程图床。

![侧卧的黑发人物插画，前景有一只伸出的手](../../assets/posts/markdown-field-guide/sample-portrait.jpg)

![三条不同长度的横线组成的示意图](../../assets/posts/markdown-field-guide/reading-lines.svg)

```js
const observations = ["small screens", "keyboard navigation", "static output"];
const explain = (topic) =>
  `A long line for horizontal scrolling: ${topic} — ${observations.join(" / ")} — ${observations.join(" / ")}`;
console.log(explain("readable layouts without a viewport-wide scrollbar"));
```

| 测试区域 |      关注点      |             在狭窄窗口的预期行为 |
| :------- | :--------------: | -------------------------------: |
| 正文     |   长链接会换行   |               页面不会被单词撑宽 |
| 代码     |  保留缩进和高亮  | 只在代码块内滚动，不改变页面宽度 |
| 表格     | 列不会被强制挤坏 |         表格自己的区域可横向滚动 |

旧的~~一次性截图~~并不能代替重新构建与阅读。

---

#### 收尾

文字并不需要复杂的运行时：一份源文件、一份样式、可直接打开的静态页面，已经足够开始。
