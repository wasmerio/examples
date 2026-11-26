---
title: 标签外挂示例
date: 2024-06-04 10:00:00
updated: 2024-06-04 10:00:00
abbrlink: 4d5e6f70
tags: [指南, 标签外挂]
categories: [开始]
cover: /img/covers/default.svg
description: 提示块、Note、Tip、折叠、标签页、彩色文字、隐藏文字、气泡注释、复选框、网站卡片。
---

Butterfly 和 tag-plugins-plus 的标签外挂在这里用标准的 Markdown 语法表达：GitHub 风格的提示块，以及 [remark-directive](https://github.com/remarkjs/remark-directive) 指令。样式与原版一一对应。

## 提示块（GitHub Alerts）

最常用的五种提示直接用 GitHub 的写法，在 GitHub 上预览时也能正确显示：

> [!NOTE]
> 对应 Butterfly 的 `{% note info %}`。

> [!TIP]
> 对应 `{% note success %}`。

> [!IMPORTANT]
> 对应 `{% note primary %}`。

> [!WARNING]
> 对应 `{% note warning %}`。

> [!CAUTION]
> 对应 `{% note danger %}`。

```md
> [!TIP]
> 对应 `{% note success %}`。
```

## Note：完整的 Butterfly 变体

GitHub 写法覆盖不到的样式（`default`、颜色、`modern` / `simple` / `disabled`、自定义图标）用 `:::note`：

:::note{.default .flat}
`default` 样式
:::

:::note{.blue .flat icon="fas fa-bullhorn"}
自定义 Font Awesome 图标
:::

:::note{.orange .modern}
`modern` 样式
:::

```md
:::note{.blue .flat icon="fas fa-bullhorn"}
自定义 Font Awesome 图标
:::
```

## Tip

:::tip{type=info}
`info` 类型
:::

:::tip{type=bolt}
`bolt` 类型。另有 `home` `key` `bell` `cogs` `warning` `success` `error` `ban` `sync`
:::

:::tip{type=warning .faa-horizontal .animated}
加上 `.faa-horizontal .animated` 图标会左右晃动
:::

```md
:::tip{type=warning .faa-horizontal .animated}
加上动画类名
:::
```

## 折叠块

:::details[点击展开]{.green}
折叠内容，支持任意 Markdown。颜色可选 `blue` `cyan` `green` `yellow` `orange` `red` `purple`，加 `open` 默认展开。
:::

```md
:::details[点击展开]{.green open}
折叠内容
:::
```

## 标签页

::::tabs
:::tab[npm]
```bash
npm install
```
:::
:::tab[pnpm]
```bash
pnpm install
```
:::
:::tab[yarn]
```bash
yarn
```
:::
::::

````md
::::tabs
:::tab[npm]
内容
:::
:::tab[pnpm]
内容
:::
::::
````

键盘可用：聚焦标签后用方向键切换。

## 行内元素

彩色文字：:span[红色]{.red}、:span[绿色]{.green}、:span[蓝色]{.blue}、:span[大号]{.large}

隐藏文字：答案是 :spoiler[42]（悬停或聚焦显示）

气泡注释：:tooltip[Astro]{tip="一个以内容为中心的 Web 框架"}

```md
:span[红色]{.red}  :spoiler[42]
:tooltip[Astro]{tip="一个以内容为中心的 Web 框架" color="#DC143C"}
```

## 复选框与单选框

和 tag-plugins-plus 一样是块级元素，每个占一行：

:checkbox[已完成]{.green checked}

:checkbox[未完成]{.red}

:radio[选中]{.cyan checked}

:radio[未选中]{.blue}

```md
:checkbox[已完成]{.green checked}

:radio[选中]{.cyan checked}
```

颜色可选 `red` `green` `blue` `cyan` `yellow`。

## 网站卡片

::site{name="Astro" url="https://astro.build/" screenshot="/img/covers/1.svg" avatar="/img/favicon.svg" description="The web framework for content-driven websites"}

```md
::site{name="Astro" url="https://astro.build/" screenshot="/img/covers/1.svg" avatar="/img/favicon.svg" description="站点描述"}
```
