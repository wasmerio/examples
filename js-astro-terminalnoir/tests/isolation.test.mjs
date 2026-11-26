import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyIsolation } from '../scripts/verify-isolation.mjs';

test('rejects a dependency outside the project', () => {
  assert.throws(() => verifyIsolation('/tmp/starter', '/tmp/palette.json'), /outside/);
});

test('accepts an internal dependency', () => {
  assert.equal(verifyIsolation('/tmp/starter', '/tmp/starter/src/data.json'), true);
});
