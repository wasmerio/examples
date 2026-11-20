const assert = require("node:assert/strict");
const { test } = require("node:test");
const server = require("./server");

test("the app reports provisioning status without exposing connection details", async (context) => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}`;

  const names = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USERNAME", "DB_PASSWORD"];
  const original = names.map((name) => process.env[name]);
  context.after(() => names.forEach((name, index) => {
    if (original[index] === undefined) delete process.env[name];
    else process.env[name] = original[index];
  }));

  names.forEach((name) => delete process.env[name]);
  const missing = await fetch(url);
  assert.equal(missing.status, 503);
  assert.deepEqual(await missing.json(), { database: "postgresql", configured: false });

  names.forEach((name) => { process.env[name] = "private-connection-detail"; });
  const ready = await fetch(url);
  assert.equal(ready.status, 200);
  assert.deepEqual(await ready.json(), { database: "postgresql", configured: true });

  const unknown = await fetch(`${url}/unknown`);
  assert.equal(unknown.status, 404);
});
