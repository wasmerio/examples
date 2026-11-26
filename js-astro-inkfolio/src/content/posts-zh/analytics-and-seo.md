---
title: 加统计——Umami、GA4、Clarity——都在配置文件里
description: 支持三家，默认全关，每家两个值就能开。不带标签管理器，也不带 cookie 弹窗。
date: 2026-11-15
cover: /og/posts/zh/analytics-and-seo.png
coverAlt: 加统计——Umami、GA4、Clarity——都在配置文件里
tags: [统计, 配置]
categories: ['配置']
lang: zh
---

Inkfolio 默认零追踪。想要数字的时候，打开 `site.config.yaml` 填你用的那家就行。脚本只有在 `enabled: true` **且** id 存在时才注入，所以半填的配置不会发一个坏请求出去。

## Umami（自托管或云）

```yaml
analytics:
  umami:
    enabled: true
    scriptUrl: https://analytics.your-domain.com/script.js
    websiteId: 1a2b3c4d-...
```

Umami 不写 cookie，所以这里的默认推荐是它。放在一台小 VPS 上自托管，比多数付费套餐便宜，数据还是你自己的。

## Google Analytics 4

```yaml
analytics:
  googleAnalytics:
    enabled: true
    measurementId: G-XXXXXXXXXX
```

GA4 在欧盟需要先解决同意问题。主题不带 cookie 弹窗——没人配置的弹窗比没有更糟。如果要对欧盟访客开 GA4，自己加一个同意工具，并让标签通过它加载。

## Microsoft Clarity

```yaml
analytics:
  clarity:
    enabled: true
    projectId: abcdefghij
```

Clarity 录屏加热力图，找「用户在哪一页放弃」很好用；它也是三家里面隐私最敏感的：要披露，带联系表单的站更要慎重。

## SEO 设置

同一个文件也管全站共享的元数据：

```yaml
seo:
  titleTemplate: '{title} — 你的站名'
  defaultDescription: 一句话介绍这个站。
  ogImage: /og-default.png
  twitterHandle: yourname
  structuredData: true
```

`titleTemplate` 决定标题后缀，设成 `"{title}"` 就去掉后缀。`ogImage` 是 1200×630 的社交卡片图，没单独指定的页面都用它。`structuredData` 开关 JSON-LD：普通页出 WebSite，文章页出 BlogPosting，日期取自 frontmatter。

每页自己的标题和描述来自 Markdown frontmatter，这一节不会覆盖它们。
