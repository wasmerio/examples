import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) return '';
  return process.argv[index + 1];
}

const url = arg('--url');
const token = arg('--token');
const tool = arg('--tool');
const toolArgsRaw = arg('--args') || '{}';
const started = Date.now();
const report = {
  url,
  ok: false,
  initialize: 'not run',
  tools: [],
  tool: tool ? { name: tool, ok: false, outputBytes: 0 } : null,
  elapsedMs: 0,
  error: null,
};

function finish(code) {
  report.elapsedMs = Date.now() - started;
  console.log(JSON.stringify(report));
  process.exit(code);
}

if (!url || !token) {
  report.error = 'Pass --url and --token. Optional: --tool name --args \'{}\'';
  finish(1);
}

let toolArgs = {};
try {
  toolArgs = JSON.parse(toolArgsRaw);
} catch (error) {
  report.error = '--args is not JSON: ' + error.message;
  finish(1);
}

const transport = new StreamableHTTPClientTransport(new URL(url), {
  requestInit: { headers: { Authorization: 'Bearer ' + token } },
});
const client = new Client({ name: 'mcp-template-check', version: '0.1.0' });
const timeout = { timeout: 120000 };

try {
  await client.connect(transport);
  report.initialize = 'passed';
  const listed = await client.listTools(undefined, timeout);
  report.tools = listed.tools.map((item) => item.name);
  report.toolSchemas = listed.tools.map((item) => ({
    name: item.name,
    description: item.description || '',
    schema: item.inputSchema || null,
  }));
  if (tool) {
    const result = await client.callTool({ name: tool, arguments: toolArgs }, CallToolResultSchema, timeout);
    const text = JSON.stringify(result);
    report.tool = { name: tool, ok: !result.isError, outputBytes: Buffer.byteLength(text), isError: Boolean(result.isError) };
    if (result.isError) report.error = text.slice(0, 500);
  }
  report.ok = report.tool ? report.tool.ok : true;
  await client.close();
  finish(report.ok ? 0 : 1);
} catch (error) {
  report.error = error && error.message ? error.message : String(error);
  try {
    await client.close();
  } catch {
    // The failed session may already be closed.
  }
  finish(1);
}
