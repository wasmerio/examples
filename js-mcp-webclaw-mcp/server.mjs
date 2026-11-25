import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "@webclaw/mcp", "webclaw-mcp.mjs");
startMcpHttp({
  ...{
  "title": "webclaw",
  "repository": "git+https://github.com/0xMassi/webclaw.git",
  "license": "AGPL-3.0-only",
  "packageName": "@webclaw/mcp",
  "version": "0.7.1",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "webclaw over Streamable HTTP. Callers send a bearer token.",
  "slug": "webclaw-mcp",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...[]],
});
