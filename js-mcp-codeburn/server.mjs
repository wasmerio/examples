import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "codeburn", "dist/cli.js");
startMcpHttp({
  ...{
  "title": "CodeBurn",
  "repository": "git+https://github.com/getagentseal/codeburn.git",
  "license": "MIT",
  "packageName": "codeburn",
  "version": "0.9.28",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "CodeBurn over Streamable HTTP. Callers send a bearer token.",
  "slug": "codeburn",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...["mcp"]],
});
