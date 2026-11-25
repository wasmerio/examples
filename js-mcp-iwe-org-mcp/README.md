# IWE (iwe.md)

## What it does

This template runs `@iwe-org/mcp` 0.35.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Markdown knowledge base as agent memory. Runs against the notes directory it is started in.

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
    "iwe-org-mcp": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http iwe-org-mcp https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/iwe-org/iwe.git version 0.35.0, Apache-2.0. Integrity: `sha512-/fnA7/ZYtTeZ0MNRpqfQ9kk66Aof2AmTq78Z+alv/ViTxMoowERRJYst1iGWULX4pM/G5ja8rlsgKxG6vUurLA==`.
