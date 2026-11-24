# Time MCP Server (stdio bridge)

Rank 853 from the MCP registry queue. The package is `time-mcp` 1.0.6. Its published entry starts a stdio server and does not export a server object, so this template bridges that process to Streamable HTTP.

## What it does

The server tells an MCP client the current time, converts timestamps, and answers small calendar questions such as the number of days in a month. It does not read a filesystem, run a shell, or call a paid API. The HTTP front requires `MCP_AUTH_TOKEN` so a public Wasmer URL is not an open relay.

## Tools

The package README names `current_time`, `relative_time`, `days_in_month`, `get_timestamp`, `convert_time`, and `get_week_year`. The landing page shows the list the running process returns from `tools/list`.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists:

1. Open wasmer.io, then this app, then Settings, then Secrets.
2. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.
3. Redeploy the app.

Until that secret is set, `/mcp` returns 503 and the home page names the missing variable. There is no default token and no upstream API key. Clients send `Authorization: Bearer <token>`.

## Connect

URL: `https://<your-app>.wasmer.app/mcp`

Claude Desktop and Cursor:

```json
{
  "mcpServers": {
    "time": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

Claude Code:

```bash
claude mcp add --transport http time https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

ChatGPT: add an MCP connector with that URL and the same bearer header.

## Limits

Read-only time calculations. One stdio child is reused for the life of the instance and started again if it exits. After the app scales to zero, the next client must initialize again, which the official MCP client does on its own.

## License and source

Upstream: https://github.com/yokingma/time-mcp version 1.0.6, MIT. npm `repository` matches that GitHub repo. dist integrity `sha512-otp8QvRD/tMqnHH/q9S9vxkppXRhDHpZNyYiRJXtn2/Qwbt9zMi6ekDdV53Jn1w+A9I9r9WiKx7xgo3Jcv8qUw==`. npm gitHead `ffcba503c1ae0471dfb687b7e6b361b2f77f1eeb`. Adapter: stdio-bridge.
