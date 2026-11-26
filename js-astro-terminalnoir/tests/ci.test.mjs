import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('CI verifies locally without deployment credentials', () => {
  const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run verify/);
  assert.doesNotMatch(workflow, /firebase|google-github-actions|id-token: write/);
});
