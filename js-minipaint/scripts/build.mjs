import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, 'UPSTREAM.json'), 'utf8'));
const cache = join(root, '.cache');
const source = join(cache, `miniPaint-${upstream.commit}`);
const output = join(root, 'site');

await mkdir(cache, { recursive: true });

async function verifiedArchive(name, url, expectedHash) {
  const path = join(cache, `${name}.tar.gz`);
  let bytes;
  try {
    bytes = await readFile(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
    if (!response.ok) throw new Error(`Upstream download failed: HTTP ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
  }

  const digest = createHash('sha256').update(bytes).digest('hex');
  assert.equal(digest, expectedHash, `Archive checksum mismatch: ${name}`);
  await writeFile(path, bytes);
  return path;
}

const archive = await verifiedArchive(
  upstream.commit,
  `https://codeload.github.com/viliusle/miniPaint/tar.gz/${upstream.commit}`,
  upstream.archiveSha256,
);

// Re-extract verified sources on every build; cached local edits never ship.
await rm(source, { recursive: true, force: true });
execFileSync('tar', ['-xzf', archive, '-C', cache], { stdio: 'inherit' });

// Hosted npm forbids Git and remote URL dependencies. Download and verify the
// same pinned archive, then install it as a local tarball without changing npm policy.
const name = 'hermite-resize';
const hermite = upstream.dependencies[name];
const url = `https://codeload.github.com/viliusle/Hermite-resize/tar.gz/${hermite.commit}`;
const hermiteArchive = await verifiedArchive(`${name}-${hermite.commit}`, url, hermite.archiveSha256);
await mkdir(join(source, 'vendor'), { recursive: true });
await cp(hermiteArchive, join(source, 'vendor/hermite-resize.tgz'));
const localDependency = 'file:vendor/hermite-resize.tgz';
const manifestPath = join(source, 'package.json');
const lockPath = join(source, 'package-lock.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const lock = JSON.parse(await readFile(lockPath, 'utf8'));
const locked = lock.packages[`node_modules/${name}`];
assert.equal(manifest.dependencies[name], 'git+https://github.com/viliusle/Hermite-resize.git');
assert.equal(locked.resolved,
  `git+ssh://git@github.com/viliusle/Hermite-resize.git#${hermite.commit}`);
manifest.dependencies[name] = localDependency;
lock.packages[''].dependencies[name] = localDependency;
Object.assign(locked, { resolved: localDependency, integrity: hermite.integrity });
lock.dependencies[name] = { version: localDependency, integrity: hermite.integrity };
for (const dependency of Object.values(lock.packages)) {
  assert.ok(!dependency.resolved?.startsWith('git'), 'Unexpected Git dependency in upstream lock');
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

execFileSync('npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], {
  cwd: source, stdio: 'inherit',
});
const entry = await readFile(join(source, 'node_modules/hermite-resize/dist/hermite.npm.js'));
assert.equal(createHash('sha256').update(entry).digest('hex'), hermite.entrySha256);
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
