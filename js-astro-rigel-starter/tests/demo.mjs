import "./local-only.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = process.env.RIGEL_URL || "http://localhost:4321/rigel/";
const enabled = process.env.RIGEL_DEMO !== "false";
const manifest = await (await fetch(new URL("/rigel/manifest.json", base))).json();
const demoType = manifest.schema.documents.find(type => type.demo);
const demo = manifest.documents.find(doc => doc.id === "demo:fields");
const file = "src/content/demo/fields.json";
const original = await readFile(file, "utf8");
const settings = manifest.documents.find(doc => doc.id === "settings:site");
assert.deepEqual(Object.keys(settings.data).filter(key => !key.startsWith("_")).sort(), ["copyright", "metaDescription", "siteName"]);
assert.equal(Boolean(demoType), enabled);
assert.equal(Boolean(demo), enabled);
assert.equal((await fetch(new URL("/rigel/api/local/documents/demo:fields", base))).status, enabled ? 200 : 404);
const page = await fetch(new URL("/demo/fields/", base));
assert.equal(page.status, enabled ? 200 : 404);
if (enabled) {
  assert.deepEqual([...new Set(demoType.fields.map(field => field.type))].sort(), ["string", "text", "markdown", "boolean", "number", "date", "image", "url", "color", "code", "password", "object", "array", "reference"].sort());
  const html = await page.text();
  assert.ok(html.includes(demo.data.siteName));
  assert.ok(!html.includes(demo.data.mapsApiKey) && !html.includes(demo.data.analyticsSnippet));
} else {
  const result = await fetch(new URL("/rigel/api/local/documents/demo:fields", base), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: new URL(base).origin },
    body: JSON.stringify({ data: JSON.parse(original) }),
  });
  assert.equal(result.status, 400, "Disabled demo document writes are rejected");
}
assert.equal(await readFile(file, "utf8"), original, "Demo checks leave its fixture unchanged");
console.log(`PASS: demo ${enabled ? "enabled with every field type" : "disabled from discovery, API reads/writes and public routes"}; real Site settings remains separate`);
