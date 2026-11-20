import assert from 'node:assert/strict';

const origin = new URL(process.argv[2]);
async function get(path, method = 'GET') {
  const response = await fetch(new URL(path, origin), { method, signal: AbortSignal.timeout(15_000) });
  assert.ok(response.ok, `${path} returned HTTP ${response.status}`);
  return response;
}

const html = await (await get('/')).text();
assert.match(html, /<title>DuckDB CSV Explorer<\/title>/);
assert.match(await (await get('/campaigns.csv')).text(), /Video/);
const script = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
assert.ok(script, 'Compiled shell module is present');
const js = await (await get(script)).text();
for (const name of ['duckdb-mvp', 'shell_bg']) {
  const asset = js.match(new RegExp(`/assets/${name}-[\\w-]+\\.wasm`))?.[0];
  assert.ok(asset, `Missing ${name} WebAssembly asset`);
  assert.match((await get(asset, 'HEAD')).headers.get('content-type'), /application\/wasm/);
}
console.log(`Smoke check passed for ${origin.origin}`);
