import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, 'UPSTREAM.json'), 'utf8'));
const cache = join(root, '.cache');
const archive = join(cache, `${upstream.commit}.tar.gz`);
const source = join(cache, `miniPaint-${upstream.commit}`);
const output = join(root, 'site');

await mkdir(cache, { recursive: true });

let bytes;
try {
  bytes = await readFile(archive);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const response = await fetch(
    `https://codeload.github.com/viliusle/miniPaint/tar.gz/${upstream.commit}`,
    { signal: AbortSignal.timeout(120_000) },
  );
  if (!response.ok) throw new Error(`Upstream download failed: HTTP ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}

const digest = createHash('sha256').update(bytes).digest('hex');
if (digest !== upstream.archiveSha256) {
  throw new Error(`Upstream archive checksum mismatch: ${digest}`);
}
await writeFile(archive, bytes);

// Re-extract verified sources on every build; cached local edits never ship.
await rm(source, { recursive: true, force: true });
execFileSync('tar', ['-xzf', archive, '-C', cache], { stdio: 'inherit' });
execFileSync('npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], {
  cwd: source, stdio: 'inherit',
});
execFileSync('npm', ['run', 'build'], { cwd: source, stdio: 'inherit' });

await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'src/js/libs/gifjs'), { recursive: true });
for (const path of ['index.html', 'dist', 'images', upstream.licenseFile]) {
  await cp(join(source, path), join(output, path), { recursive: true });
}
// Animated GIF export loads this worker by its original upstream URL.
await cp(
  join(source, 'src/js/libs/gifjs/gif.worker.js'),
  join(output, 'src/js/libs/gifjs/gif.worker.js'),
);
await cp(join(root, 'sample.svg'), join(output, 'sample.svg'));
await cp(join(root, 'UPSTREAM.json'), join(output, 'UPSTREAM.json'));
await cp(join(root, 'LICENSE'), join(output, 'TEMPLATE-LICENSE.txt'));

console.log(`Built miniPaint ${upstream.version} (${upstream.commit}) into site/`);
