# @mobilenext/mobile-mcp

## What it does

This template runs `@mobilenext/mobile-mcp` 1.0.19 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. MCP server for iOS and Android Mobile Development, Automation and Testing

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
    "mobile-mcp": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http mobile-mcp https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/mobile-next/mobile-mcp.git version 1.0.19, Apache-2.0. Integrity: `sha512-UZ2XGVe2vc/P9IXyQXcffkqg5KIGk/RjsXeGDEeLNzH8QFAM9yJLrbiGAl8C+31iHZgi5kxY4abTk9hfN7NRVg==`.
