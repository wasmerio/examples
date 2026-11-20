import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const upstream = 'https://github.com/alam00000/bentopdf';
const release = 'v2.8.11';
const revision = 'f638f8e4db66cb69dec35ca061ad89034dd62445';
const digest = 'fab3bfd84bd9260658aac620552d04d54bda2151a544c56a653dee34bece50da';
const temp = await mkdtemp(join(tmpdir(), 'wasmer-bentopdf-'));

try {
  const archive = join(temp, 'release.zip');
  execFileSync('curl', [
    '--fail', '--silent', '--show-error', '--location', '--retry', '2',
    '--output', archive, `${upstream}/releases/download/${release}/dist-simple-${release.slice(1)}.zip`,
  ], { stdio: 'inherit' });

  const hash = createHash('sha256');
  for await (const bytes of createReadStream(archive)) hash.update(bytes);
  if (hash.digest('hex') !== digest) throw new Error('BentoPDF release SHA-256 mismatch');

  await rm('dist', { recursive: true, force: true });
  await mkdir('dist', { recursive: true });
  execFileSync('unzip', ['-q', archive, '-d', 'dist']);
  await writeFile('dist/source.txt', [
    `BentoPDF ${release} · AGPL-3.0`,
    `Matching upstream source: ${upstream}/tree/${revision}`,
    `Download source and build files: ${upstream}/archive/${revision}.tar.gz`,
    `Original binary release and build instructions: ${upstream}/releases/tag/${release}`,
    'License: /LICENSE.txt',
    '',
  ].join('\n'));
  const license = await fetch(`https://raw.githubusercontent.com/alam00000/bentopdf/${revision}/LICENSE`);
  if (!license.ok) throw new Error(`BentoPDF license fetch failed (${license.status})`);
  await writeFile('dist/LICENSE.txt', await license.text());
} finally {
  await rm(temp, { recursive: true, force: true });
}
