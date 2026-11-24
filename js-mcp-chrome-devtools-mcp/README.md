# Chrome DevTools MCP

## What it does

This template runs `chrome-devtools-mcp` 1.13.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. MCP server for Chrome DevTools

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
    "chrome-devtools-mcp": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http chrome-devtools-mcp https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/ChromeDevTools/chrome-devtools-mcp.git version 1.13.0, Apache-2.0. Integrity: `sha512-Yf4qhS0+2oo7c+gOySMDHQt4ZL/yKXG2Mxxzjk0gcArINtcQ3tLiQVzAW6g2nsyQzAGhkcLwWWBAtlx3Bg+Spg==`.
