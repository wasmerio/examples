---
title: Content features
description: Use code highlighting, footnotes, callouts, tables, media embeds, and other Markdown extensions.
permalink: /en/docs/guide/content/
translationOf: /docs/guide/content/
type: doc
group: Guide
order: 20
createTime: 2026-08-05
updateTime: 2026-08-05
tags: [Markdown, Writing]
---

# Content features

The theme extends standard Markdown with common authoring tools. Its feature set is informed by the public Theme Plume documentation, while the implementation uses Astro and Markdown-it.

[[TOC]]

## Code blocks

Code blocks support Shiki dual-theme highlighting, titles, line numbers, and highlighted lines.

```ts title="site.config.mjs" line-numbers {2-3}
export const siteConfig = {
  origin: 'https://example.com',
  logo: '/img/logo.svg',
}
```

Notation comments support focus, highlight, diff, warning, error, and word highlights without leaking control comments into the rendered code:

```ts title="notations.ts" line-numbers
const plain = 'Plain line'
const focused = 'Focused line' // [!code focus]
const removed = false // [!code --]
const added = true // [!code ++]
const warning = 'Warning' // [!code warning]
const error = 'Error' // [!code error]
const highlighted = 'Highlighted' // [!code highlight]
const greeting = 'Hello Hello' // [!code word:Hello:2]
```

Long blocks can collapse from a selected line:

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

## Footnotes and tables

Footnotes are useful for sources and terminology.[^static]

::: table copy="all"
| Feature | Default |
| --- | --- |
| Pagefind search | On |
| Giscus comments | Off |
| Views and likes | Off |
:::

The table toolbar copies HTML or Markdown.

## Inline extensions and environment presets

Emoji, superscript, and subscript work inline: :tada: :100:, X^2^, and H~2~O.

References, abbreviations, and annotations can be configured once in `markdown.env` and reused on every page: [Astro][astro] is an SSG [+preset].

Markdown file links resolve to their final permalinks automatically, for example [site configuration](./configuration.md).

## Hint containers

::: info
Information uses the localized default title.
:::

::: note
A short note.
:::

::: tip **Custom title**
Titles support Markdown.
:::

:::: warning Outer warning
Hints can be nested.

::: important
This is the nested important content.
:::
::::

::: caution
Handle this carefully.
:::

::: danger
The legacy `danger` syntax maps to caution.
:::

::: details **Show details**
This content can be expanded.
:::

> [!IMPORTANT]
> GitHub Alerts use the same hint styles.

## Obsidian compatibility

Wiki links, embeds, callouts, and `%%` comments are enabled by default and can be toggled separately through `markdown.obsidian` in `site.config.mjs`. [[en/docs/guide/configuration|View site configuration]].

Headings on the current page can be linked directly: [[#Obsidian compatibility]].

> [!bug] **Custom callout title**
> Obsidian types and aliases map to the same Plume hint styles.

![[/img/logo.svg|48x48]]

The following paragraph embeds the “Page transitions” section from the configuration guide:

![[en/docs/guide/configuration#Page transitions]]

This sentence contains an %%editor-only comment%% that is omitted from the build.

## Media syntax

YouTube, Bilibili, audio, video, and PDF embeds use small block directives and only render when used. A block directive must occupy its own line; it may appear in a blockquote or list item, but no text may follow it on that line.

```md
@[youtube](video-id)
@[bilibili](BV-id)
@[video](/media/demo.mp4)
@[audio](/media/demo.mp3)
@[pdf](/files/guide.pdf)
```

audio US @[audioReader title="[ˈɔːdioʊ]" start-time="1" end-time="3" volume="0.7"](https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio)

@[artPlayer muted loop ratio="16:9"](https://artplayer.org/assets/sample/video.mp4)

@[youtube autoplay loop start="1:02" end="1:30" width="90%" ratio="4:3" title="YouTube option example"](video-id)

@[bilibili p2 autoplay time="1:05" width="80%" height="180px"](BV1EZ42187Hg 123 456)

@[acfun width="70%" ratio="16:10"](ac47431669)

@[pdf 2 no-toolbar zoom="95" height="180px"](https://plume.pengzhanbo.cn/files/sample-1.pdf)

![Theme logo with click-to-preview =160x160](/img/logo.svg)

## Repository cards

Repository cards support GitHub and Gitee, including language, stars, forks, license, template, and archive state, with a 24-hour browser cache.

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

<RepoCard repo="pengzhanbo/vuepress-theme-plume" />

## Browser compatibility

The `caniuse` directive supports both the full compatibility table and a Baseline summary, with optional past and future release periods.

```md
@[caniuse{-2,1}](css-matches-pseudo)
@[caniuse baseline](css-matches-pseudo)
::: caniuse css-container-queries{-2,1}
:::
```

@[caniuse baseline](css-matches-pseudo)

The legacy container syntax from Plume documents also migrates directly:

::: caniuse css-container-queries{-2,1}
:::

## Swiper

`Swiper` supports Plume's navigation, pagination, autoplay, and effect options:

<Swiper
  :items="['/img/logo.svg?slide=1', '/img/logo.svg?slide=2', '/img/logo.svg?slide=3']"
  height="240"
  effect="fade"
  :delay="5000"
/>

## Chat records

::: chat title="Theme discussion"
{:2026-08-05 10:15}

{Visitor}
Does this theme support **Markdown** messages?

{.}
Yes. Senders, dates, and self messages follow Plume's styles.

{:2026-08-05 10:18}

{Visitor}
Great.
:::

## Code demo

::: demo normal title="Button demo" desc="HTML, CSS, and JavaScript run in an isolated iframe."
```html
<button id="demo-button">Clicks 0</button>
```

```css
#demo-button { padding: 8px 14px; border: 0; border-radius: 6px; color: white; background: #336f87; }
```

```js
let count = 0
const button = document.querySelector('#demo-button')
button.addEventListener('click', () => { button.textContent = `Clicks ${++count}` })
```
:::

### Normal demo files and external resources

@[demo normal title="Resources and TypeScript" desc="Embedded files compile at build time and expose dependencies in the resource menu."](/snippets/demo/normal.html)

### Vue demos

::: demo vue title="Inline Vue counter" desc="A real Vue SFC is compiled and mounted at build time."
```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button id="inline-vue-count" :class="$style.counter" type="button" @click="count += 1">Inline count {{ count }}</button>
</template>

<style module>
.counter { border: 2px solid #336f87; }
</style>
```
:::

@[demo vue title="Embedded Vue component"](/snippets/demo/Counter.vue)

### Markdown demos

::: demo markdown title="Inline Markdown"
```md
#### Rendered Markdown

Supports **bold text**, lists, and other Markdown syntax.
```
:::

@[demo markdown title="Embedded Markdown"](/snippets/demo/example.md.txt)

## Math

KaTeX, Plume's default renderer, supports inline math $e^{i\pi}+1=0$ and display math:

$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
$$

TypeScript fences marked with `twoslash` run real type analysis:

```ts twoslash title="twoslash.ts"
const greeting = { text: 'hello' } as const
//    ^?
```

## Online code embeds

@[codepen tab="html,result" height="180px"](leimapapa/RwOZQOW)

@[jsfiddle tab="result,js" height="180px"](zalun/NmudS)

@[codesandbox title="CodeSandbox demo" layout="Editor+Preview" navbar="false" height="180px"](5wyzu#src/index.js)

@[codesandbox button](reaction/5wyzu)

@[replit title="Replit demo" height="180px"](@TechPandaPro/Cursor-Hangout#package.json)

## Multi-language code runners

Go, Kotlin, and Rust submit code to the same online playground services used by Plume. Python runs locally in the browser through Pyodide. Add `editable` for an in-place editor.

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

## Hidden text

Hover on desktop: !!this text is masked by default!!; explicit click and blur: !!click to reveal!!{.click .blur}.

The component form works too: <Plot trigger="click" effect="mask">click the component text</Plot>.

## Charts

::: chartjs Monthly trend
```json
{"type":"line","data":{"labels":["Jan","Feb","Mar"],"datasets":[{"label":"Visits","data":[12,19,8],"borderColor":"#336f87"}]}}
```
:::

::: echarts Content share
```json
{"tooltip":{},"series":[{"type":"pie","radius":"60%","data":[{"value":42,"name":"Docs"},{"value":28,"name":"Blog"}]}]}
```
:::

::: chartjs Unauthorized scripts must not execute
```js
config = { type: 'bar', data: { labels: ['unsafe'], datasets: [{ data: [1] }] } }
```
:::

@startuml
Alice -> Bob: Authentication request
Bob --> Alice: Accepted
@enduml

```flow:vue
st=>start: Start
op=>operation: Process
e=>end: End
st->op->e
```

```markmap
---
markmap:
  colorFreezeLevel: 2
---

# ermaozi

## Markdown

- Links
- **Emphasis**

## Astro

- Static output
- Bilingual routes
```

[^static]: Every page is generated at build time; deployment does not need a Node.js server.
