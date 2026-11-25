// Tiny static server for comparing builds side by side. Dev tooling only.
// usage: node tools/serve.mjs <dir> <port>
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
const [dir, port] = process.argv.slice(2);
const root = resolve(dir);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4' };
const isFile = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };
http.createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const base = join(root, path);
  if (!base.startsWith(root)) { res.writeHead(403); return res.end(); }
  for (const c of [base, join(base, 'index.html'), base.replace(/\/$/, '') + '.html']) {
    if (await isFile(c)) { res.writeHead(200, { 'content-type': TYPES[extname(c)] || 'application/octet-stream' }); return res.end(await readFile(c)); }
  }
  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
  res.end(await readFile(join(root, '404.html')).catch(() => 'not found'));
}).listen(Number(port), () => console.log(`${dir} on http://localhost:${port}`));
