import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "codebase-memory-mcp", "bin.js");
startMcpHttp({
  ...{
  "title": "Codebase Memory",
  "repository": "git+https://github.com/DeusData/codebase-memory-mcp.git",
  "license": "MIT",
  "packageName": "codebase-memory-mcp",
  "version": "0.12.1",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "Codebase Memory over Streamable HTTP. Callers send a bearer token.",
  "slug": "codebase-memory-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
