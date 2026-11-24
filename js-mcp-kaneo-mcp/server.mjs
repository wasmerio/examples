import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "@kaneo/mcp", "dist/index.js");
startMcpHttp({
  ...{
  "title": "@kaneo/mcp",
  "repository": "git+https://github.com/usekaneo/kaneo.git",
  "license": "MIT",
  "packageName": "@kaneo/mcp",
  "version": "0.1.14",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "@kaneo/mcp over Streamable HTTP. Callers send a bearer token.",
  "slug": "kaneo-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
