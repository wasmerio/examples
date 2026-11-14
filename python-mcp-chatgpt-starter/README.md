# MCP server for ChatGPT starter for Wasmer Edge

A Python Model Context Protocol (MCP) server with the `search` and `fetch` tools ChatGPT connectors use. It answers from sample cupcake orders in `records.json`; swap in your own data.

After its catalog entry is registered, [deploy this template](https://wasmer.io/templates/mcp-chatgpt-starter) from the Wasmer templates page. This source change does not register the catalog entry.

## How it works

- `main.py` defines the server with the official MCP Python SDK and two tools, `search(query)` and `fetch(id)`.
- The MCP endpoint is `/mcp` (Streamable HTTP, stateless JSON responses). `/` shows the URL to copy.
- Wasmer detects the ASGI app and runs `uvicorn main:app`.

To connect it, open ChatGPT settings, add a connector with your app's `/mcp` URL and no authentication, then ask "How many cupcakes did Alice order?"

## Run it locally

```bash
uv sync
uv run uvicorn main:app --reload
```

Then open http://localhost:8000/.

Run the tests with `uv run pytest`.
