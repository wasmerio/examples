import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import "../tests/local-only.mjs";

const suites = ["demo", "settings", "navigation", "visual", "blog-blocks", "preview", "richtext", "media", "media-cache", "website", "github", "extensions"];
if (process.env.RIGEL_CONTENT_MULTILANG === "true") suites.push("multilang");
const selected = process.argv.slice(2);
const root = fileURLToPath(new URL("../", import.meta.url));
for (const suite of selected.length ? selected : suites) {
  assert.ok([...suites, "multilang", "seo", "demo-backend"].includes(suite), `Unknown browser suite: ${suite}`);
  console.log(`\nRunning ${suite}`);
  const files = () => ['src/content', 'public'].flatMap(directory => readdirSync(join(root, directory), { recursive: true, withFileTypes: true }).filter(entry => entry.isFile()).map(entry => join(entry.parentPath, entry.name)));
  const originals = new Map(files().map(file => [file, readFileSync(file)]));
  let result;
  try {
    result = spawnSync(process.execPath, [`tests/${["multilang", "seo", "navigation"].includes(suite) ? "settings" : suite}.mjs`], { cwd: root, stdio: "inherit", timeout: 300_000, env: { ...process.env, RIGEL_BROWSER_MULTILANG_ONLY: suite === "multilang" ? "true" : "false", RIGEL_BROWSER_SEO_ONLY: suite === "seo" ? "true" : "false", RIGEL_BROWSER_NAVIGATION_ONLY: suite === "navigation" ? "true" : "false" } });
  } finally {
    for (const file of files()) if (!originals.has(file)) rmSync(file);
    for (const [file, bytes] of originals) writeFileSync(file, bytes);
  }
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
