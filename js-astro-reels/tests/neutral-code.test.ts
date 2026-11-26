import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
/** The demo's own wording may name the sonnets; the code around it stays neutral. src/content/ is skipped. */
const DEMO_FILES = new Set(['src/config.ts', 'src/components/Intro.astro']);
const DEMO_LINES: Readonly<Record<string, RegExp>> = {};

const sources = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const path = join(dir, e.name);
  if (e.isDirectory()) return path === join(root, 'src', 'content') ? [] : sources(path);
  return /\.(ts|astro|css)$/.test(e.name) ? [path] : [];
});

test('the code names no sonnets outside the demo content and wording', () => {
  const found = sources(join(root, 'src')).flatMap((file) => {
    const rel = relative(root, file).split(sep).join('/');
    if (DEMO_FILES.has(rel)) return [];
    return readFileSync(file, 'utf8').split('\n').flatMap((line, i) =>
      /sonnet/i.test(line) && !DEMO_LINES[rel]?.test(line) ? [`${rel}:${i + 1}: ${line.trim()}`] : []);
  });
  assert.deepEqual(found, []);
});
