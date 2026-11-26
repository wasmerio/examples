---
title: MCP 页面
order: 4
description: 给已经在跑的 MCP 服务做一个落地页，端点、工具、内容源全部来自 YAML。
---

MCP 页不托管服务，它只是写清楚：端点是哪个、暴露了哪些工具、盖了哪些内容源。

```yaml
mcp:
  enabled: true
  endpoint: https://mcp.your-domain.com/mcp
  name: Your MCP
```

## enabled 控制什么

| `enabled` | 页面                          | 导航               |
| --------- | ----------------------------- | ------------------ |
| `true`    | 完整页面，可收录              | More 菜单里出现    |
| `false`   | 一个「未启用」短页，`noindex` | 全站过滤，包括页脚 |

> [!TIP]
> `endpoint` 留空时页面用 `https://<你的域名>/mcp`。多数情况下这就是对的。

## 内容源

```yaml
mcp:
  sources:
    - host: your-site.com
      items: 42
      desc:
        en: Articles and notes, English and Chinese
        zh: 文章与笔记，中英双语
```

`items` 可省，省了就显示横杠。数字是手写的——发布时顺手改，或者干脆不写。

## 工具

```yaml
mcp:
  tools:
    - name: search
      args: query, source?
      desc:
        en: Keyword search across all sources.
        zh: 跨源关键词搜索。
```

`args` 是纯字符串，渲染在工具名后面的括号里。没有校验——服务端怎么写的就怎么填。

## 演示构建

构建时设 `MCP_ENABLED=true` 等同于 `enabled: true`，不用改 YAML。线上演示就是这么开的，仓库默认可以保持关闭。
