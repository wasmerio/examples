---
tagline: "下一代前端工具。开发服务器近乎瞬时,构建毫不费力。"
description: "快速、现代的前端构建工具,配备瞬时开发服务器与优化后的生产构建。"
highlights:
  - label: "许可证"
    value: "MIT"
  - label: "类别"
    value: "构建工具"
features:
  - title: "原生 ESM 开发服务器"
    body: "开发阶段无需打包。服务器在毫秒级启动,并随项目规模平滑扩展。"
    icon:
      paths:
        - "M4 17l6-6 4 4 6-6M14 9h6v6"
  - title: "即时 HMR"
    body: "基于原生 ESM 的热更新,在你切换窗口前即可看到改动。"
    icon:
      paths:
        - "M13 2L4.5 12.5H11L9.5 22 19 10.5H12.5L13 2z"
  - title: "优化构建"
    body: "由 Rollup 驱动的生产构建,内置智能代码分割与资源处理。"
    icon:
      paths:
        - "M3 17l6-6 4 4 8-8M14 7h7v7"
  - title: "框架无关"
    body: "为 React、Vue、Svelte 等提供一流模板,并附带灵活的插件 API。"
    icon:
      paths:
        - "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"
install: |
  npm create vite@latest
links:
  - label: "官网"
    href: "https://vite.dev"
# Section system demo: the vite landing now runs through the same section
# registry as every other product (previously a hand-written override).
sections:
  - type: hero
  - type: highlights
    data:
      variant: badge
  - type: install
  - type: features
    data:
      layout: bento
      eyebrow: "为什么选择 Vite"
      title: "为开发者体验而生"
  - type: stats
    data:
      eyebrow: "数据一览"
      title: "被生态广泛采用"
      items:
        - { label: "GitHub Stars", value: "70k" }
        - { label: "npm 周下载量", value: "8M" }
        - { label: "许可证", value: "MIT" }
  - type: docs-preview
  - type: cta
    data:
      primary: { label: "开始上手", href: "/vite/docs/getting-started" }
      secondary: { label: "查看源码", href: "https://github.com/vitejs/vite" }
---

Vite 是一个旨在为现代 Web 项目提供更快、更精简开发体验的构建工具。开发
阶段使用原生 ES 模块,提供瞬时开发服务器;生产构建则通过 Rollup 预打包
依赖。
