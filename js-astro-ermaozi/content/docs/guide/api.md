---
title: 公共 API 与样式定制
description: 在 Astro 或 Vue 组件中复用 ermaozi 布局、通用组件和响应式数据，并覆盖主题变量。
permalink: /docs/guide/api/
type: doc
group: 指南
order: 15
createTime: 2026-08-06
tags: [API, 组件, 样式]
---

# 公共 API 与样式定制

## 布局与通用组件

Astro 组件可从 `theme/client.ts` 统一导入，也可直接从 `theme/components/` 导入：

```astro
---
import { VPBadge, VPButton, VPCard, VPCardGrid, VPIcon, VPImage, VPLink, VPHomeFeatures } from '../../../theme/client'
---

<VPBadge type="tip" text="稳定" />
<VPButton href="/docs/" text="阅读文档" icon="book" />
<VPLink href="https://astro.build/">Astro</VPLink>
<VPImage image={{ light: '/img/light.svg', dark: '/img/dark.svg', alt: '主题图片' }} />
<VPCardGrid cols={{ sm: 1, md: 2, lg: 3 }}><VPCard title="卡片">内容</VPCard></VPCardGrid>
```

首页组件同时导出 `VPHomeBanner`、`VPHomeBox`、`VPHomeCustom`、`VPHomeFeatures`、`VPHomeHero`、`VPHomeProfile` 和 `VPHomeTextImage`；站点首页配置与直接引用共用同一套组件。

`Layout` 是完整页面壳层，`NotFound` 是可复用的 404 布局。普通内容页通常不需要直接使用它们，因为主题路由已经自动套用布局。

## 客户端组合式 API

`useDarkMode()` 返回 Vue `Ref<boolean>`，可读取或切换当前外观；`useData()` 返回与 Plume 同形的 `theme`、`page`、`frontmatter`、`lang`、`site` 和 `isDark` refs。页面数据来自构建时写入的安全 JSON，密码和密码提示不会发送到该接口。

```ts
import { useDarkMode, useData, useLocalePostList } from '../../../theme/client'

const isDark = useDarkMode()
isDark.value = true

const { page, frontmatter, lang } = useData()
console.log(page.value.path, frontmatter.value.title, lang.value)

const posts = useLocalePostList()
// posts.value 会在 /posts.json 加载后更新
```

`useLocalePostList(lang, collection)` 的第二个参数可传完整集合键（如 `zh-CN:blog`）或当前语言下的目录名。

## ECharts 全局配置

在浏览器启动前编辑 `theme/client-config.ts`，通过 `defineEChartsConfig()` 设置一次性初始化逻辑和所有 ECharts 实例共享的选项。页面级图表选项会覆盖同名全局项：

```ts
import { defineEChartsConfig } from './lib/echarts-config'

defineEChartsConfig({
  option: { animation: false },
  setup: async () => {
    await import('echarts-wordcloud')
  },
})
```

## Node 配置帮助函数

`theme/node.ts` 导出 `defineThemeConfig`、`defineNavbarConfig`、`defineCollections` 和 `defineCollection`，用于保留 TypeScript 推导；它们不会改变传入配置。

```ts
import { defineCollections } from '../../../theme/node'

export const collections = defineCollections([
  { type: 'post', dir: 'blog', title: '博客' },
  { type: 'doc', dir: 'docs', title: '文档', sidebar: 'auto' },
])
```

## 自定义样式

把站点专属样式写入 `theme/styles/custom.css`。该文件在主题和第三方样式之后加载，适合覆盖 CSS 变量或追加选择器：

```css
:root {
  --vp-c-brand-1: #5086a1;
  --vp-c-brand-2: #6aa1b7;
  --vp-c-brand-3: #8cccd5;
}

[data-theme='dark'] {
  --vp-c-brand-1: #8cccd5;
}
```

插槽组件中的 `<style>` 默认由 Astro 作用域隔离；需要覆盖全局主题选择器时使用 `:global(...)` 或 `custom.css`。
