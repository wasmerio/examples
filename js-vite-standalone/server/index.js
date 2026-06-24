'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const port = Number(process.env.PORT || '3000');
const host = process.env.HOST || process.env.HOSTNAME || '127.0.0.1';
const root = process.env.STATIC_ROOT || path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFilePath(urlPath) {
  let pathname = decodeURIComponent(urlPath.split('?')[0] || '/');
  const candidates = [];

  if (pathname.endsWith('/')) {
    candidates.push(path.join(root, pathname, 'index.html'));
  } else {
    candidates.push(path.join(root, pathname));
    candidates.push(`${path.join(root, pathname)}.html`);
    candidates.push(path.join(root, pathname, 'index.html'));
  }

  for (const candidate of candidates) {
    const relative = path.relative(root, candidate);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      continue;
    }
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.statusCode = 405;
    response.end('Method Not Allowed');
    return;
  }

  const filePath = resolveFilePath(request.url || '/');
  if (!filePath) {
    response.statusCode = 404;
    response.end('Not Found');
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  response.setHeader('Content-Type', MIME_TYPES[extension] || 'application/octet-stream');
  response.statusCode = 200;
  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  process.stdout.write(`vite standalone server listening on http://${host}:${port}\n`);
});
