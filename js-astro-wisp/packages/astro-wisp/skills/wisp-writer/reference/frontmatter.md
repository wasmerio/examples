# frontmatter 字段

权威来源是 `src/content.config.ts` 中的 `posts` schema。字段以 YAML 写在文件开头的 `---` 之间。

| 字段          | 必填 | 类型     | 约束与说明                                                                            |
| ------------- | ---- | -------- | ------------------------------------------------------------------------------------- |
| `title`       | 是   | string   | 最多 80 个字符。含冒号、`#` 等特殊字符时加双引号                                      |
| `description` | 是   | string   | 最多 200 个字符。显示在列表页、RSS 和搜索结果中，写清文章解决什么问题，不要只重复标题 |
| `pubDate`     | 是   | 日期     | `YYYY-MM-DD`，如 `2026-03-18`                                                         |
| `updatedDate` | 否   | 日期     | 实质性修改后更新；不早于 `pubDate`                                                    |
| `tags`        | 否   | string[] | 默认 `[]`。如 `[LLM, Transformer]`                                                    |
| `category`    | 否   | string   | 一篇文章只有一个分类                                                                  |
| `draft`       | 否   | boolean  | 默认 `false`；`true` 时生产构建不包含                                                 |
| `featured`    | 否   | boolean  | 默认 `false`；`true` 时出现在首页精选区。不要擅自设置                                 |
| `cover`       | 否   | 图片路径 | 相对路径，经 Astro 图片优化                                                           |
| `lang`        | 否   | string   | 覆盖站点语言，英文文章写 `en`                                                         |
| `toc`         | 否   | boolean  | 默认 `true`；很短的文章可以设为 `false`                                               |

字符数按 UTF-16 码元计，与 zod 的 `.max()` 一致；check_post.py 用同样的算法。

## 写法示例

```yaml
---
title: '自注意力机制讲解'
description: '从直觉到公式，逐步讲清楚 Transformer 中自注意力的计算过程，并附上 PyTorch 实现。'
pubDate: 2026-03-18
tags: [LLM, Transformer, 注意力]
category: 机器学习
---
```

## 标签与分类的命名约定

1. **先复用，再新建。** 写之前看现有标签（`new_post.py` 创建时会列出，或 `check_post.py --all` 之后看相近提示）。能用已有标签就用。
2. **大小写一致。** 缩写全大写（`LLM`、`GPU`、`CUDA`），专有名词按官方写法（`TypeScript`、`PyTorch`、`Rust`），不要同时出现 `llm` 和 `LLM`。
3. **中文标签可以用**（`线性代数`、`注意力`），URL 会保留中文。同一概念中英文只选一个，不要 `GPU` 和 `显卡` 并存。
4. **单数、简短、名词。** 用 `算法` 而不是 `算法讲解文章`；用 `Transformer` 而不是 `Transformer 模型详解`。
5. **每篇 2 到 4 个标签。** 标签用于跨文章聚合，只出现一次的标签价值很低。
6. **分类是粗粒度的**（机器学习、算法、编程语言、设计、随笔），全站保持在个位数。分类不确定时询问用户，不要随手新建。
7. 需要改写 URL 段时用 `astro.config.ts` 中 `wisp({ taxonomy: { slugMap } })`，不要改标签本身。
8. 未使用的字段不要写，尤其不要写空值或默认值（`draft: false`、`tags: []`）。

## 常见错误

- `pubDate: 2026/03/18` 或 `18-03-2026`：只接受 `YYYY-MM-DD`。
- `description` 超过 200 字：构建失败。
- `tags: LLM, Transformer`（缺方括号）：会被解析为字符串，类型错误。
- 拼错字段名（`tag`、`pubdate`）：check_post.py 会报 `fm-unknown-key`。
