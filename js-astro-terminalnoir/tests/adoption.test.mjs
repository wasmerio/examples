import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('adoption instructions and attribution are included', () => {
  for (const path of [
    'LICENSE',
    'docs/customization.md',
    'docs/deployment.md',
    'docs/credits.md',
    'docs/publication.md',
  ]) {
    assert.ok(existsSync(path), path);
  }
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /nandomoreirame\/terminalnoir-astro-theme/);
  assert.match(readme, /src\/config\/site.ts/);
  assert.match(readFileSync('LICENSE', 'utf8'), /Fernando Moreira/);
});
