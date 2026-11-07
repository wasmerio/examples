import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, 'UPSTREAM.json'), 'utf8'));
const cache = join(root, '.cache');
const source = join(cache, `piskel-${upstream.commit}`);
const output = join(root, 'site');
await mkdir(cache, { recursive: true });
const archive = join(cache, `${upstream.commit}.tar.gz`);
let bytes;
try {
  bytes = await readFile(archive);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const url = `${upstream.repository.replace('https://github.com/', 'https://codeload.github.com/')}/tar.gz/${upstream.commit}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  assert.ok(response.ok, `Source download: HTTP ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}
assert.equal(createHash('sha256').update(bytes).digest('hex'), upstream.archiveSha256,
  'Upstream archive checksum mismatch');
await writeFile(archive, bytes);
// Always extract verified sources afresh, so local cached changes cannot ship.
await rm(source, { recursive: true, force: true });
execFileSync('tar', ['-xzf', archive, '-C', cache], { stdio: 'inherit' });

// All locked dependencies are registry packages; keep hosted Git/URL installs disabled.
const lock = JSON.parse(await readFile(join(source, 'package-lock.json'), 'utf8'));
for (const dependency of Object.values(lock.packages)) {
  assert.ok(!dependency.resolved || dependency.resolved.startsWith('https://registry.npmjs.org/'),
    `Unexpected dependency source: ${dependency.resolved}`);
}
execFileSync('npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], {
  cwd: source, stdio: 'inherit',
});
// Upstream versions asset names using the current time; freeze only build metadata.
for (const path of ['vite-plugins/concat-scripts.js', 'vite-plugins/html-include.js']) {
  const target = join(source, path);
  const text = await readFile(target, 'utf8');
  assert.equal(text.split('new Date()').length, path.includes('concat-scripts') ? 3 : 2);
  await writeFile(target, text.replaceAll('new Date()', "new Date('2026-11-04T21:39:00Z')"));
}
execFileSync('npm', ['run', 'build'], {
  cwd: source, stdio: 'inherit', env: { ...process.env, TZ: 'UTC' },
});

await rm(output, { recursive: true, force: true });
await cp(join(source, 'dest/prod'), output, { recursive: true });
for (const path of ['LICENSE', 'NOTICE', 'UPSTREAM.json']) {
  await cp(join(root, path), join(output, path));
}
// Preserve source and installed package notices alongside the shipped application.
async function notices(directory, target) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', 'build', 'dest'].includes(entry.name)) {
      await notices(path, join(target, entry.name));
    } else if (entry.isFile() && /^(licen[cs]e|notice|copying|ofl)([._-]|$)/i.test(entry.name)) {
      await mkdir(target, { recursive: true });
      await cp(path, join(target, entry.name));
    }
  }
}
await notices(source, join(output, 'notices/upstream'));
const modules = join(source, 'node_modules');
for (const entry of await readdir(modules, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
  if (entry.name.startsWith('@')) {
    for (const scoped of await readdir(join(modules, entry.name), { withFileTypes: true })) {
      if (scoped.isDirectory()) await notices(join(modules, entry.name, scoped.name),
        join(output, 'notices/packages', entry.name, scoped.name));
    }
  } else {
    await notices(join(modules, entry.name), join(output, 'notices/packages', entry.name));
  }
}
await cp(join(root, 'sample.piskel'), join(output, 'sample.piskel'));
console.log(`Built piskel ${upstream.version} (${upstream.commit}) into site/`);
