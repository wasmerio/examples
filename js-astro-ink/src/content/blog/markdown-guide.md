---
language: 'zh-CN'
title: 'Markdown 语法速查'
description: '一页对照常用写法与实际效果：站内链接、图片、带标题的代码块、可展开的长代码、Mermaid 流程图和数学公式。'
publishDate: 2026-08-16
updatedDate: 2026-11-20
tags: [Markdown, 写作]
---

这篇文章本身就是一份排版样张。写技术笔记时，可以照着下面的例子插入图片、解释一段代码，或者画出几个步骤之间的关系。

## 文本与链接

`**加粗**` 适合点出**结论**，`*serif*` 可以标记外文术语 _serif_，文件名和命令则用反引号包起来，例如 `pnpm dev`。

文章标题来自开头的 `title` 字段，正文从 `##` 二级标题开始写。二到四级标题会出现在文章目录里。链接到别的文章时，从 `/blog/` 开始写；跳到本篇某节时，只写锚点就够了。

```markdown
[主题定制](/blog/customize)
[本篇的流程图](#流程图)
```

试一下：[主题定制](/blog/customize) · [本篇的流程图](#流程图)

## 引用与列表

段首写一个 `>` 就能得到引用块。引用别人的话时，可以另起一行写出处。下面用一段观察记录作示例：

> 下午四点，白云刚好移到窗前那根树枝后面。我等风停了一下，才按下快门。

有先后顺序的操作用编号，例如：

1. 挑出这次要写的照片。
2. 给照片写一句描述。
3. 打开预览，读一遍图注。

## 图片

如果插图已经放在 `src/assets/`，可以在 Markdown 里用相对于**文章源文件**的路径引用它。下面这行适用于当前文件 `src/content/blog/markdown-guide.md`。方括号里写画面的内容，可以帮助读者理解图片。

```markdown
![一枝绿叶横过蓝天，枝条后方是一团白云。](../../assets/cover-demo.png)
```

![一枝绿叶横过蓝天，枝条后方是一团白云。](../../assets/cover-demo.png)

点图可以放大，按 Esc 返回正文。如果给图片加了链接，点击会前往你设置的地址。

## 代码块

在三枚反引号后写上 `ts title="reading.ts"`，代码框就会显示文件名。要让读者一眼找到计算结果的那一行，在行末加上注释 `// [!code highlight]`。渲染后可以看到高亮效果：

```ts title="reading.ts"
const wordsPerMinute = 350
const minutes = Math.ceil(700 / wordsPerMinute) // [!code highlight]
```

需要展示修改前后时，可以用 `[!code --]` 标出删去的行，用 `[!code ++]` 标出新增的行。

## 流程图

把代码围栏的语言写成 `mermaid`，就能把文本步骤画成图。下面是这张图的完整源文：

```text
flowchart LR
  A[写文章] --> B[预览] --> C[发布]
```

```mermaid
flowchart LR
  A[写文章] --> B[预览] --> C[发布]
```

## 数学公式

一句话里的公式用一对 `$` 包起来。例如 `$t = n / v$` 会排成 $t = n / v$，其中 $n$ 是字数，$v$ 是每分钟阅读的字数。要让公式单独占一行，把 `$$` 各放在公式的上一行和下一行：

$$
t = \frac{700}{350} = 2
$$

## 表格

表格适合横向比较。第二行的冒号决定该列的对齐方式，例如 `---:` 表示右对齐。

| 稿件 | 字数 | 按每分钟 350 字估算 |
| ---- | ---: | ------------------: |
| 随笔 |  700 |              2 分钟 |
| 教程 | 2100 |              6 分钟 |

## 长代码块折叠

超过 15 行的代码默认折叠。可以用下面的例子试试展开和复制：它从两篇笔记的标签里统计每个标签出现了几次。

```js title="count-tags.js"
const notes = [
  { title: '窗边的云', tags: ['摄影', '随笔'] },
  { title: '整理相册', tags: ['摄影', '工具'] }
]

function countTags(notes) {
  const counts = new Map()
  for (const note of notes) {
    for (const tag of note.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return counts
}

const counts = countTags(notes)
console.log(counts.get('摄影')) // 2
```
