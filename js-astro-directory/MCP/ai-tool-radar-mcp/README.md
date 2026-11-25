# ai-tool-radar-mcp

A local MCP server for the [Rise of Machine](https://riseofmachine.com) AI tools directory. It turns the site's read-only API into MCP tools, so clients (Claude Desktop, Cursor, VS Code, Gemini CLI, and any MCP client) answer from the live catalog instead of model memory.

No API key. The directory API is public and read-only.

## How it works

Each API endpoint maps to one MCP tool, discovered at startup from `tools/rom/`. To add an endpoint, add a file. The server runs over stdio.

### Prerequisites

Requires [Bun](https://bun.sh/) ≥ 1.2. The server is Bun-native, so launch it with `bunx`, not `npx`. Node is not supported.

## Configure your client

Every client uses the same server. Point `command` at `bunx`, or its absolute path (`which bunx`) if the client cannot find it on `PATH`.

```json
{
  "mcpServers": {
    "ai-tool-radar": {
      "command": "bunx",
      "args": ["ai-tool-radar-mcp"]
    }
  }
}
```

Config file locations:

- Claude Desktop: Settings > Developer > Edit Config (`claude_desktop_config.json`)
- Cursor: `~/.cursor/mcp.json`, or `.cursor/mcp.json` per project
- Gemini CLI: `~/.gemini/settings.json`

Restart the client after editing its config.

### VS Code

Use `.vscode/mcp.json` (workspace) or your user `mcp.json`, with a `servers` key:

```json
{
  "servers": {
    "ai-tool-radar": {
      "command": "bunx",
      "args": ["ai-tool-radar-mcp"]
    }
  }
}
```

## Tools

| Tool | Description |
| --- | --- |
| `list_tools` | Tool summaries, newest first, paginated (24 per page). |
| `get_all_tools` | Every tool with full records in one call. Large response. |
| `get_tool` | A single tool by slug, with its full description and related tools. |
| `list_categories` | All categories with tool counts. |
| `list_tools_by_category` | Tools in a category, paginated. |
| `search_tools` | Search by name or feature. |

To print the live catalog, run `bun run list-tools`.

---

[MIT License](./LICENSE) · By [@planetabhi](https://planetabhi.com/)
