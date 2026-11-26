---
title: "Getting Started"
description: "Spin up a mock REST API from a JSON file."
order: 1
---

Create a `db.json` with some data:

```json
{
  "posts": [{ "id": 1, "title": "Hello" }],
  "comments": [{ "id": 1, "body": "Nice", "postId": 1 }]
}
```

Start the server:

```bash
npx json-server db.json
```

JSON Server now exposes REST endpoints such as `GET /posts` and `GET /posts/1`,
and supports filtering, pagination, and sorting via query parameters.

For a writable server that persists changes, run:

```bash
npx json-server --watch db.json
```
