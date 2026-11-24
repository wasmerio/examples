# Codebase Memory

## What it does

This template runs `codebase-memory-mcp` 0.12.1 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Codebase knowledge graph for AI agents — 162 languages, sub-ms queries, 99% fewer tokens.

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
    "codebase-memory-mcp": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http codebase-memory-mcp https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/DeusData/codebase-memory-mcp.git version 0.12.1, MIT. Integrity: `sha512-vLLMOw2q91CphuMK3FrUJoimPDhQqD6LpfUDvTAdPbNz+MP+3YKlaX/2foI0l5zKWQvs7gM+UDUH7f+ObrHbQQ==`.
