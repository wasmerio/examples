# Repomix

## What it does

This template runs `repomix` 1.19.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Pack local or remote codebases into AI-friendly files that LLMs and coding agents can read or search

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
    "repomix": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http repomix https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git://github.com/yamadashy/repomix.git version 1.19.0, MIT. Integrity: `sha512-MzzbJjbZ4OmcBDzMFNM41FxtMxQANsEcjnOpJB9X4fYJZVxuU70t3v8rRXwOqSTj9629ZOQqi9k7zEsBCPElSA==`.
