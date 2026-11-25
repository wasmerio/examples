import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "@vshulcz/deja-vu", "bin/deja");
startMcpHttp({
  ...{
  "title": "@vshulcz/deja-vu",
  "repository": "git+https://github.com/vshulcz/deja-vu.git",
  "license": "MIT",
  "packageName": "@vshulcz/deja-vu",
  "version": "0.25.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "@vshulcz/deja-vu over Streamable HTTP. Callers send a bearer token.",
  "slug": "deja-vu",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...["mcp"]],
});
