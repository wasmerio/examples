---
title: Replacing the icons
order: 9
description: "Keep the bundled Font Awesome, or switch to an Alibaba Iconfont project through configuration."
---

The theme ships Font Awesome locally: no CDN, no request at runtime. If you would rather use your own icon set, an Alibaba Iconfont project works through config.

## Default: Font Awesome

Nothing to do. Icons are written as `<i class="fa-solid fa-thumbtack">` and the font files live in the build.

## Switch to Iconfont

```yaml
icons:
  mode: iconfont
  iconfont:
    jsUrl: //at.alicdn.com/t/c/font_1234567_abcdef.js
    prefix: icon
```

Take the **symbol** link from the Iconfont project page (the one ending in `.js`), not the CSS one — symbols survive colour and size changes; the CSS font does not.

With `mode: iconfont` the script is injected in `<head>` and icons are marked up as:

```html
<svg class="icon" aria-hidden="true"><use href="#icon-name"></use></svg>
```

Where `icon-name` is the symbol name in your project. The `prefix` value documents the convention; adjust the `href` if your project uses a different one.

## Mixing both

`mode` is a single switch: pick one source for the whole site. A mixed setup is possible but it means maintaining two icon languages, which is the kind of thing that rots quietly.
