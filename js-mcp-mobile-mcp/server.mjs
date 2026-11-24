import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "@mobilenext/mobile-mcp", "lib/index.js");
startMcpHttp({
  ...{
  "title": "@mobilenext/mobile-mcp",
  "repository": "git+https://github.com/mobile-next/mobile-mcp.git",
  "license": "Apache-2.0",
  "packageName": "@mobilenext/mobile-mcp",
  "version": "1.0.19",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "@mobilenext/mobile-mcp over Streamable HTTP. Callers send a bearer token.",
  "slug": "mobile-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
