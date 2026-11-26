---
title: Markdown 扩展功能示例
published: 2024-05-01
updated: 2024-11-29
description: "在 Astro-Argon 中体验更多 Markdown 扩展能力"
image: ''
tags: [示例, Markdown, Astro]
category: "示例"
draft: false 
---

## GitHub 仓库卡片
可以插入一个动态仓库卡片。页面加载时会请求 GitHub API 并展示仓库信息。

::github{repo="Fabrizz/MMM-OnSpotify"}

使用方式：

```markdown
::github{repo="zsancc/astro-argon"}
```

## 提示块（Admonitions）

支持类型：`note` `tip` `important` `warning` `caution`

:::note
用于强调阅读时容易忽略但仍然重要的信息。
:::

:::tip
用于补充技巧或建议。
:::

:::important
用于必须关注的关键说明。
:::

:::warning
用于存在风险、需要立即注意的内容。
:::

:::caution
用于提醒可能出现的负面后果。
:::

### 基础语法

```markdown
:::note
这里是一段提示内容
:::

:::tip
这里是一段技巧内容
:::
```

### 自定义标题

可以给提示块自定义标题。

:::note[MY CUSTOM TITLE]
这是一个带自定义标题的提示块。
:::

```markdown
:::note[MY CUSTOM TITLE]
这是一个带自定义标题的提示块。
:::
```

### GitHub 风格语法

> [!TIP]
> 也支持 [GitHub 提示语法](https://github.com/orgs/community/discussions/16925)。

```
> [!NOTE]
> 这是 NOTE 样式。

> [!TIP]
> 这是 TIP 样式。
```

### Spoiler 语法

你可以在段落中插入 Spoiler，并支持 **Markdown**。

例如：这段内容 :spoiler[默认被折叠 **点击可见**]。

```markdown
这段内容 :spoiler[默认被折叠 **点击可见**]。
```
