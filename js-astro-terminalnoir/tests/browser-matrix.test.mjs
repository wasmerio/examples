import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyBrowserMatrix } from '../scripts/browser-matrix.mjs';

test('runs interaction checks for both deployment bases', () => {
  const calls = [];
  verifyBrowserMatrix((...args) => calls.push(args), '/starter', '44321');
  assert.equal(calls.length, 2);
  assert.deepEqual(
    calls.map(call => call[3].SITE_BASE),
    ['/', '/toolkit/'],
  );
  for (const [command, args, cwd, env] of calls) {
    assert.equal(command, 'npx');
    assert.ok(args.includes('tests/browser/interactions.spec.ts'));
    assert.ok(args.includes('tests/browser/routes.spec.ts'));
    assert.ok(args.includes('tests/browser/metadata.spec.ts'));
    assert.equal(cwd, '/starter');
    assert.equal(env.PREVIEW_PORT, '44321');
  }
});

test('does not swallow a failing browser suite or continue the matrix', () => {
  let calls = 0;
  assert.throws(
    () =>
      verifyBrowserMatrix(
        () => {
          calls++;
          throw new Error('browser suite failed');
        },
        '/starter',
        '44321',
      ),
    /browser suite failed/,
  );
  assert.equal(calls, 1);
});
