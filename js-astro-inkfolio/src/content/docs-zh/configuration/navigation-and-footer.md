---
title: 导航与页脚
order: 2
description: 菜单项、下拉、右侧按钮、页脚三栏和页脚大图。
---

## 顶部导航

`nav` 是个列表。只有 `href` 的是普通链接；带 `items` 的会变成下拉：

```yaml
nav:
  - label: Weekly
    labelZh: 周更
    href: /weekly/
  - label: Writing
    labelZh: 写作
    items:
      - label: Posts
        labelZh: 文章
        href: /posts/
        sub: 长文与随手记
        subZh: 长文与随手记
```

`sub` 是下拉里那行小字。`labelZh` 可选：不写，这一项就不会出现在中文导航里，而不是指向一个不存在的页面。

右边那个按钮是单独的块：

```yaml
navCta:
  label: Say hi
  labelZh: 打个招呼
  href: /contact/
```

## 页脚三栏

```yaml
footerColumns:
  - title: Writing
    titleZh: 写作
    links:
      - { label: Posts, labelZh: 文章, href: /posts/ }
```

加一栏就加一条；加链接就往 `links` 里加。不用改组件。

## 页脚版权行与大图

```yaml
footer:
  copyright: '© {year} {name}' # {year} 与 {name} 会被替换
  copyrightZh: '© {year} {name}'
  copyrightName: Inkfolio
  authorUrl: https://jask.dev
  authorLabel: jask.dev
  text: '' # 版权后面的自定义文字
  textZh: ''
  artLight: /footer/footer-light.webp
  artDark: /footer/footer-dark.webp
```

`copyright` 接管整行；留空则由主题自己拼 `© {year} {copyrightName}`。`text` 放许可证说明之类要跟版权写在一起的话，纯文本，不渲染 Markdown。

### 署名

```yaml
footer:
  credit:
    show: true
    label: Powered by Inkfolio
    labelZh: 由 Inkfolio 驱动
    href: https://github.com/respectevery01/inkfolio
```

渲染成最底下单独一行：11px、百分之六十透明度。在，但不吆喝。`show: false` 可去掉（主题是 GPL，去之前先看许可证）。

大图是 **1600 × 529** 的 WebP，一个主题一张。直接覆盖 `public/footer/` 里那两个文件、文件名不变。两个路径都设成 `""` 就不要这张图。

> [!TIP]
> `mcp.enabled` 为 false 时，页脚的 MCP 入口会自动过滤掉。
