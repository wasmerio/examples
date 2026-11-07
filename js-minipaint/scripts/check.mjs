import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'site');
const upstream = JSON.parse(await readFile(join(root, 'UPSTREAM.json'), 'utf8'));
const source = join(root, '.cache', `miniPaint-${upstream.commit}`);
const base = process.argv[2];

// Preserve the upstream page and bundled UI exactly, including license notices.
for (const path of ['index.html', 'dist/bundle.js', upstream.licenseFile]) {
  assert.deepEqual(await readFile(join(output, path)), await readFile(join(source, path)), path);
}
const paths = ['/', '/dist/bundle.js', '/dist/bundle.js.LICENSE.txt',
  '/src/js/libs/gifjs/gif.worker.js', '/MIT-LICENSE.txt', '/TEMPLATE-LICENSE.txt',
  '/UPSTREAM.json', '/sample.svg'];
for (const name of await readdir(join(output, 'images'), { recursive: true, withFileTypes: true })) {
  if (name.isFile()) {
    paths.push(`/images/${join(name.parentPath, name.name).slice(join(output, 'images').length + 1)}`);
  }
}
if (base) {
  for (const path of paths) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, path);
    assert.ok((await response.arrayBuffer()).byteLength > 0, path);
  }
  // The deployable root must not expose the build source or npm metadata.
  for (const path of ['/package.json', '/package-lock.json', '/scripts/build.mjs']) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 404, path);
  }
  console.log(`Passed: ${paths.length} HTTP assets; 3 build-only paths return 404.`);
}
console.log('Passed: upstream HTML, bundle, and MIT license are byte-identical.');
