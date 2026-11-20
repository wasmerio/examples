import assert from 'node:assert/strict';

const origin = new URL(process.argv[2]);
async function get(path, method = 'GET') {
  const response = await fetch(new URL(path, origin), { method, signal: AbortSignal.timeout(15_000) });
  assert.ok(response.ok, `${path} returned HTTP ${response.status}`);
  return response;
}

const html = await (await get('/')).text();
assert.match(html, /<title>Univer Sheets<\/title>/);
const script = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
assert.ok(script, 'Compiled workbook module is present');
assert.match((await get(script, 'HEAD')).headers.get('content-type'), /javascript/);
console.log(`Smoke check passed for ${origin.origin}`);
