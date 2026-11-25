import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);

const entry = path.join(here, 'node_modules', "rust-anything", "bin/rust-anything.js");
startMcpHttp({
  ...{
  "title": "rust-anything",
  "repository": "git+https://github.com/erkamyaman/rust-anything.git",
  "license": "MIT",
  "packageName": "rust-anything",
  "version": "2.1.0",
  "requiredEnv": [
    "MCP_AUTH_TOKEN"
  ],
  "summary": "rust-anything over Streamable HTTP. Callers send a bearer token.",
  "slug": "rust-anything",
  "limits": "No write tools are switched off.",
  "adapter": "stdio-bridge"
},
  command: process.execPath,
  args: [entry, ...["mcp"]],
});
