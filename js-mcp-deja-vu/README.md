# @vshulcz/deja-vu

## What it does

This template runs `@vshulcz/deja-vu` 0.25.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Local memory & session search across fifty-two coding agents: Claude Code, Codex, Cursor.

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
    "deja-vu": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http deja-vu https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/vshulcz/deja-vu.git version 0.25.0, MIT. Integrity: `sha512-5doWZGMsTS+ex8V898gt5ZHxyaW8Zx7xI1UfXm4fy7dVxj7ICSDxRDlVNhabBm6S1RjpB6JsibI/JG7l0hQtTA==`.
