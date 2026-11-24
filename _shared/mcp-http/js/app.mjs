/**
 * Auth-gated stateless Streamable HTTP for one upstream MCP server.
 *
 * Adapters, preferred in this order: native-http, in-process, stdio-bridge.
 * The stdio bridge keeps one child per instance and restarts it if it exits.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const uiPath = join(dirname(fileURLToPath(import.meta.url)), 'wasmer-starter-ui.js');

function requiredNames(names) {
  const ordered = ['MCP_AUTH_TOKEN'];
  for (const name of names || []) {
    if (!ordered.includes(name)) ordered.push(name);
  }
  return ordered;
}

function missingEnv(names) {
  return names.filter((name) => !process.env[name]);
}

function tokensMatch(presented, expected) {
  const left = createHash('sha256').update(presented).digest();
  const right = createHash('sha256').update(expected).digest();
  return timingSafeEqual(left, right);
}

function bearer(header) {
  if (!header || !header.startsWith('Bearer ')) return '';
  return header.slice('Bearer '.length);
}

function rpcError(id, code, message) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

function requestId(body) {
  if (body && typeof body === 'object' && !Array.isArray(body)) return body.id ?? null;
  return null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function publicBase(req) {
  const protoHeader = req.get('x-forwarded-proto') || req.protocol;
  const proto = protoHeader === 'http' || protoHeader === 'https' ? protoHeader : 'https';
  return proto + '://' + req.get('host');
}

function brief(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const cut = clean.split('. ')[0];
  const sentence = cut.length < clean.length ? cut + '.' : cut;
  return sentence.length > 160 ? sentence.slice(0, 157) + '...' : sentence;
}

function page(cfg, base, missing, tools, toolError) {
  const endpoint = base + '/mcp';
  const snippet = {
    mcpServers: {
      [cfg.slug]: {
        url: endpoint,
        headers: { Authorization: 'Bearer <MCP_AUTH_TOKEN>' },
      },
    },
  };
  const claude = 'claude mcp add --transport http ' + cfg.slug + ' ' + endpoint
    + ' --header "Authorization: Bearer <MCP_AUTH_TOKEN>"';
  const state = missing.length
    ? '<wasmer-notice variant="warning">Set these environment variables before calling /mcp: '
      + escapeHtml(missing.join(', ')) + '.</wasmer-notice>'
    : '<wasmer-notice variant="success">Required environment variables are set.</wasmer-notice>';
  let toolHtml = '<wasmer-text>No tools reported.</wasmer-text>';
  if (toolError) {
    toolHtml = '<wasmer-notice variant="error">' + escapeHtml(toolError) + '</wasmer-notice>';
  } else if (tools.length) {
    toolHtml = '<ul>' + tools.map((tool) => (
      '<li><strong>' + escapeHtml(tool.name) + '</strong> — ' + escapeHtml(brief(tool.description)) + '</li>'
    )).join('') + '</ul>';
  }
  const limits = cfg.limits || 'No write tools are switched off.';
  const secretNames = (cfg.requiredEnv && cfg.requiredEnv.length) ? cfg.requiredEnv : ['MCP_AUTH_TOKEN'];
  const setup = '<wasmer-text>Wasmer does not ask for secrets on the deploy page. Open wasmer.io, then this app, then Settings, then Secrets. Add '
    + escapeHtml(secretNames.join(', '))
    + '. Create MCP_AUTH_TOKEN with <strong>openssl rand -hex 32</strong>. Save the secrets and redeploy. Until they are set, /mcp returns 503.</wasmer-text>';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(cfg.title)}</title><script type="module" src="/wasmer-starter-ui.js"></script>
<style>body{margin:0}pre{overflow:auto;white-space:pre-wrap}</style></head>
<body><wasmer-starter><wasmer-card>
<wasmer-stack slot="header" vertical><wasmer-badge>MCP</wasmer-badge><wasmer-title>${escapeHtml(cfg.title)}</wasmer-title></wasmer-stack>
<wasmer-text>${escapeHtml(cfg.summary)}</wasmer-text>
${state}
${setup}
<wasmer-text>Tools</wasmer-text>
${toolHtml}
<wasmer-text>Connect to <strong>${escapeHtml(endpoint)}</strong> with header <strong>Authorization: Bearer &lt;MCP_AUTH_TOKEN&gt;</strong>.</wasmer-text>
<pre>${escapeHtml(JSON.stringify(snippet, null, 2))}</pre>
<pre>${escapeHtml(claude)}</pre>
<wasmer-text>Cursor uses the same JSON in its MCP settings. ChatGPT connectors use this URL and the same bearer header.</wasmer-text>
<wasmer-text>Limits: ${escapeHtml(limits)}</wasmer-text>
<wasmer-stack slot="footer">
<wasmer-action href="${escapeHtml(cfg.repository)}" variant="outline">Upstream source</wasmer-action>
<wasmer-text>${escapeHtml(cfg.packageName)} ${escapeHtml(cfg.version)} · ${escapeHtml(cfg.license)}</wasmer-text>
</wasmer-stack>
</wasmer-card></wasmer-starter></body></html>`;
}

class StdioBridge {
  constructor(command, args) {
    this.command = command;
    this.args = args;
    this.child = null;
    this.pending = new Map();
    this.buffer = '';
    this.stderr = [];
    this.error = '';
    this.chain = Promise.resolve();
  }

  start() {
    if (this.child && this.child.exitCode === null && !this.child.killed) return;
    const env = { ...process.env };
    delete env.MCP_AUTH_TOKEN;
    this.child = spawn(this.command, this.args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    this.error = '';
    this.buffer = '';
    this.child.stdout.on('data', (chunk) => this._onStdout(chunk));
    this.child.stderr.on('data', (chunk) => {
      const text = chunk.toString('utf8').trim();
      if (!text) return;
      this.stderr.push(text);
      this.stderr.splice(0, Math.max(0, this.stderr.length - 40));
      console.error('stdio: ' + text);
    });
    this.child.on('error', (error) => {
      this.error = 'Could not start stdio server: ' + error.message;
      this._failPending(this.error);
    });
    this.child.on('exit', () => {
      this._failPending(this.error || 'stdio server exited');
    });
  }

  stop() {
    if (this.child && this.child.exitCode === null) this.child.kill();
    this.child = null;
  }

  request(message) {
    const run = this.chain.then(() => this._request(message));
    this.chain = run.then(() => {}, () => {});
    return run;
  }

  _request(message) {
    this.start();
    if (!this.child || this.child.exitCode !== null) {
      return Promise.reject(new Error(this.error || 'stdio server is not running'));
    }
    const hasId = Object.prototype.hasOwnProperty.call(message, 'id') && message.id !== null;
    let pending;
    if (hasId) {
      pending = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(message.id);
          reject(new Error('stdio response timed out'));
        }, 60000);
        this.pending.set(message.id, {
          resolve: (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          reject: (error) => {
            clearTimeout(timer);
            reject(error);
          },
        });
      });
    }
    this.child.stdin.write(JSON.stringify(message) + '\n');
    return pending || Promise.resolve(null);
  }

  _onStdout(chunk) {
    this.buffer += chunk.toString('utf8');
    let index = this.buffer.indexOf('\n');
    while (index >= 0) {
      const line = this.buffer.slice(0, index).trim();
      this.buffer = this.buffer.slice(index + 1);
      if (line) {
        try {
          const message = JSON.parse(line);
          const waiter = this.pending.get(message.id);
          if (waiter) {
            this.pending.delete(message.id);
            waiter.resolve(message);
          }
        } catch {
          console.error('stdio non-json: ' + line.slice(0, 200));
        }
      }
      index = this.buffer.indexOf('\n');
    }
  }

  _failPending(reason) {
    this.error = reason;
    for (const waiter of this.pending.values()) waiter.reject(new Error(reason));
    this.pending.clear();
  }
}

class NativeHttp {
  constructor(command, args, port) {
    this.command = command;
    this.args = args;
    this.port = port;
    this.child = null;
    this.error = '';
    this.stderr = [];
  }

  async start() {
    if (this.child && this.child.exitCode === null && !this.error) return;
    const env = { ...process.env };
    delete env.MCP_AUTH_TOKEN;
    try {
      this.child = spawn(this.command, this.args, { env, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (error) {
      this.error = 'Could not start upstream HTTP server: ' + error.message;
      return;
    }
    this.child.stderr.on('data', (chunk) => {
      const text = chunk.toString('utf8').trim();
      if (!text) return;
      this.stderr.push(text);
      this.stderr.splice(0, Math.max(0, this.stderr.length - 40));
      console.error('upstream: ' + text);
    });
    this.child.on('error', (error) => {
      this.error = 'Could not start upstream HTTP server: ' + error.message;
    });
    const ready = await this._wait();
    if (!ready) {
      this.error = 'Upstream did not listen on 127.0.0.1:' + this.port + '. ' + this.stderr.slice(-5).join('; ');
    } else {
      this.error = '';
    }
  }

  stop() {
    if (this.child && this.child.exitCode === null) this.child.kill();
    this.child = null;
  }

  async _wait() {
    for (let attempt = 0; attempt < 150; attempt += 1) {
      if (this.child && this.child.exitCode !== null) return false;
      try {
        const response = await fetch('http://127.0.0.1:' + this.port + '/healthz', { signal: AbortSignal.timeout(300) });
        if (response.status < 500) return true;
      } catch {
        // The upstream may not have /healthz. A refused connection is the only failure that matters.
      }
      try {
        await fetch('http://127.0.0.1:' + this.port + '/', { signal: AbortSignal.timeout(300) });
        return true;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    return false;
  }
}

async function toolsFromMessages(message) {
  if (!message || message.error) {
    throw new Error(message?.error?.message || 'tools/list failed');
  }
  return (message.result?.tools || []).map((tool) => ({
    name: tool.name,
    description: tool.description || '',
  }));
}

async function listInProcess(createServer) {
  const server = await createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: 'landing', version: '0.0.0' });
  try {
    await client.connect(clientTransport);
    const listed = await client.listTools();
    return listed.tools.map((tool) => ({ name: tool.name, description: tool.description || '' }));
  } finally {
    await client.close().catch(() => {});
    await server.close().catch(() => {});
  }
}

async function listNative(port) {
  const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:' + port + '/mcp'));
  const client = new Client({ name: 'landing', version: '0.0.0' });
  try {
    await client.connect(transport);
    const listed = await client.listTools();
    return listed.tools.map((tool) => ({ name: tool.name, description: tool.description || '' }));
  } finally {
    await client.close().catch(() => {});
  }
}

async function listStdio(command, args) {
  const probe = new StdioBridge(command, args);
  try {
    await probe.request({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'landing', version: '0.0.0' },
      },
    });
    await probe.request({ jsonrpc: '2.0', method: 'notifications/initialized' });
    const message = await probe.request({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
    return await toolsFromMessages(message);
  } finally {
    probe.stop();
  }
}

function sendJson(res, status, body) {
  res.status(status).set('cache-control', 'no-store').json(body);
}

export function startMcpHttp(options) {
  const cfg = {
    title: options.title,
    repository: options.repository,
    license: options.license,
    packageName: options.packageName,
    version: options.version,
    summary: options.summary,
    slug: options.slug,
    limits: options.limits || '',
    requiredEnv: requiredNames(options.requiredEnv),
    adapter: options.adapter,
    createServer: options.createServer,
    command: options.command,
    args: options.args || [],
    upstreamPort: options.upstreamPort || 8765,
  };
  if (!['native-http', 'in-process', 'stdio-bridge'].includes(cfg.adapter)) {
    throw new Error('Unknown adapter: ' + cfg.adapter);
  }
  const native = cfg.adapter === 'native-http' ? new NativeHttp(cfg.command, cfg.args, cfg.upstreamPort) : null;
  const stdio = cfg.adapter === 'stdio-bridge' ? new StdioBridge(cfg.command, cfg.args) : null;
  const app = createMcpExpressApp({ host: '0.0.0.0' });

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get('/wasmer-starter-ui.js', (_req, res) => {
    res.type('text/javascript').send(readFileSync(uiPath));
  });

  app.get('/', async (req, res) => {
    const missing = missingEnv(cfg.requiredEnv);
    let tools = [];
    let toolError = '';
    if (!missing.length) {
      try {
        if (cfg.adapter === 'in-process') tools = await listInProcess(cfg.createServer);
        if (cfg.adapter === 'native-http') {
          await native.start();
          if (native.error) toolError = native.error;
          else tools = await listNative(cfg.upstreamPort);
        }
        if (cfg.adapter === 'stdio-bridge') tools = await listStdio(cfg.command, cfg.args);
      } catch (error) {
        toolError = error.message;
      }
    }
    res.status(200).set('cache-control', 'no-store').type('html').send(page(cfg, publicBase(req), missing, tools, toolError));
  });

  app.use('/mcp', (req, res, next) => {
    const missing = missingEnv(cfg.requiredEnv);
    if (missing.length) {
      sendJson(res, 503, rpcError(
        requestId(req.body),
        -32000,
        'Set these environment variables before calling /mcp: ' + missing.join(', '),
      ));
      return;
    }
    if (req.method !== 'POST') {
      res.status(405).set('allow', 'POST').type('text/plain').send('Method Not Allowed');
      return;
    }
    if (!tokensMatch(bearer(req.get('authorization')), process.env.MCP_AUTH_TOKEN)) {
      sendJson(res, 401, rpcError(requestId(req.body), -32001, 'Unauthorized'));
      return;
    }
    next();
  });

  app.post('/mcp', async (req, res) => {
    try {
      if (cfg.adapter === 'in-process') {
        const server = await cfg.createServer();
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
          enableJsonResponse: true,
        });
        res.on('close', () => {
          void transport.close();
          void server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        return;
      }
      if (cfg.adapter === 'native-http') {
        await native.start();
        if (native.error) {
          sendJson(res, 502, rpcError(requestId(req.body), -32002, native.error));
          return;
        }
        await proxyNative(cfg.upstreamPort, req, res);
        return;
      }
      const message = req.body;
      if (!message || typeof message !== 'object' || Array.isArray(message)) {
        sendJson(res, 400, rpcError(null, -32600, 'Invalid request'));
        return;
      }
      const response = await stdio.request(message);
      if (!response) {
        res.status(202).end();
        return;
      }
      sendJson(res, 200, response);
    } catch (error) {
      console.error('mcp request failed', error);
      if (!res.headersSent) sendJson(res, 500, rpcError(requestId(req.body), -32603, error.message));
    }
  });

  const port = Number(process.env.PORT || 3000);
  const server = app.listen(port, '0.0.0.0', () => {
    console.log('mcp-http ' + cfg.adapter + ' listening on 0.0.0.0:' + port);
  });
  server.on('close', () => {
    native?.stop();
    stdio?.stop();
  });
  return server;
}

async function proxyNative(port, req, res) {
  const headers = {
    'content-type': req.get('content-type') || 'application/json',
    accept: req.get('accept') || 'application/json, text/event-stream',
    host: '127.0.0.1:' + port,
  };
  for (const name of ['mcp-protocol-version', 'mcp-session-id', 'last-event-id']) {
    const value = req.get(name);
    if (value) headers[name] = value;
  }
  const upstream = await fetch('http://127.0.0.1:' + port + '/mcp', {
    method: 'POST',
    headers,
    body: JSON.stringify(req.body),
    signal: AbortSignal.timeout(90000),
  });
  res.status(upstream.status);
  res.set('cache-control', 'no-store');
  const type = upstream.headers.get('content-type');
  if (type) res.set('content-type', type);
  const session = upstream.headers.get('mcp-session-id');
  if (session) res.set('mcp-session-id', session);
  res.send(Buffer.from(await upstream.arrayBuffer()));
}
