import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "chrome-devtools-mcp", "out/Default/gen/src/bin/chrome-devtools-mcp.js");
startMcpHttp({
  ...{
  "title": "Chrome DevTools MCP",
  "repository": "git+https://github.com/ChromeDevTools/chrome-devtools-mcp.git",
  "license": "Apache-2.0",
  "packageName": "chrome-devtools-mcp",
  "version": "1.13.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "Chrome DevTools MCP over Streamable HTTP. Callers send a bearer token.",
  "slug": "chrome-devtools-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...[]],
});
