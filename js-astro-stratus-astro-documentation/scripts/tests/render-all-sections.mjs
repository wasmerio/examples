/**
 * Build a temporary page holding every structure-value default; fails if any
 * component throws on its own defaults or a `_component` path is dead.
 *
 *   node scripts/tests/render-all-sections.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { glob } from "glob";
import * as yaml from "js-yaml";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");
const fixturePath = join(root, "src/content/pages/kitchen-sink-render-test.md");

// Form fields have no structure-value.yml, so they are never placed in `pageSections`.
const structureFiles = await glob("src/components/**/*.cloudcannon.structure-value.yml", {
  cwd: root,
});

const sections = [];
const skipped = [];

for (const file of structureFiles.sort()) {
  const structure = yaml.load(readFileSync(join(root, file), "utf8"));
  const value = structure?.value;

  if (!value?._component) {
    skipped.push(file);
    continue;
  }

  const componentDir = join(root, "src/components", value._component);

  if (!existsSync(componentDir)) {
    console.error(`DANGLING _component "${value._component}" in ${file}`);
    process.exitCode = 1;
    continue;
  }

  sections.push(value);
}

if (process.exitCode) process.exit(process.exitCode);
if (skipped.length) {
  console.warn(`Skipped ${skipped.length} structure file(s) without a value._component:`);
  for (const file of skipped) console.warn(`  ${file}`);
}

console.log(`Rendering ${sections.length} component structure defaults…`);

const page = `---\n${yaml.dump(
  {
    title: "Kitchen sink render test",
    noindex: true,
    pageSections: sections,
  },
  { noRefs: true, lineWidth: -1 }
)}---\n`;

writeFileSync(fixturePath, page);

try {
  execSync("npx astro build", {
    cwd: root,
    stdio: "inherit",
  });

  const output = join(root, "dist/kitchen-sink-render-test/index.html");

  if (!existsSync(output)) {
    console.error("Build succeeded but the kitchen-sink page was not emitted.");
    process.exit(1);
  }
  console.log(`OK: all ${sections.length} structure defaults rendered.`);
} finally {
  rmSync(fixturePath, { force: true });
}
