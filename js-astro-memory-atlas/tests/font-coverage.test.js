import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const textSuffixes = new Set(['.js', '.astro', '.css', '.md', '.svg', '.mjs', '.yml', '.txt', '.html']);

function codepoints(rangeText) {
  const values = new Set();
  for (const part of rangeText.split(',')) {
    const match = part.trim().match(/^U\+([0-9A-F]+)(?:-([0-9A-F]+))?$/i);
    if (!match) continue;
    const start = Number.parseInt(match[1], 16);
    const end = match[2] ? Number.parseInt(match[2], 16) : start;
    for (let value = start; value <= end; value += 1) values.add(value);
  }
  return values;
}

async function sourceText(directory) {
  const chunks = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) chunks.push(await sourceText(fullPath));
    else if (textSuffixes.has(path.extname(entry.name).toLowerCase())) chunks.push(await readFile(fullPath, 'utf8'));
  }
  return chunks.join('');
}

test('new copy stays in the preloaded font instead of the large GB2312 file', async () => {
  const css = await readFile(new URL('../src/styles/font-face.css', import.meta.url), 'utf8');
  const faces = [...css.matchAll(/url\("\.\.\/assets\/fonts\/([^"]+)"\)[\s\S]*?unicode-range:\s*([^;]+);/g)];
  const ranges = new Map(faces.map((match) => [match[1], codepoints(match[2])]));
  const base = ranges.get('NotoSansSC-base.woff2');
  const common = ranges.get('NotoSansSC-common.woff2');
  assert.ok(base?.size);
  assert.ok(common?.size);
  const overlap = [...base].filter((value) => common.has(value));
  assert.equal(overlap.length, 0);
  const leaked = [...new Set(await sourceText(root))].map((character) => character.codePointAt(0)).filter((value) => common.has(value) && !base.has(value));
  assert.deepEqual(leaked, [], `characters would download the large font: ${leaked.map((value) => String.fromCodePoint(value)).join('')}`);
});
