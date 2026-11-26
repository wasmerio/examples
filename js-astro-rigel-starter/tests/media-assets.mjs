import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const uuidFile = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.[a-z0-9]+$/;
const files = (await readdir('public/rigel-media')).filter(file => !file.startsWith('.')).sort();
assert.ok(files.length, 'Starter includes media assets');
for (const file of files) assert.match(file, uuidFile, `Stored media uses a UUID v4 filename: ${file}`);
const urls = new Set(files.map(file => `/rigel-media/${file}`));
const ledger = JSON.parse(await readFile('public/rigel-media/.rigel-media.json', 'utf8'));
assert.deepEqual(Object.keys(ledger).sort(), [...urls].sort(), 'Every media asset has exactly one ledger entry, with no missing files');
for (const [url, metadata] of Object.entries(ledger)) assert.ok(typeof metadata.name === 'string' && metadata.name.trim(), `${url}: friendly display name is preserved`);
let references = 0;
for (const file of await readdir('src', { recursive: true })) {
  if (!/\.(?:astro|css|json|md|mdx|ts)$/.test(file)) continue;
  const source = await readFile(`src/${file}`, 'utf8');
  for (const match of source.matchAll(/\/rigel-media\/([a-zA-Z0-9._-]+)/g)) {
    assert.match(match[1], uuidFile, `${file}: media references use UUIDs`);
    assert.ok(urls.has(match[0]), `${file}: referenced media exists and is registered: ${match[0]}`);
    references++;
  }
}
assert.ok(references, 'Starter content exercises local media references');
console.log(`PASS: ${files.length} UUID media assets, matching ledger entries and ${references} valid source references.`);
