import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "@upstash/context7-mcp", "dist/index.js");
startMcpHttp({
  ...{
  "title": "Context7",
  "repository": "git+https://github.com/upstash/context7.git",
  "license": "MIT",
  "packageName": "@upstash/context7-mcp",
  "version": "4.7.3",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "Context7 over Streamable HTTP. Callers send a bearer token.",
  "slug": "context7-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry],
});
