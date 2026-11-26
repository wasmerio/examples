---
title: About 页
order: 10
description: "在 site.config.yaml 里写 About 页，支持 Markdown，模板不用碰。"
---

`/about/` 上的所有内容都来自 `about:` 配置块，模板里没有自己的文案。

## 结构

```yaml
about:
  intro:
    en: |
      **Bold**, *italic*, `code` and [links](https://example.com) work.
    zh: |
      **加粗**、*斜体*、`代码`、[链接](https://example.com)都能用。
  expertise:
    - icon: search
      title: { en: SEO engineering, zh: SEO 工程 }
      text: { en: 你做什么, zh: 你做什么 }
  stack:
    - { icon: globe, label: Astro, note: { en: 站点框架, zh: 站点框架 } }
  journey:
    - icon: tag
      version: v1.0.0
      when: 2026-11
      what: { en: 改了什么, zh: 改了什么 }
```

## 两条规则

**语言。** 每个值要么是纯字符串（`icon: tag`、`when: 2026-11`），要么按语言分键：`{ en: ..., zh: ..., zh-hant: ... }`。缺的键回落到 `zh`，再回落到 `en`。

**Markdown。** `intro` 按块渲染——空行分段落，`-` 或 `1.` 起列表。`expertise[].text` 和 `journey[].what` 只做行内渲染，保持一行。两者都走主题内置的那个小渲染器：不引 Markdown 依赖，也不放行裸 HTML——配置文本先转义再上格式。

## 图标

`icon:` 填 Font Awesome 名（`search`、`bot`、`box`、`globe`、`tag`、`code`、`flask`）。切到 Iconfont 项目后，同名走你的 symbol 集，见[替换图标](/zh/docs/configuration/icons/)。

## 删掉一块

列表留空即不渲染该区块；`/about/` 只剩 intro、有内容的区块和回首页链接，没有藏在开关后面的东西。
