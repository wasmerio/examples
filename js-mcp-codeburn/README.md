# CodeBurn

## What it does

This template runs `codeburn` 0.9.28 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. AI coding spend, tokens and plan quotas across Claude Code, Codex, Cursor and 40+ more tools

## Tools

The landing page lists the tools returned by `tools/list` after the app is deployed.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists, open wasmer.io, then this app, then Settings, then Secrets.

1. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.
2. Redeploy the app.

Until `MCP_AUTH_TOKEN` is set, `/mcp` returns 503. There is no default token.


## Connect

URL: `https://<your-app>.wasmer.app/mcp`

```json
{
  "mcpServers": {
    "codeburn": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http codeburn https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/getagentseal/codeburn.git version 0.9.28, MIT. Integrity: `sha512-fl9u2m2n8n+cY6FheIY/jthw4GeuUtM38NfX3KR3Ljj2X7GFcUCfCGeRrnIaaM+aqmMLOw70Uy2BGnzoQgQlPQ==`.
