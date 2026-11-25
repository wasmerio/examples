# e2e

## What it does

This template runs `e2e` 0.24.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Open live web and mobile app sessions from an e2e project to inspect the app and try locators.

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
    "e2e": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http e2e https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/e2e-inc/e2e.git version 0.24.0, Apache-2.0. Integrity: `sha512-hDM22qWiRzlBnJJRDs9vbBfJM8X3KK5xFTj5S/bdYcI7An1BHD6pvcpkd/t1+Ysg8U56ygqVr46vEIN0vW3wKg==`.
