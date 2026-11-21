import assert from 'node:assert/strict';

const origin = new URL(process.argv[2]);

async function get(path) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30_000) });
  assert.ok(response.ok, `${path} returned HTTP ${response.status}`);
  return response;
}

const html = await (await get('/')).text();
assert.match(html, /<title>CyberChef<\/title>/);
assert.match(html, /assets\/main\.js/);
const script = await get('/assets/main.js');
assert.match(script.headers.get('content-type') || '', /javascript|text\/plain|application\/octet-stream/);
assert.match(await (await get('/LICENSE')).text(), /Apache License/);
assert.match(await (await get('/source/README.txt')).text(), /f464d62c7c943cda9749a765932a7548ba9bfb16/);
console.log(`Smoke check passed for ${origin.origin}`);
