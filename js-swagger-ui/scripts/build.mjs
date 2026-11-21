import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, 'UPSTREAM.json'), 'utf8'));
const dist = join(root, 'dist');
const temp = await mkdtemp(join(tmpdir(), 'wasmer-swagger-ui-'));

async function sha256(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

function download(url, path) {
  execFileSync('curl', [
    '--fail', '--silent', '--show-error', '--location', '--retry', '2',
    '--output', path, url,
  ], { stdio: 'inherit' });
}

try {
  const archive = join(temp, 'source.tar.gz');
  download(`https://codeload.github.com/swagger-api/swagger-ui/tar.gz/${upstream.commit}`, archive);
  const archiveHash = await sha256(archive);
  if (archiveHash !== upstream.archiveSha256) {
    throw new Error(`Swagger UI source SHA-256 mismatch: ${archiveHash}`);
  }

  const extracted = join(temp, 'extracted');
  await mkdir(extracted);
  execFileSync('tar', ['-xzf', archive, '-C', extracted], { stdio: 'inherit' });
  const folders = await readdir(extracted);
  if (folders.length !== 1) throw new Error(`Expected one source folder, found ${folders.join(', ')}`);
  const source = join(extracted, folders[0]);

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(join(source, 'dist'), dist, { recursive: true });
  if (!(await readdir(dist)).includes('index.html')) throw new Error('dist/index.html missing from upstream');
  await cp(source, join(dist, 'source'), { recursive: true });
  await cp(join(source, 'LICENSE'), join(dist, 'LICENSE'));
  await writeFile(join(dist, 'source', 'README.txt'), [
    `Swagger UI ${upstream.version}`,
    `Upstream: ${upstream.repository}`,
    `Commit: ${upstream.commit}`,
    `Source archive SHA-256: ${upstream.archiveSha256}`,
    'License: Apache-2.0, see /LICENSE',
    '',
  ].join('\n'));
} finally {
  await rm(temp, { recursive: true, force: true });
}
