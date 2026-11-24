# Firecrawl MCP Server

## What it does

This template runs `firecrawl-mcp` 3.41.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Firecrawl, the context API for AI agents: search, scrape, interact with the web, plus paper search.

## Tools

The landing page lists the tools returned by `tools/list` after the app is deployed.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists, open wasmer.io, then this app, then Settings, then Secrets.

1. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.
2. Redeploy the app.

Until `MCP_AUTH_TOKEN` is set, `/mcp` returns 503. There is no default token.

Upstream tools may also read `FIRECRAWL_API_KEY`. Add those on the same Secrets screen when a tool tells you to set them. `/mcp` still lists tools with only `MCP_AUTH_TOKEN` set.


## Connect

URL: `https://<your-app>.wasmer.app/mcp`

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http firecrawl-mcp https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/firecrawl/firecrawl-mcp-server.git version 3.41.0, MIT. Integrity: `sha512-0plVcnUV87FC0YPqd72Wu7tGXzjWVfhQacRsPP+RKWv1NaXlFbWiJCPPeSt1cCn5wI8F1I/D8giiBeaV9KmSVg==`.
