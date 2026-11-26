---
title: Turn the MCP page on without touching code
description: One config block adds an MCP landing page with your endpoint, tools and sources — off by default, noindex while it is off.
date: 2026-11-16
cover: /og/posts/en/mcp-page.png
coverAlt: Turn the MCP page on without touching code
tags: [mcp, configuration]
categories: ['Extend']
---

This demo ships with the MCP page on. Set `mcp.enabled: false` and the opposite happens: the page stops being indexable and its nav entry disappears.

- `/mcp/` renders a short "not enabled" page with `noindex`, so it never lands in search results.
- The navigation entry is filtered out — no dead link anywhere on the site.

## Turning it on (or off)

```yaml
mcp:
  enabled: true
  endpoint: https://mcp.your-domain.com/mcp
  name: Your MCP
```

That is the whole change. The page then shows the endpoint with a copy button, connection steps for Claude Code, Cursor/Windsurf and Claude Desktop, your tool list and your sources.

Leave `endpoint` empty and the page falls back to `https://<your domain>/mcp`, which is the right guess for most setups.

## Sources and tools

Both are plain lists in the same block — add a row, reload:

```yaml
mcp:
  sources:
    - host: your-site.com
      items: 42
      desc:
        en: Articles and notes, English and Chinese
        zh: 文章与笔记，中英双语
  tools:
    - name: search
      args: query, source?
      desc:
        en: Keyword search across all sources.
        zh: 跨源关键词搜索。
```

`items` is optional; omit it and the page prints a dash instead of a number. Counts are written by hand — if you want them to stay honest, update them when you publish, or drop the field.

## What the page does not do

It does not host an MCP server. It documents one you already run — a Worker, a small service, anything that speaks the protocol. The theme is static; the endpoint lives elsewhere.

If you want the page on a demo build but off in the repository, set `MCP_ENABLED=true` in the environment: the build treats that as `mcp.enabled: true` without editing the YAML. That is how the live demo shows it while the repo default stays off.
