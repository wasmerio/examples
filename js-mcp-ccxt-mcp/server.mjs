import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "ccxt-mcp", "js/server.js");
startMcpHttp({
  ...{
  "title": "CCXT",
  "repository": "git+https://github.com/ccxt/ccxt.git",
  "license": "MIT",
  "packageName": "ccxt-mcp",
  "version": "0.1.3",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "CCXT over Streamable HTTP. Callers send a bearer token.",
  "slug": "ccxt-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
