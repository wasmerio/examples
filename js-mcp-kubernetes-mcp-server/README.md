# kubernetes-mcp-server

## What it does

This template runs `kubernetes-mcp-server` 0.1.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. A Model Context Protocol (MCP) server for Kubernetes and OpenShift

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
    "kubernetes-mcp-server": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http kubernetes-mcp-server https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/containers/kubernetes-mcp-server.git version 0.1.0, Apache-2.0. Integrity: `sha512-Z1KkiOKvYt9MlThIhtRd8U2kUSdJv3bWEmrh23GY66tkWdbkrUEpE9xWPIw+ABAWyym3i3mU3uMmoYSzDB8GDg==`.
