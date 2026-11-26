import assert from "node:assert/strict";
import { readFile, writeFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createServer } from "vite";

const manifest = JSON.parse(await readFile("dist/rigel/manifest.json", "utf8"));
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });
const created = [];
const routes = [];
const build = () => { const result = spawnSync("pnpm", ["build"], { stdio: "pipe", encoding: "utf8", env: { ...process.env, NODE_ENV: "production" } }); assert.equal(result.status, 0, result.stdout + result.stderr); };
try {
  const { newDocumentFromTemplate, pageRoute } = await server.ssrLoadModule("/node_modules/@rigel-cms/rigel/src/schema/paths.ts");
  const { validateSchema, validateDocument } = await server.ssrLoadModule("/node_modules/@rigel-cms/rigel/src/schema/validate.ts");
  validateSchema(manifest.schema);
  const types = manifest.schema.documents.filter(type => !type.shared);
  assert.deepEqual([...new Set(types.map(type => type.category ?? "Core"))].sort(), ["Core", "Legal"]);
  for (const type of types) {
    assert.ok(!type.fields.some(field => field.key === "category"), "Category belongs to the template, not editable content");
    const first = newDocumentFromTemplate(manifest.schema, type.name, "New example", "new-example");
    const second = newDocumentFromTemplate(manifest.schema, type.name, "Second example", "second-example");
    assert.equal(first.title, "New example");
    assert.equal(first._type, type.name);
    assert.equal(first.category, undefined);
    assert.ok(!Object.hasOwn(first, "darkTheme"));
    assert.ok(!type.fields.some(field => field.key === "darkTheme"));
    assert.deepEqual(first.sections.map(section => section._type), type.template.map(section => section.type));
    assert.ok(first.sections.every((section, index) => section._key !== second.sections[index]._key));
    validateDocument(manifest.schema, type.name, first.slug, first, manifest.documents);
    for (const section of first.sections) {
      assert.ok(type.fields.find(field => field.key === "sections").items.some(item => item.name === section._type));
      const fields = manifest.schema.objects.find(object => object.name === section._type).fields;
      assert.ok(Object.keys(section).every(key => ["_key", "_type", ...fields.map(field => field.key)].includes(key)), "Template has no orphan fields");
    }
    const prefix = `${type.locale ? `/${type.locale}` : ""}${type.category ? `/${type.category.toLowerCase()}` : ""}`;
    const mapping = manifest.preview.documents[type.name];
    assert.equal(mapping.template, `/preview/documents/${type.name}/`);
    const templateHtml = await readFile(`dist${mapping.template}index.html`, "utf8");
    assert.ok(templateHtml.includes('data-rigel-each="sections" data-rigel-doc="$document"'));
    const allowedSections = type.fields.find(field => field.key === "sections").items.map(item => item.name).sort();
    assert.deepEqual([...templateHtml.matchAll(/data-rigel-item-template="([^"]+)"/g)].map(match => match[1]).sort(), allowedSections);
    assert.ok(templateHtml.includes(`<html lang="${type.locale ?? "en"}"`));
    assert.equal(pageRoute({ slug: "stored-name", data: first }, mapping), `${prefix}/new-example/`);
    for (const data of [first, second, { ...newDocumentFromTemplate(manifest.schema, type.name, "Draft example", "draft-example"), draft: true }]) {
      assert.ok(!Object.hasOwn(data, "darkTheme"));
      const file = `${type.folder}/${data.slug}.json`;
      await writeFile(file, JSON.stringify(data), { flag: "wx" });
      created.push(file);
      routes.push({ path: pageRoute({ slug: data.slug, data }, mapping), data, type });
    }
    const sample = manifest.documents.find(doc => doc.type === type.name && (doc.slug === "example" || doc.slug === "perspective"));
    if (!sample) continue;
    const route = pageRoute(sample, mapping);
    const html = await readFile(`dist${route}index.html`, "utf8");
    assert.ok(html.includes(`data-rigel-doc="${sample.id}"`));
    assert.ok(!Object.hasOwn(sample.data, "darkTheme"));
    assert.doesNotMatch(html, /<html\b[^>]*data-theme=/);
    assert.match(html, /<meta name="color-scheme" content="light"\s*\/?>/);
    assert.ok(html.includes(`<html lang="${type.locale ?? "en"}"`));
    const allowed = type.fields.find(field => field.key === "sections").items.map(item => item.name).sort();
    assert.deepEqual([...html.matchAll(/data-rigel-item-template="([^"]+)"/g)].map(match => match[1]).sort(), allowed);
    for (const section of sample.data.sections) assert.ok(html.includes(`data-rigel-key="${section._key}"`));
  }
  build();
  for (const { path, data, type } of routes) {
    if (data.draft) { await assert.rejects(readFile(`dist${path}index.html`), { code: "ENOENT" }); continue; }
    const html = await readFile(`dist${path}index.html`, "utf8");
    assert.ok(html.includes(`data-rigel-doc="${data._id}"`), "New pages render through the native host route");
    assert.doesNotMatch(html, /<html\b[^>]*data-theme=/);
    assert.match(html, /<meta name="color-scheme" content="light"\s*\/?>/);
    for (const section of data.sections) assert.ok(html.includes(`data-rigel-key="${section._key}"`));
  }
  console.log(`PASS: ${types.length} native page types: Core/Legal metadata, light-only appearance, creation defaults, validation, unique section keys, public/editor route mappings, new-page rendering, production draft exclusion and built prepared sections`);
} finally {
  await server.close();
  for (const file of created) await rm(file);
  if (created.length) build();
}
