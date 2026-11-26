---
title: "快速开始"
description: "创建新的 Astro 项目并启动开发服务器。"
order: 1
---

初始化新项目:

```bash
npm create astro@latest
```

启动开发服务器:

```bash
npm run dev
```

Astro 采用**基于文件的路由**:`src/pages/` 中的任意 `.astro` 文件都会成为一个路由。
`src/pages/index.astro` 对应 `/`。

构建静态站点:

```bash
npm run build
```

产物输出到 `dist/`,可直接作为静态文件部署。
