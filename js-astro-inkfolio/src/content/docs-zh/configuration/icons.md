---
title: 替换图标
order: 9
description: "沿用本地打包的 Font Awesome，或通过配置切到自己的阿里 Iconfont 项目。"
---

主题自带 Font Awesome 本地文件：不走 CDN，运行时不发请求。想用自己的图标集，可以用阿里 Iconfont 项目，配置里换一下就行。

## 默认：Font Awesome

不用做任何事。图标写成 `<i class="fa-solid fa-thumbtack">`，字体文件在构建产物里。

## 切到 Iconfont

```yaml
icons:
  mode: iconfont
  iconfont:
    jsUrl: //at.alicdn.com/t/c/font_1234567_abcdef.js
    prefix: icon
```

从 Iconfont 项目页取 **symbol** 形式的链接（以 `.js` 结尾的那种），不要用 CSS 那种——symbol 改颜色和尺寸都跟着走，CSS 字体不行。

`mode: iconfont` 时脚本注入到 `<head>`，图标这样写：

```html
<svg class="icon" aria-hidden="true"><use href="#icon-name"></use></svg>
```

`icon-name` 是项目里的 symbol 名。`prefix` 只是记录命名约定；项目用的是别的前缀时改 `href` 即可。

## 两种混用

`mode` 是全站一个开关：只选一个来源。混用技术上可行，但等于维护两套图标语言，这种东西会悄悄腐烂。
