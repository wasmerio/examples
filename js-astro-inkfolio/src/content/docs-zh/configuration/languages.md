---
title: 多语言
order: 8
description: "主题如何发布多种语言，以及怎样整层关掉。"
---

## 现在有什么

英文在 `/`，简体中文在 `/zh/`，繁体中文在 `/zh-Hant/`。每种语言都是一整套路由，不是运行时翻译。

```yaml
i18n:
  enabled: true
  defaultLanguage: en        # en | zh | zh-hant
  languages: [en, zh, zh-hant]
  detectBrowserLanguage: false
```

- `enabled: false` 整层关闭：其他语言的页面输出 `noindex` 加一条跳转，切换器消失
- `languages` 决定发布哪些语言；去掉一种，切换器与 `hreflang` 都不再提供它
- `detectBrowserLanguage` 让中文浏览器的首次访问去 `/zh-Hant/`（zh-TW/HK/MO）或 `/zh/`；手动选过就记住，不再自动跳

## 加一种语言

1. 在 `src/lib/langs.ts` 加一条：key、前缀、BCP-47、内容后缀
2. 建 `src/i18n/locales/<key>.ts` 放 UI 字典，并接进 `t()`
3. 把页面镜像到 `src/pages/<前缀>/`，传 `lang`
4. 内容集合按后缀区分：`posts/`、`posts-zh/`、`posts-zh-hant/`

`hreflang` 只对真实存在的配对输出，中文独占的文章不会声称自己有英文版。

## 命名

简体是 `zh-Hans`，繁体是 `zh-Hant`，不要用 `zh-TW` 这种地区码——那是读者住在哪，不是他读哪种字形。
