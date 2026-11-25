import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const { startMcpHttp } = await import(pathToFileURL(path.join(here, 'mcp-http', 'app.mjs')).href);
const entry = path.join(here, 'node_modules', 'time-mcp', 'dist', 'index.js');

startMcpHttp({
  title: 'Time MCP Server',
  repository: 'https://github.com/yokingma/time-mcp',
  license: 'MIT',
  packageName: 'time-mcp',
  version: '1.0.6',
  requiredEnv: ['MCP_AUTH_TOKEN'],
  adapter: 'stdio-bridge',
  summary: 'Current time, timestamps, and calendar dates for an MCP client. No API key and no access to your files.',
  slug: 'time',
  command: process.execPath,
  args: [entry],
  limits: 'Read-only time calculations. Nothing here changes a machine or a repository.',
});
