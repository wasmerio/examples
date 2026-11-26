---
title: "快速开始"
description: "从一个 JSON 文件启动一个模拟 REST API。"
order: 1
---

创建一个包含数据的 `db.json`:

```json
{
  "posts": [{ "id": 1, "title": "Hello" }],
  "comments": [{ "id": 1, "body": "Nice", "postId": 1 }]
}
```

启动服务器:

```bash
npx json-server db.json
```

JSON Server 现在暴露了诸如 `GET /posts` 与 `GET /posts/1` 等 REST 接口,并支持通过查询
参数进行过滤、分页与排序。

要运行会持久化变更的服务器:

```bash
npx json-server --watch db.json
```
