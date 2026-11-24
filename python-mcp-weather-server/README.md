# Weather MCP Server (in-process)

Rank 913 from the MCP registry queue. The upstream package is `mcp-weather-server` 0.6.1.

## What it does

This template runs the weather server inside the same Python process as the Wasmer HTTP front. A client can ask for the current weather in a city, the air quality, or the time in a timezone. Forecast numbers come from the public Open-Meteo service, so the person deploying it does not paste an API key. Every MCP call still needs `MCP_AUTH_TOKEN`, because the URL is public and would otherwise spend the app's network quota for anyone.

## Tools

- `get_current_weather`
- `get_weather_byDateTimeRange`
- `get_weather_details`
- `get_current_datetime`
- `get_timezone_info`
- `convert_time`
- `get_air_quality`
- `get_air_quality_details`

The landing page shows the live list from `tools/list`.

## Setup

Wasmer does not ask for secrets on the deploy-from-template page. After the app exists:

1. Open wasmer.io, then this app, then Settings, then Secrets.
2. Add `MCP_AUTH_TOKEN`. Create a value with `openssl rand -hex 32`.
3. Redeploy the app.

Until that secret is set, `/mcp` returns 503 and the home page names the missing variable. There is no default token and no upstream API key. Clients send `Authorization: Bearer <token>`.

## Connect

URL: `https://<your-app>.wasmer.app/mcp`

Claude Desktop and Cursor (`mcp.json`):

```json
{
  "mcpServers": {
    "weather": {
      "url": "https://<your-app>.wasmer.app/mcp",
      "headers": {"Authorization": "Bearer <MCP_AUTH_TOKEN>"}
    }
  }
}
```

Claude Code:

```bash
claude mcp add --transport http weather https://<your-app>.wasmer.app/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

ChatGPT: add an MCP connector with that URL and the same bearer header.

## Limits

The tools only read public weather and time data. Nothing is switched off. If `MCP_AUTH_TOKEN` is missing, `/mcp` returns 503 and the home page says so.

## License and source

Upstream: https://github.com/isdaniel/mcp_weather_server version 0.6.1, Apache-2.0. The PyPI `Source` URL matches that repository. Wheel sha256 `049948f33f79c172dcaa64a845ef91ec7b64a7141919f122e9c1ecbaf8c6c6f9`. No `v0.6.1` git tag was published (tags stop at `v0.6.0`). Adapter: in-process. Registry name: `io.github.isdaniel/mcp_weather_server`.
