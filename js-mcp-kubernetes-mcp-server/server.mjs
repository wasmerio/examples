import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "kubernetes-mcp-server", "bin/index.js");
startMcpHttp({
  ...{
  "title": "kubernetes-mcp-server",
  "repository": "git+https://github.com/containers/kubernetes-mcp-server.git",
  "license": "Apache-2.0",
  "packageName": "kubernetes-mcp-server",
  "version": "0.1.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "kubernetes-mcp-server over Streamable HTTP. Callers send a bearer token.",
  "slug": "kubernetes-mcp-server",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
