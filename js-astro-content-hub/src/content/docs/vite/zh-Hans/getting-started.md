---
title: "快速开始"
description: "创建新的 Vite 项目并启动开发服务器。"
order: 1
---

使用你偏好的框架初始化新项目:

```bash
npm create vite@latest
```

然后安装依赖并启动开发服务器:

```bash
cd your-project
npm install
npm run dev
```

Vite 通过原生 ES 模块提供应用,因此编辑会即时生效,且不会整体重载未修改的模块。

生产构建:

```bash
npm run build
```

产物输出到 `dist/`,可直接作为静态文件部署。
