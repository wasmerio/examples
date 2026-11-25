import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "e2e", "dist/cli/bin.js");
startMcpHttp({
  ...{
  "title": "e2e",
  "repository": "git+https://github.com/e2e-inc/e2e.git",
  "license": "Apache-2.0",
  "packageName": "e2e",
  "version": "0.24.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "e2e over Streamable HTTP. Callers send a bearer token.",
  "slug": "e2e",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...["mcp"]],
});
