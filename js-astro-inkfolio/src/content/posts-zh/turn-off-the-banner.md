---
title: 一行关掉顶部横幅
description: 顶部那条 ZensInk 横幅可以关掉，也可以改文案，全程不碰代码。
date: 2026-11-12
cover: /og/posts/zh/turn-off-the-banner.png
coverAlt: 一行关掉顶部横幅
tags: [配置, 横幅]
categories: ['配置']
lang: zh
---

Inkfolio 是免费开源的。为了让它能持续维护，主题自带一条提到 [ZensInk](https://zens.ink) 的小横幅——就是本站写的时候顺手在用的那套 SEO 工具。你完全可以不用它。

## 彻底去掉

打开 `site.config.yaml`，找到 `promoBanner`，改一个值：

```yaml
promoBanner:
  enabled: false
```

保存，所有页面的横幅都消失。HTML 根本不会渲染，所以不会留下隐藏元素，也没有可点的东西。

## 留着，但换文案

```yaml
promoBanner:
  enabled: true
  dismissible: true
  text: 本站由 Inkfolio 驱动
  link: https://example.com
  linkText: 了解更多
```

链接随便指向你的邮件列表、你的产品或者你自己的项目。横幅只是个普通配置项，代码里没有给它特殊地位。

## dismissible 是什么

`dismissible: true` 时访客会看到一个关闭按钮。点过之后选择存在 `localStorage` 的 `inkfolio-promo-dismissed` 里，这个浏览器上以后就不显示了。如果横幅是法律告知而不是推广，设成 `false` 让它常驻。

有个细节值得知道：横幅元素默认是隐藏的，由几行内联 JS 决定显示。这样关过的人刷新页面时不会闪一下又弹回来。访客禁用 JS 时横幅保持隐藏，而不是显示一个关不掉的条。
