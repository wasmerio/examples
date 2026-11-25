import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "socraticode", "dist/index.js");
startMcpHttp({
  ...{
  "title": "socraticode",
  "repository": "git+https://github.com/giancarloerra/socraticode.git",
  "license": "AGPL-3.0-only",
  "packageName": "socraticode",
  "version": "1.16.2",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "socraticode over Streamable HTTP. Callers send a bearer token.",
  "slug": "socraticode",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...[]],
});
