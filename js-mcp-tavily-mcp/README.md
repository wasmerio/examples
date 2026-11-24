# tavily-mcp

## What it does

This template runs `tavily-mcp` 0.2.15 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. MCP server for advanced web search using Tavily

## Tools

The landing page lists the tools returned by `tools/list` after the app is deployed.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists, open wasmer.io, then this app, then Settings, then Secrets.

1. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.
2. Redeploy the app.

Until `MCP_AUTH_TOKEN` is set, `/mcp` returns 503. There is no default token.

Upstream tools may also read `TAVILY_API_KEY`, `DEFAULT_PARAMETERS`. Add those on the same Secrets screen when a tool tells you to set them. `/mcp` still lists tools with only `MCP_AUTH_TOKEN` set.


## Connect

URL: `https://<your-app>.wasmer.app/mcp`

```json
{
  "mcpServers": {
    "tavily-mcp": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http tavily-mcp https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/tavily-ai/tavily-mcp.git version 0.2.15, MIT. Integrity: `sha512-CfVVh74pCnErwSQvXIWHOpLnNlMtgt6rtVmVpZ8xUctDmLbTHpUvfDaFMcTWG1dHxNgQiXCmg+GCkUWLqXgKtQ==`.
