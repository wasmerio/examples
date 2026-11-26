import test from 'node:test';
import assert from 'node:assert/strict';
import { auditPublicFiles } from '../src/lib/privacy-audit.js';

test('privacy audit accepts fictional sample code and demo screenshots', () => {
  assert.deepEqual(auditPublicFiles([
    { path: 'src/data/memories.js', content: '林岚和周屿在云杉河岸散步。' },
    { path: 'docs/images/home-demo.png', content: Buffer.from('sample screenshot') },
    { path: 'src/assets/images/demo/river.jpg', content: Buffer.from('original illustration') },
  ]), []);
});

test('privacy audit finds source names, dates, domains, source asset paths, and source docs', () => {
  const issues = auditPublicFiles([
    { path: 'src/config/site.js', content: `hello ${'2024'}-10-06 and ${'2026'}-03-12` },
    { path: 'src/pages/index.astro', content: `${'小'}鱼 & ${'乖'}乖` },
    { path: 'src/config/url.js', content: `https://www.${'20241006'}.love` },
    { path: 'src/assets/images/timeline/photo.jpg', content: '' },
    { path: 'artifacts/visual-checks/private.png', content: '' },
  ]);
  assert.equal(issues.length, 6);
});
