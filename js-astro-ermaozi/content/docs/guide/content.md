---
title: 内容能力
description: 使用代码高亮、脚注、提示框、表格、媒体嵌入和其他 Markdown 扩展。
permalink: /docs/guide/content/
type: doc
group: 指南
order: 20
createTime: 2026-08-05
updateTime: 2026-08-05
tags: [Markdown, 写作]
---

# 内容能力

主题在标准 Markdown 上增加了写作常用能力，并保持静态输出。[功能设计参考][plume] Theme Plume 的公开文档，但实现基于 Astro 和 Markdown-it。

[[TOC]]

## 代码块

代码块支持 Shiki 双主题高亮、标题、行号和指定行高亮。

```ts title="site.config.mjs" line-numbers {2-3}
export const siteConfig = {
  origin: 'https://example.com',
  logo: '/img/logo.svg',
}
```

代码注释语法支持聚焦、高亮、差异、警告、错误与词高亮，控制注释不会出现在输出中：

```ts title="notations.ts" line-numbers
const plain = '普通行'
const focused = '聚焦行' // [!code focus]
const removed = false // [!code --]
const added = true // [!code ++]
const warning = '注意' // [!code warning]
const error = '错误' // [!code error]
const highlighted = '高亮' // [!code highlight]
const greeting = 'Hello Hello' // [!code word:Hello:2]
```

长代码块可从指定行开始折叠：

```css :collapsed-lines=4
.one { color: red; }
.two { color: orange; }
.three { color: yellow; }
.four { color: green; }
.five { color: blue; }
.six { color: indigo; }
.seven { color: violet; }
.eight { color: black; }
```

## 脚注和表格

脚注适合补充来源或术语说明。[^static]

::: table copy="all"
| 能力 | 默认状态 |
| --- | --- |
| Pagefind 搜索 | 开启 |
| Giscus 评论 | 关闭 |
| 浏览量与点赞 | 关闭 |
:::

表格右上角可复制为 HTML 或 Markdown。

## 行内扩展与环境预设

Emoji、上标和下标可直接使用：:tada: :100:，X^2^，H~2~O。

全局引用、缩写和内容注释只需在 `markdown.env` 中配置一次，之后可在任意页面使用：[Astro][astro] 是一个 SSG [+preset]。

Markdown 文件链接会自动解析到最终永久链接，例如[站点配置](./configuration.md)。

## 提示容器

::: info
相关信息使用本地化的默认标题。
:::

::: note
注释内容。
:::

::: tip **自定义标题**
标题支持 Markdown。
:::

:::: warning 外层提示
注意事项可以嵌套。

::: important
这是内层的重要内容。
:::
::::

::: caution
需要谨慎处理。
:::

::: danger
旧版 `danger` 语法兼容为 caution。
:::

::: details **展开详情**
这是可折叠的详细内容。
:::

> [!NOTE]
> GitHub Alert 使用同一套提示样式。

## Obsidian 兼容

Wiki 链接、内容嵌入、Callout 与 `%%` 注释默认开启，并可在 `site.config.mjs` 的 `markdown.obsidian` 中分别关闭。[[docs/guide/configuration|查看站点配置]]。

当前页标题也可以直接链接：[[#Obsidian 兼容]]。

> [!bug] **自定义 Callout 标题**
> Obsidian 类型和别名会映射到同一套 Plume 提示样式。

![[/img/logo.svg|48x48]]

下面从配置文档嵌入“页面过渡”小节的正文：

![[docs/guide/configuration#页面过渡]]

这段文字包含 %%仅编辑时可见的注释%%，构建后不会输出注释内容。

## 媒体语法

YouTube、Bilibili、音视频和 PDF 使用简短的块级语法；只有使用时才产生对应标签。块级指令必须独占一行，可以放在引用或列表项中，指令后不能追加正文。

```md
@[youtube](video-id)
@[bilibili](BV-id)
@[video](/media/demo.mp4)
@[audio](/media/demo.mp3)
@[pdf](/files/guide.pdf)
```

audio 美 @[audioReader title="[ˈɔːdioʊ]" start-time="1" end-time="3" volume="0.7"](https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio)

@[artPlayer muted loop ratio="16:9"](https://artplayer.org/assets/sample/video.mp4)

@[youtube autoplay loop start="1:02" end="1:30" width="90%" ratio="4:3" title="YouTube 参数示例"](video-id)

@[bilibili p2 autoplay time="1:05" width="80%" height="180px"](BV1EZ42187Hg 123 456)

@[acfun width="70%" ratio="16:10"](ac47431669)

@[pdf 2 no-toolbar zoom="95" height="180px"](https://plume.pengzhanbo.cn/files/sample-1.pdf)

![可点击预览的主题标志 =160x160](/img/logo.svg)

## 仓库卡片

仓库卡片支持 GitHub 与 Gitee，展示语言、Star、Fork、许可证、模板和归档状态，并在浏览器中缓存 24 小时。

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

<RepoCard repo="pengzhanbo/vuepress-theme-plume" />

## 浏览器兼容性

`caniuse` 指令支持完整兼容表和 Baseline 摘要，也可以指定过去与未来的版本周期。

```md
@[caniuse{-2,1}](css-matches-pseudo)
@[caniuse baseline](css-matches-pseudo)
::: caniuse css-container-queries{-2,1}
:::
```

@[caniuse baseline](css-matches-pseudo)

旧版 Plume 文档中的容器语法也可以直接迁移：

::: caniuse css-container-queries{-2,1}
:::

## 轮播图

`Swiper` 支持 Plume 的轮播、导航、分页、自动播放和动画参数：

<Swiper
  :items="['/img/logo.svg?slide=1', '/img/logo.svg?slide=2', '/img/logo.svg?slide=3']"
  height="240"
  effect="fade"
  :delay="5000"
/>

## 对话记录

::: chat title="主题讨论"
{:2026-08-05 10:15}

{访客}
这个主题支持 **Markdown** 消息吗？

{.}
支持，发送者、时间与本人消息都会按 Plume 样式渲染。

{:2026-08-05 10:18}

{访客}
很好。
:::

## 代码演示

::: demo normal title="按钮演示" desc="HTML、CSS 与 JavaScript 在隔离 iframe 中运行。"
```html
<button id="demo-button">点击 0</button>
```

```css
#demo-button { padding: 8px 14px; border: 0; border-radius: 6px; color: white; background: #336f87; }
```

```js
let count = 0
const button = document.querySelector('#demo-button')
button.addEventListener('click', () => { button.textContent = `点击 ${++count}` })
```
:::

### 普通演示文件与外部资源

@[demo normal title="资源与 TypeScript" desc="嵌入文件会在构建期编译，并在资源菜单列出依赖。"](/snippets/demo/normal.html)

### Vue 演示

::: demo vue title="内联 Vue 计数器" desc="真实 Vue SFC 在构建期编译并挂载。"
```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button id="inline-vue-count" :class="$style.counter" type="button" @click="count += 1">内联计数 {{ count }}</button>
</template>

<style module>
.counter { border: 2px solid #336f87; }
</style>
```
:::

@[demo vue title="嵌入 Vue 组件"](/snippets/demo/Counter.vue)

### Markdown 演示

::: demo markdown title="内联 Markdown"
```md
#### Markdown 渲染结果

支持 **加粗**、列表和其它 Markdown 语法。
```
:::

@[demo markdown title="嵌入 Markdown"](/snippets/demo/example.md.txt)

## 数学公式

默认使用与 Plume 相同的 KaTeX 渲染行内公式 $e^{i\pi}+1=0$，并支持独立块级公式：

$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
$$

标记为 `twoslash` 的 TypeScript 代码块会执行真实类型分析：

```ts twoslash title="twoslash.ts"
const greeting = { text: 'hello' } as const
//    ^?
```

## 在线代码演示

@[codepen tab="html,result" height="180px"](leimapapa/RwOZQOW)

@[jsfiddle tab="result,js" height="180px"](zalun/NmudS)

@[codesandbox title="CodeSandbox 演示" layout="Editor+Preview" navbar="false" height="180px"](5wyzu#src/index.js)

@[codesandbox button](reaction/5wyzu)

@[replit title="Replit 演示" height="180px"](@TechPandaPro/Cursor-Hangout#package.json)

## 多语言代码运行

Go、Kotlin 与 Rust 会把代码发送到 Plume 使用的在线运行服务；Python 通过 Pyodide 在浏览器本地执行。`editable` 会启用就地编辑器。

::: go-repl editable title="Go playground"
```go
package main
import "fmt"
func main() { fmt.Println("Hello Go") }
```
:::

::: kotlin-repl title="Kotlin playground"
```kotlin
fun main() { println("Hello Kotlin") }
```
:::

::: rust-repl title="Rust playground"
```rust
fn main() { println!("Hello Rust"); }
```
:::

::: python-repl editable title="Python playground"
```python
print("Hello Python")
```
:::

## 隐秘文本

桌面悬停显示：!!这段内容默认被遮住!!；显式点击与模糊效果：!!点击后显示!!{.click .blur}。

组件写法同样可用：<Plot trigger="click" effect="mask">点击组件内容</Plot>。

## 图表

::: chartjs 月度趋势
```json
{"type":"line","data":{"labels":["一月","二月","三月"],"datasets":[{"label":"访问量","data":[12,19,8],"borderColor":"#336f87"}]}}
```
:::

::: echarts 分类占比
```json
{"tooltip":{},"series":[{"type":"pie","radius":"60%","data":[{"value":42,"name":"文档"},{"value":28,"name":"博客"}]}]}
```
:::

::: chartjs 未授权脚本不应执行
```js
config = { type: 'bar', data: { labels: ['危险'], datasets: [{ data: [1] }] } }
```
:::

@startuml
Alice -> Bob: 认证请求
Bob --> Alice: 认证通过
@enduml

```flow:vue
st=>start: 开始
op=>operation: 处理
e=>end: 结束
st->op->e
```

```markmap
---
markmap:
  colorFreezeLevel: 2
---

# ermaozi

## Markdown

- 链接
- **强调**

## Astro

- 静态输出
- 双语路由
```

[^static]: 所有页面在构建阶段生成，部署时不需要 Node.js 服务。

[plume]: https://plume.pengzhanbo.cn/guide/intro/
