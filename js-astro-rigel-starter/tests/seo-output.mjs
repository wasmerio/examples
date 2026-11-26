import assert from "node:assert/strict";
import { readFile, writeFile, rm, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const created = [];
const routes = [];
function build(multilingual = process.env.RIGEL_CONTENT_MULTILANG) {
  const result = spawnSync("pnpm", ["build"], { encoding: "utf8", env: { ...process.env, NODE_ENV: "production", RIGEL_CONTENT_MULTILANG: multilingual ?? "false" } });
  assert.equal(result.status, 0, result.stdout + result.stderr);
}
async function fixture(folder, data, route, state) {
  const slug = `seo-regression-${state}`;
  const file = `${folder}/${slug}.json`;
  await writeFile(file, JSON.stringify(data), { flag: "wx" });
  created.push(file);
  routes.push({ route: route.replace("{slug}", slug), state });
}
try {
  build("true");
  const manifest = JSON.parse(await readFile("dist/rigel/manifest.json", "utf8"));
  for (const type of manifest.schema.documents.filter(type => !type.shared)) {
    const sample = manifest.documents.find(doc => doc.type === type.name);
    assert.ok(sample, `${type.name}: sample page`);
    for (const state of ["true", "false", "missing", "draft"]) {
      const slug = `seo-regression-${state}`;
      const data = { ...sample.data, _id: `${type.name}:${slug}`, slug, draft: state === "draft" };
      delete data.noindex;
      if (state !== "missing") data.noindex = state !== "false";
      await fixture(type.folder, data, manifest.preview.documents[type.name].url, state);
    }
  }
  for (const collection of manifest.collections) {
    const folder = collection.locale ? `src/content/multilang/${collection.locale}/articles` : `src/content/${collection.name}`;
    const sample = JSON.parse(await readFile(`${folder}/${(await readdir(folder)).find(file => file.endsWith(".json"))}`, "utf8"));
    for (const state of ["true", "false", "missing", "draft"]) {
      const frontmatter = { ...sample.frontmatter, slug: `seo-regression-${state}`, draft: state === "draft" };
      delete frontmatter.noindex;
      if (state !== "missing") frontmatter.noindex = state !== "false";
      await fixture(folder, { ...sample, frontmatter }, manifest.preview.collections[collection.name].url, state);
    }
  }
  build("true");
  for (const { route, state } of routes) {
    const file = `dist${route}index.html`;
    if (state === "draft") { await assert.rejects(readFile(file), { code: "ENOENT" }); continue; }
    const html = await readFile(file, "utf8");
    const robots = [...html.matchAll(/<meta\b[^>]*name="robots"[^>]*>/g)].map(match => match[0]);
    assert.equal(robots.length, state === "true" ? 1 : 0, `${route}: exactly one noindex tag only when enabled`);
    if (state === "true") {
      assert.match(robots[0], /content="noindex"/);
      assert.doesNotMatch(robots[0], /nofollow/);
    }
    assert.match(html, /<main id="main">/, `${route}: published content remains accessible`);
  }
  console.log(`PASS: ${routes.length} built SEO routes across all page types and article locales: true/false/missing, unique robots tags, follow preserved and production drafts excluded`);
} finally {
  for (const file of created) await rm(file);
  build();
}
