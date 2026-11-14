"""An MCP server for ChatGPT on Wasmer Edge.

ChatGPT connectors and deep research call two tools, `search` and `fetch`. This server answers them from
`records.json` (sample cupcake orders); swap in your own data source. The MCP endpoint is `/mcp`
(Streamable HTTP); `/` is a short page for people who open the URL in a browser.
"""

import html
import json
import os
from pathlib import Path

from mcp.server.mcpserver import MCPServer
from pydantic import BaseModel
from starlette.requests import Request
from starlette.responses import HTMLResponse, Response

HERE = Path(__file__).parent
RECORDS: list[dict] = json.loads((HERE / "records.json").read_text())
LOOKUP = {record["id"]: record for record in RECORDS}


class SearchResult(BaseModel):
    id: str
    title: str
    text: str


class SearchResults(BaseModel):
    results: list[SearchResult]


class Document(BaseModel):
    id: str
    title: str
    text: str
    url: str | None = None
    metadata: dict[str, str] | None = None


mcp = MCPServer(name="Cupcake orders", instructions="Search and read cupcake orders.")

# Stateless JSON responses suit Edge instances that scale out. Binding to all interfaces turns off the
# localhost-only Host check, so requests to your *.wasmer.app hostname are accepted.
HTTP_OPTIONS = {"host": "0.0.0.0", "stateless_http": True, "json_response": True}


@mcp.tool()
def search(query: str) -> SearchResults:
    """Search cupcake orders by keyword. Returns matching order IDs, titles and summaries."""
    tokens = query.lower().split()
    results = []
    for record in RECORDS:
        haystack = " ".join(
            [record.get("title", ""), record.get("text", ""), " ".join(record.get("metadata", {}).values())]
        ).lower()
        if any(token in haystack for token in tokens):
            results.append(SearchResult(id=record["id"], title=record.get("title", ""), text=record.get("text", "")))
    return SearchResults(results=results)


@mcp.tool()
def fetch(id: str) -> Document:
    """Fetch the full cupcake order with this ID."""
    record = LOOKUP.get(id)
    if record is None:
        raise ValueError(f"Unknown order id: {id}")
    return Document(
        id=record["id"],
        title=record.get("title", ""),
        text=record.get("text", ""),
        url=record.get("url"),
        metadata=record.get("metadata"),
    )


@mcp.custom_route("/", methods=["GET"])
async def home(request: Request) -> HTMLResponse:
    scheme = request.headers.get("x-forwarded-proto", request.url.scheme)
    if scheme not in {"http", "https"}:
        scheme = request.url.scheme
    endpoint = html.escape(f"{scheme}://{request.url.netloc}/mcp")
    return HTMLResponse(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>MCP server for ChatGPT on Wasmer Edge</title><script type="module" src="/starter-ui.js"></script><style>body{{margin:0}}ul{{margin:0}}</style></head>
<body><wasmer-starter><wasmer-card>
<wasmer-stack slot="header" vertical><wasmer-badge>Python MCP</wasmer-badge>
<wasmer-title>Your MCP server is live on Wasmer Edge</wasmer-title></wasmer-stack>
<wasmer-text>Add this URL to ChatGPT as a connector (no authentication), then ask "How many cupcakes did Alice order?"</wasmer-text>
<wasmer-text><code>{endpoint}</code></wasmer-text>
<ul>
<li><code>search(query)</code> finds orders by keyword</li>
<li><code>fetch(id)</code> returns a full order</li>
<li>{len(RECORDS)} sample orders in <code>records.json</code></li>
</ul>
<wasmer-stack><wasmer-action variant="outline" href="https://docs.wasmer.io/edge" target="_blank">Wasmer Edge docs</wasmer-action></wasmer-stack>
<wasmer-text slot="footer">MCP for ChatGPT starter for Wasmer Edge</wasmer-text>
</wasmer-card></wasmer-starter></body></html>""")


@mcp.custom_route("/starter-ui.js", methods=["GET"])
async def starter_ui(request: Request) -> Response:
    return Response((HERE / "starter-ui.js").read_text(), media_type="text/javascript")


app = mcp.streamable_http_app(**HTTP_OPTIONS)

if __name__ == "__main__":
    mcp.run(transport="streamable-http", port=int(os.environ.get("PORT", "8000")), **HTTP_OPTIONS)
