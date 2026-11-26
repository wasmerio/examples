---
title: 安装与运行
order: 1
description: 三条命令在本机跑起来。只要 Node 20+，别的都不用装。
---

Inkfolio 是一个静态的 Astro 主题。你需要 Node.js 20+ 和一个终端。

```bash
npm install
npm run dev      # http://localhost:4321
```

装完就能跑。保存文件自动热更新，Ctrl+C 停掉。

## 构建静态站

```bash
npm run build    # 输出到 dist/
npm run preview  # 本地预览 dist/，和生产一致
```

> [!NOTE]
> 配置缺项或写错时 `npm run build` 会直接报错——坏的 `site.config.yaml` 不会静默上线。

## 接下来先改三行

打开 `site.config.yaml`，至少改这三项：

```yaml
site:
  url: https://your-domain.com
  name: 你的站名
  author: 你的名字
```

`url` 决定 canonical、sitemap 和 RSS。留着 `example.com` 的话，每一页都在告诉搜索引擎「我家在 example.com」。

## 环境要求

- Node.js 20 或更新
- npm（随 Node 自带）
- 不要数据库、不要 API key、不要服务器

主题只有四个依赖：Astro、RSS、sitemap、Font Awesome，其余全是标准库。

下一篇：把它发到线上。
