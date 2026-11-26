---
title: "Building a fake API"
description: "Routes, relationships, and query features JSON Server provides."
order: 2
---

JSON Server infers routes from the shape of your `db.json`. Each top-level array
becomes a resource with full CRUD support.

Common query features:

- **Filtering** — `GET /posts?title=Hello`
- **Pagination** — `GET /posts?_page=1&_per_page=10`
- **Sorting** — `GET /posts?_sort=title&_order=asc`
- **Slice** — `GET /posts?_start=0&_end=5`

You can also define custom routes with a `routes.json` file and serve static files
alongside the API. This makes JSON Server a quick stand-in for a real backend during
development.
