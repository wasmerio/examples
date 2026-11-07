import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const upstream = JSON.parse(await readFile(join(root, 'UPSTREAM.json'), 'utf8'));
const output = join(root, 'site');
const source = join(root, '.cache', `excalidraw-${upstream.commit}`);
const base = process.argv[2];
assert.deepEqual(await readFile(join(output, 'LICENSE')), await readFile(join(source, 'LICENSE')));
let assets = [];
async function files(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) await files(join(directory, entry.name), path);
    else if (entry.isFile()) assets.push(path);
  }
}
await files(output);
const html = await readFile(join(output, 'index.html'), 'utf8');
assert.ok(!html.includes('simpleanalyticscdn.com'));
assert.ok(!html.includes('https://excalidraw.nyc3.cdn.digitaloceanspaces.com/oss/'));
for (const path of assets.filter(path => /\.(js|css|woff2?)$/.test(path) && !path.startsWith('/notices/'))) {
  assert.deepEqual(await readFile(join(output, path)), await readFile(join(source, 'excalidraw-app/build', path)), path);
  if (path.endsWith('.js')) {
    const code = await readFile(join(output, path), 'utf8');
    for (const endpoint of ['https://oss-collab.excalidraw.com', 'https://oss-ai.excalidraw.com', 'https://json.excalidraw.com/api/v2/']) {
      assert.ok(!code.includes(endpoint), `Unconfigured backend present in ${path}`);
    }
  }
}

if (base) {
  // Fetch every application asset and preserved notice from the actual preview server.
  for (const path of assets) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, path);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(join(output, path)), path);
  }
  for (const path of ['/package.json', '/scripts/build.mjs', '/.cache/source.tar.gz']) {
    assert.equal((await fetch(new URL(path, base))).status, 404, path);
  }
  console.log(`Passed: ${assets.length} HTTP assets match the built files; 3 build-only paths return 404.`);
}
console.log('Passed: upstream application assets and license preserved.');
