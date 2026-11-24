# webclaw

## What it does

This template runs `@webclaw/mcp` 0.7.1 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Web scraping, search, crawling, structured extraction and research for AI agents.

## Tools

The landing page lists the tools returned by `tools/list` after the app is deployed.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists, open wasmer.io, then this app, then Settings, then Secrets.

1. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.
2. Redeploy the app.

Until `MCP_AUTH_TOKEN` is set, `/mcp` returns 503. There is no default token.

Upstream tools may also read `WEBCLAW_API_KEY`. Add those on the same Secrets screen when a tool tells you to set them. `/mcp` still lists tools with only `MCP_AUTH_TOKEN` set.


## Connect

URL: `https://<your-app>.wasmer.app/mcp`

```json
{
  "mcpServers": {
    "webclaw-mcp": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http webclaw-mcp https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/0xMassi/webclaw.git version 0.7.1, AGPL-3.0-only. Integrity: `sha512-JAxMVE3vqvV5dHvuIhpT0Az+c5aiFwdIYg1R4y/H2u9kgsxNAYyFyZBME5+XUpS6/9b33fd004j9yQj5d8e4Uw==`.
