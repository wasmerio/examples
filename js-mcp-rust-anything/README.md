# rust-anything

## What it does

This template runs `rust-anything` 2.1.0 as a public Streamable HTTP MCP endpoint on Wasmer Edge. Callers must send a bearer token. Rewrite an app in Rust one piece at a time, checked against the original's recorded behavior.

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
    "rust-anything": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

```bash
claude mcp add --transport http rust-anything https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

Cursor uses the same JSON. ChatGPT connectors use the URL and the same bearer header.

## Limits

Adapter: stdio-bridge. Disabled tools: none.

## License and source

Upstream: git+https://github.com/erkamyaman/rust-anything.git version 2.1.0, MIT. Integrity: `sha512-3djIcDXD5kQIQJRnR/4dtiBZYoKf6pKnPaU38AuhxN5HBpZfnyedOSUDdAqQA5uFQ/rSuDJvA4GVfVjUUXZV9w==`.
