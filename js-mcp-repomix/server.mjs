import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "repomix", "bin/repomix.cjs");
startMcpHttp({
  ...{
  "title": "Repomix",
  "repository": "git://github.com/yamadashy/repomix.git",
  "license": "MIT",
  "packageName": "repomix",
  "version": "1.19.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "Repomix over Streamable HTTP. Callers send a bearer token.",
  "slug": "repomix",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...["--mcp"]],
});
