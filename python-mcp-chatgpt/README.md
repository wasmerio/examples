# Cupcake MCP Server + Wasmer

This example shows how to run a **Model Context Protocol (MCP) server** for ChatGPT on **Wasmer Edge**.

> ℹ️ MCP servers connected to ChatGPT should expose at least **two tools**—`search` and `fetch`—so ChatGPT can both discover content and then retrieve specific items.

## Demo

`https://mcp-chatgpt-starter.wasmer.app/sse`

Add it to ChatGPT as a connector (no auth), and then just ask ChatGPT to interact with it:

```
How many cupcakes Alice ordered?
```

## How it Works

All logic lives in **`server.py`**, but you can think of it in sections:

### Data Section

The server loads cupcake records from a local `records.json` file and builds a lookup dictionary:

```python
RECORDS = json.loads(Path(__file__).with_name("records.json").read_text())
LOOKUP = {r["id"]: r for r in RECORDS}
```

### Models Section

We define Pydantic models to structure responses:

* `SearchResult` and `SearchResultPage` for search results.
* `FetchResult` for full cupcake order details.

### Tools Section

Two MCP tools are exposed via `FastMCP`:

* **`search(query: str)`**
  Splits the query into tokens, performs keyword matching across `title`, `text`, and `metadata`, and returns a list of matching results.

* **`fetch(id: str)`**
  Retrieves a single cupcake order by ID from the lookup dictionary and returns full details, including optional `url` and `metadata`.

### Entrypoint Section

At the bottom of `server.py`, the app is created and run:

```python
app = create_server()

if __name__ == "__main__":
    app.run(transport="sse")
```

The server uses **Server-Sent Events (SSE)** to communicate with ChatGPT’s MCP integration.

## Running Locally

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
python server.py
```

Your MCP server will now be running and ready for connections from an MCP client (like ChatGPT with MCP enabled).

## Example Tools in Action

* **Search tool** (`search("red velvet")`)
  Returns a list of cupcake orders that mention “red velvet.”

* **Fetch tool** (`fetch("42")`)
  Returns the full details of order `42`, including text, metadata, and an optional URL.

## Deploying to Wasmer (Overview)

1. Include both `server.py` and `records.json` in your project.
2. Deploy to Wasmer, ensuring the entrypoint is `server.py`.
3. Access it at:
   `https://<your-subdomain>.wasmer.app/sse`

