// One-off import: node scripts/import-sonnets.mjs path/to/pg1041.txt
// Source: https://www.gutenberg.org/cache/epub/1041/pg1041.txt
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { parseSonnets, toMarkdown } from './sonnets-parser.mjs';

const input = process.argv[2];
if (!input) { console.error('usage: node scripts/import-sonnets.mjs path/to/pg1041.txt'); process.exit(2); }
const text = readFileSync(input, 'utf8');
const sonnets = parseSonnets(text);
const out = new URL('../src/content/sonnets/', import.meta.url);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const sonnet of sonnets) writeFileSync(new URL(`${sonnet.number}.md`, out), toMarkdown(sonnet));
writeFileSync(new URL('sonnets-source.json', import.meta.url), `${JSON.stringify({
  title: "Shakespeare's Sonnets",
  source: 'https://www.gutenberg.org/ebooks/1041',
  file: 'https://www.gutenberg.org/cache/epub/1041/pg1041.txt',
  sha256: createHash('sha256').update(text).digest('hex'),
  sonnets: sonnets.length,
}, null, 2)}\n`);
console.log(`wrote ${sonnets.length} sonnets`);
