import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "firecrawl-mcp", "dist/index.js");
startMcpHttp({
  ...{
  "title": "Firecrawl MCP Server",
  "repository": "git+https://github.com/firecrawl/firecrawl-mcp-server.git",
  "license": "MIT",
  "packageName": "firecrawl-mcp",
  "version": "3.41.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "Firecrawl MCP Server over Streamable HTTP. Callers send a bearer token.",
  "slug": "firecrawl-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
