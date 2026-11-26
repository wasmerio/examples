---
title: 不改代码，把 MCP 页面打开
description: 一个配置块就多出一个 MCP 落地页：端点、工具、内容源。默认关闭，关闭时带 noindex。
date: 2026-11-16
cover: /og/posts/zh/mcp-page.png
coverAlt: 不改代码，把 MCP 页面打开
tags: [mcp, 配置]
categories: ['扩展']
lang: zh
---

这个示例站把 MCP 页面开着。把 `mcp.enabled` 改成 false，就会反过来：页面不再可收录，导航入口也消失。

- `/mcp/` 只显示一个「未启用」的短页面，带 `noindex`，不会被搜索引擎收录；
- 导航里的入口会被过滤掉，全站不会出现死链。

## 打开它（或者关掉）

```yaml
mcp:
  enabled: true
  endpoint: https://mcp.your-domain.com/mcp
  name: Your MCP
```

改这些就够了。页面会显示带复制按钮的端点、Claude Code / Cursor / Claude Desktop 三种接法、你的工具列表和内容源列表。

`endpoint` 留空时，页面回落到 `https://<你的域名>/mcp`——多数情况下这就是正确的猜测。

## 内容源与工具

都在同一个配置块里，加一行就生效：

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

`items` 可省；省了就显示一个横杠而不是数字。数字是手写的，想让它保持真实就发布时顺手改一下，或者干脆不写。

## 它不做什么

它不托管 MCP 服务。它只是给已经在跑的那个服务写一个说明页——Worker、小服务、任何说这个协议的实现都行。主题是静态的，端点在你的别处。

如果想让演示站展示这个页面、而仓库默认还是关的，构建时设 `MCP_ENABLED=true`：等同于 `mcp.enabled: true`，不用改 YAML。线上演示就是这么开的。
