import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "tavily-mcp", "build/index.js");
startMcpHttp({
  ...{
  "title": "tavily-mcp",
  "repository": "git+https://github.com/tavily-ai/tavily-mcp.git",
  "license": "MIT",
  "packageName": "tavily-mcp",
  "version": "0.2.15",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "tavily-mcp over Streamable HTTP. Callers send a bearer token.",
  "slug": "tavily-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
