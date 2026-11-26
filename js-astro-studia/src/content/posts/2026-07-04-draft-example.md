---
# DEMO CONTENT: the draft case. `draft: true` keeps a post out of the list, the
# tag pages, the feed and the sitemap, and out of its own URL — it is not built
# at all. Delete the flag to publish it.
title: An unfinished thought
date: 2026-07-04
description: This post should not appear anywhere on the built site.
tags: [method]
draft: true
---

If you can read this on the built site, the draft filter in
`src/lib/blog.ts` is not being applied somewhere.
