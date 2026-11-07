import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pin = JSON.parse(await fs.readFile(path.join(root, 'UPSTREAM.json'), 'utf8'));
if (!/^[a-f0-9]{40}$/.test(pin.commit) || !/^[a-f0-9]{64}$/.test(pin.archiveSha256)) throw new Error('Invalid source pin');
const cache = path.join(root, '.cache');
await fs.mkdir(cache, { recursive: true });
const archive = path.join(cache, 'freshrss.tar.gz');
let bytes;
try { bytes = await fs.readFile(archive); } catch {
  const response = await fetch(`https://codeload.github.com/FreshRSS/FreshRSS/tar.gz/${pin.commit}`);
  if (!response.ok) throw new Error(`Source download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}
if (crypto.createHash('sha256').update(bytes).digest('hex') !== pin.archiveSha256) throw new Error('Source archive checksum mismatch');
await fs.writeFile(archive, bytes);
const upstream = path.join(root, 'upstream');
await fs.rm(upstream, { recursive: true, force: true });
await fs.mkdir(upstream);
execFileSync('tar', ['-xzf', archive, '--strip-components=1', '-C', upstream]);
// No application sources, styles or notices are changed.
await fs.mkdir(path.join(upstream, 'p', 'source'), { recursive: true });
await fs.copyFile(archive, path.join(upstream, 'p', 'source', `FreshRSS-${pin.commit}.tar.gz`));
for (const file of ['UPSTREAM.json', 'Anybuild', 'wasmer.bzl', 'bootstrap.php', 'router.php', 'refresh.php', 'dns-compat.php', 'php.ini', 'app.yaml', 'README.md']) {
  await fs.copyFile(path.join(root, file), path.join(upstream, 'p', 'source', file.endsWith('.php') ? file + '.txt' : file));
}
await fs.copyFile(path.join(root, 'scripts', 'build.mjs'), path.join(upstream, 'p', 'source', 'build.mjs.txt'));
await fs.copyFile(path.join(upstream, 'LICENSE.txt'), path.join(upstream, 'p', 'source', 'LICENSE.txt'));
console.log(`Prepared unmodified FreshRSS ${pin.version} (${pin.commit})`);
