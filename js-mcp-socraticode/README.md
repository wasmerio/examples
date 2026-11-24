# socraticode

## What it does

This template runs `socraticode` 1.16.2 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. MCP server for enterprise local codebase indexing, semantic search, and code dependency graphs.

## Tools

The landing page lists the tools returned by `tools/list` after the app is deployed.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists, open wasmer.io, then this app, then Settings, then Secrets.

1. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.
2. Redeploy the app.

Until `MCP_AUTH_TOKEN` is set, `/mcp` returns 503. There is no default token.

Upstream tools may also read `EMBEDDING_PROVIDER`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `OLLAMA_URL`, `EMBEDDING_MODEL`, `EMBEDDING_DIMENSIONS`, `OLLAMA_MODE`, `OLLAMA_API_KEY`, `LMSTUDIO_URL`, `LMSTUDIO_API_KEY`, `LMSTUDIO_ALLOW_MISSING_MODEL_LISTING`, `LITELLM_URL`, `LITELLM_API_KEY`, `LITELLM_SEND_DIMENSIONS`, `QDRANT_MODE`, `QDRANT_URL`, `QDRANT_API_KEY`. Add those on the same Secrets screen when a tool tells you to set them. `/mcp` still lists tools with only `MCP_AUTH_TOKEN` set.


## Connect

URL: `https://<your-app>.wasmer.app/mcp`

```json
{
  "mcpServers": {
    "socraticode": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http socraticode https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/giancarloerra/socraticode.git version 1.16.2, AGPL-3.0-only. Integrity: `sha512-TkJIwaLnoOBKfjyLczsAJKgiqGjWCoHc8nZP0AQjp2xLm/jwG8juiEsBsEXCNm+QpNFRH16tDIz3iVveF8PRBg==`.
