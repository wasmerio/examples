import assert from 'node:assert/strict';

const origin = new URL(process.argv[2]);
async function get(path, method = 'GET') {
  const response = await fetch(new URL(path, origin), { method, signal: AbortSignal.timeout(15_000) });
  assert.ok(response.ok, `${path} returned HTTP ${response.status}`);
  return response;
}

const html = await (await get('/')).text();
assert.match(html, /BentoPDF/);
const merge = await get('/merge-pdf');
assert.match(await merge.text(), /Merge PDF/);
assert.match(merge.headers.get('cross-origin-embedder-policy'), /credentialless/);
assert.match(merge.headers.get('content-security-policy'), /frame-ancestors/);
assert.match(await (await get('/LICENSE.txt')).text(), /GNU AFFERO GENERAL PUBLIC LICENSE/);
assert.match(await (await get('/source.txt')).text(), /https:\/\/github\.com\/alam00000\/bentopdf\/tree\/[a-f0-9]{40}/);
console.log(`Smoke check passed for ${origin.origin}`);
