import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "@iwe-org/mcp", "bin/iwe-mcp.js");
startMcpHttp({
  ...{
  "title": "IWE (iwe.md)",
  "repository": "git+https://github.com/iwe-org/iwe.git",
  "license": "Apache-2.0",
  "packageName": "@iwe-org/mcp",
  "version": "0.35.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "IWE (iwe.md) over Streamable HTTP. Callers send a bearer token.",
  "slug": "iwe-org-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...[]],
});
