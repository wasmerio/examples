---
title: "外观"
description: "种子配色系统、Dock 里的取色与滑条,以及硬编码你自己的主题。"
date: 2026-06-27
order: 3
tags: ["指南", "设计令牌"]
toc: true
---

整个调色板由三个颜色混出:共享的 `--paper` 与 `--ink`(随明暗模式翻转),加上一枚 `--seed`。所有 token——纸面、边框、悬浮、链接——都用 `color-mix(in oklch, …)` 从三者推导,任何种子都不会失调。

## Dock 显示面板

Dock 上的设置按钮打开显示面板(Dock 在宽屏横屏时停靠右侧,其余情况停在底部):

- **明暗模式**——亮色、自动、暗色。自动跟随系统并实时切换。
- **主题色**——预设色板加色相、彩度、明度三条自定义滑杆。取色器覆盖整个色相环和可用的彩度范围,明度限制在 30–70%,任意种子下的强调与链接都保持可读;第一枚色板恢复单色默认。选择按访客持久化。
- **磨砂强度**——上下文栏、Dock 与浮层的毛玻璃模糊。
- **背景颗粒**——页面上的胶片颗粒覆盖层,默认关闭。
- **页面宽度**——围绕 `contentWidth` 调整阅读栏宽。

## 硬编码一套主题

想让站点固定自己的默认色,在 `src/styles/tokens.css` 声明种子配方,并把 `src/config/theme.ts` 的 `defaultTheme` 指向它:

```css
[data-theme='teal'] {
  --seed-recipe-l: 0.58;
  --seed-recipe-c: 0.17;
  --seed-recipe-h: 190;
}
```

声明配方通道而不是 `--seed` 本身,配色方案才能在此基础上继续重调彩度。实色 accent 的文字颜色由 `contrast-color()` 原生决定,链接文字则是种子经过相对颜色语法做的明暗自适应变换——亮色下压暗、暗色下抬亮——取色器 30–70% 明度范围内的种子都保持可读。内置的单色默认(`ink`)额外把实色 accent 绑定为墨本身:

```css
[data-theme='ink'] {
  --seed-recipe-l: 0.3;
  --seed-recipe-c: 0.01;
  --seed-recipe-h: 285;
  --accent: var(--fg);
  --accent-contrast: var(--canvas);
  --accent-text: var(--fg);
}
```

## 字号与间距

字号与间距来自同一文件中的流式 [Utopia](https://utopia.fyi) 刻度(`--step-*`、`--space-*`),并暴露为 Tailwind 工具类(`text-step-1`、`p-fl-m`)。一个 `--radius` 圆角贯穿所有盒子;提示块、代码块与表格取自同一套 token。
