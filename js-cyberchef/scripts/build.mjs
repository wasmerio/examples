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
const temp = await mkdtemp(join(tmpdir(), 'wasmer-cyberchef-'));

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
  const zip = join(temp, 'release.zip');
  download(
    `${upstream.repository}/releases/download/v${upstream.version}/CyberChef_${upstream.commit}.zip`,
    zip,
  );
  const zipHash = await sha256(zip);
  if (zipHash !== upstream.releaseZipSha256) {
    throw new Error(`CyberChef release SHA-256 mismatch: ${zipHash}`);
  }

  const archive = join(temp, 'source.tar.gz');
  download(`https://codeload.github.com/gchq/CyberChef/tar.gz/${upstream.commit}`, archive);
  const archiveHash = await sha256(archive);
  if (archiveHash !== upstream.archiveSha256) {
    throw new Error(`CyberChef source archive SHA-256 mismatch: ${archiveHash}`);
  }

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  execFileSync('unzip', ['-q', zip, '-d', dist], { stdio: 'inherit' });
  const pages = (await readdir(dist)).filter((name) => /^CyberChef_.*\.html$/.test(name));
  if (pages.length !== 1) throw new Error(`Expected one CyberChef HTML file, found ${pages.join(', ')}`);
  await cp(join(dist, pages[0]), join(dist, 'index.html'));

  const extracted = join(temp, 'extracted');
  await mkdir(extracted);
  execFileSync('tar', ['-xzf', archive, '-C', extracted], { stdio: 'inherit' });
  const folders = await readdir(extracted);
  if (folders.length !== 1) throw new Error(`Expected one source folder, found ${folders.join(', ')}`);
  await cp(join(extracted, folders[0]), join(dist, 'source'), { recursive: true });
  await cp(join(dist, 'source', 'LICENSE'), join(dist, 'LICENSE'));
  await writeFile(join(dist, 'source', 'README.txt'), [
    `CyberChef ${upstream.version}`,
    `Upstream: ${upstream.repository}`,
    `Commit: ${upstream.commit}`,
    `Source archive SHA-256: ${upstream.archiveSha256}`,
    `Release zip SHA-256: ${upstream.releaseZipSha256}`,
    `License: Apache-2.0 (Crown Copyright), see /LICENSE`,
    '',
  ].join('\n'));
} finally {
  await rm(temp, { recursive: true, force: true });
}
