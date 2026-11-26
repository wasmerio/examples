---
title: "构建假 API"
description: "JSON Server 提供的路由、关系与查询特性。"
order: 2
---

JSON Server 从 `db.json` 的结构推断路由。每个顶层数组都成为一个支持完整 CRUD 的资源。

常用查询特性:

- **过滤** —— `GET /posts?title=Hello`
- **分页** —— `GET /posts?_page=1&_per_page=10`
- **排序** —— `GET /posts?_sort=title&_order=asc`
- **切片** —— `GET /posts?_start=0&_end=5`

你还可以用 `routes.json` 定义自定义路由,并在 API 旁提供静态文件。这让 JSON Server 在
开发期间成为真实后端的快速替代品。
