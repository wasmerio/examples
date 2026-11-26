---
title: Public API and custom styles
description: Reuse ermaozi layouts, components, and reactive data from Astro or Vue, then override theme variables.
permalink: /en/docs/guide/api/
translationOf: /docs/guide/api/
type: doc
group: Guide
order: 15
createTime: 2026-08-06
tags: [API, Components, Styles]
---

# Public API and custom styles

## Layouts and common components

Astro components can be imported from the `theme/client.ts` barrel or directly from `theme/components/`:

```astro
---
import { VPBadge, VPButton, VPCard, VPCardGrid, VPIcon, VPImage, VPLink, VPHomeFeatures } from '../../../../theme/client'
---

<VPBadge type="tip" text="Stable" />
<VPButton href="/en/docs/" text="Read the docs" icon="book" />
<VPLink href="https://astro.build/">Astro</VPLink>
<VPImage image={{ light: '/img/light.svg', dark: '/img/dark.svg', alt: 'Theme image' }} />
<VPCardGrid cols={{ sm: 1, md: 2, lg: 3 }}><VPCard title="Card">Content</VPCard></VPCardGrid>
```

The home exports are `VPHomeBanner`, `VPHomeBox`, `VPHomeCustom`, `VPHomeFeatures`, `VPHomeHero`, `VPHomeProfile`, and `VPHomeTextImage`. Configured home pages and direct imports share these components.

`Layout` is the complete page shell and `NotFound` is the reusable 404 layout. Normal content pages rarely import them because theme routes apply the layout automatically.

## Client composables

`useDarkMode()` returns a Vue `Ref<boolean>` for reading or changing the current appearance. `useData()` returns Plume-shaped `theme`, `page`, `frontmatter`, `lang`, `site`, and `isDark` refs. Page data comes from build-time safe JSON; passwords and password hints are never exposed through this API.

```ts
import { useDarkMode, useData, useLocalePostList } from '../../../../theme/client'

const isDark = useDarkMode()
isDark.value = true

const { page, frontmatter, lang } = useData()
console.log(page.value.path, frontmatter.value.title, lang.value)

const posts = useLocalePostList()
// posts.value updates after /posts.json loads
```

The optional second argument of `useLocalePostList(lang, collection)` accepts either a full collection key such as `en-US:blog` or a directory name in that locale.

## Global ECharts configuration

Edit `theme/client-config.ts` before the browser starts and call `defineEChartsConfig()` for one-time setup and options shared by every ECharts instance. Per-chart options override global keys:

```ts
import { defineEChartsConfig } from './lib/echarts-config'

defineEChartsConfig({
  option: { animation: false },
  setup: async () => {
    await import('echarts-wordcloud')
  },
})
```

## Node configuration helpers

`theme/node.ts` exports `defineThemeConfig`, `defineNavbarConfig`, `defineCollections`, and `defineCollection` for TypeScript inference. They return the supplied configuration unchanged.

```ts
import { defineCollections } from '../../../../theme/node'

export const collections = defineCollections([
  { type: 'post', dir: 'blog', title: 'Blog' },
  { type: 'doc', dir: 'docs', title: 'Docs', sidebar: 'auto' },
])
```

## Custom styles

Put site-specific overrides in `theme/styles/custom.css`. It loads after theme and third-party styles, so it can override CSS variables or add selectors:

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

Styles inside slot components are scoped by Astro. Use `:global(...)` or `custom.css` when a rule must target the global theme DOM.
