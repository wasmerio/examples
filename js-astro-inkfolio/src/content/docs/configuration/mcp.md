---
title: MCP page
order: 4
description: An opt-in landing page for an MCP server you already run — endpoint, tools and sources from YAML alone.
---

The MCP page does not host a server. It documents one: the endpoint, the tools it exposes, and which sources it covers.

```yaml
mcp:
  enabled: true
  endpoint: https://mcp.your-domain.com/mcp
  name: Your MCP
```

## What enabled controls

| `enabled` | page                                | navigation                                          |
| --------- | ----------------------------------- | --------------------------------------------------- |
| `true`    | full page, indexable                | entry appears under More                            |
| `false`   | short “not enabled” page, `noindex` | entry filtered out everywhere, including the footer |

> [!TIP]
> Leave `endpoint` empty and the page uses `https://<your domain>/mcp`. That is right for most setups.

## Sources

```yaml
mcp:
  sources:
    - host: your-site.com
      items: 42
      desc:
        en: Articles and notes, English and Chinese
        zh: 文章与笔记，中英双语
```

`items` is optional; omit it and the page prints a dash. The numbers are written by hand — update them when you publish, or leave them out.

## Tools

```yaml
mcp:
  tools:
    - name: search
      args: query, source?
      desc:
        en: Keyword search across all sources.
        zh: 跨源关键词搜索。
```

`args` is a plain string, rendered inside the parentheses after the tool name. Nothing validates it — write it the way your server documents it.

## Demo builds

Setting `MCP_ENABLED=true` in the environment is equivalent to `enabled: true` without editing the YAML. The live demo uses this so the repository default can stay off.
