/**
 * Check `.cloudcannon/structures/*Sections.*.yml` against the two-tier policy in
 * `.agents/skills/create-component/cloudcannon-yaml.md`: each tier lists its exact
 * set, and no exclusion is reachable anyway through an allowed wrapper.
 *
 *   node scripts/cms/lint-nesting.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");
const dir = join(root, ".cloudcannon", "structures");

const LAYOUT_WRAPPERS = ["card-grid", "content-selector", "grid", "masonry", "split"];
const CONTENT_BLOCKS = ["accordion", "button-group", "card", "form", "steps"];

const WIDE = ["containerSections", "splitSections", "contentSelectorSections"];
const NARROW = [
  "cardSections",
  "gridItemSections",
  "masonryItemSections",
  "accordionSections",
  "stepsItemSections",
];

/** The context a component's own slot exposes. `null` = no slot. */
const CHILD_CONTEXT = {
  accordion: "accordionSections",
  "button-group": null,
  card: "cardSections",
  "card-grid": "cardSections",
  "content-selector": "contentSelectorSections",
  form: null,
  grid: "gridItemSections",
  masonry: "masonryItemSections",
  split: "splitSections",
  steps: "stepsItemSections",
};

const contexts = [...WIDE, ...NARROW];
const allowed = new Map();

for (const name of contexts) {
  const text = readFileSync(join(dir, `${name}.cloudcannon.structures.yml`), "utf8");
  const set = new Set();

  for (const line of text.split("\n")) {
    const match = line.match(
      /^\s*-\s*\/src\/components\/building-blocks\/(?:wrappers|forms)\/([a-z0-9-]+)\//
    );

    if (match) set.add(match[1]);
  }

  allowed.set(name, set);
}

const failures = [];

for (const [tier, names, expected] of [
  ["wide", WIDE, [...LAYOUT_WRAPPERS, ...CONTENT_BLOCKS]],
  ["narrow", NARROW, CONTENT_BLOCKS],
]) {
  for (const name of names) {
    const set = allowed.get(name);
    const missing = expected.filter((component) => !set.has(component)).sort();
    const extra = [...set].filter((component) => !expected.includes(component)).sort();

    if (missing.length) failures.push(`${name} (${tier}) is missing: ${missing.join(", ")}`);
    if (extra.length) failures.push(`${name} (${tier}) should not list: ${extra.join(", ")}`);
  }
}

/** Components reachable from a context through the wrappers it allows. */
function reachable(name) {
  const seen = new Set();
  const queue = [name];
  const visited = new Set();

  while (queue.length) {
    const current = queue.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    for (const component of allowed.get(current) ?? []) {
      seen.add(component);

      const child = CHILD_CONTEXT[component];

      if (child) queue.push(child);
    }
  }

  return seen;
}

for (const name of contexts) {
  const set = allowed.get(name);
  const illusory = [...reachable(name)].filter((component) => !set.has(component)).sort();

  if (illusory.length) {
    failures.push(
      `${name} excludes ${illusory.join(", ")} but a wrapper it allows reaches them anyway`
    );
  }
}

if (failures.length === 0) {
  console.log(
    `lint:nesting: ${contexts.length} contexts, both tiers uniform, no exclusions routed around.`
  );
  process.exit(0);
}

console.error(`lint:nesting: ${failures.length} problem(s).\n`);
console.error(
  "The policy is in .agents/skills/create-component/cloudcannon-yaml.md —\n" +
    "wide contexts take every wrapper, narrow contexts take content blocks only.\n"
);

for (const failure of failures) console.error(`  ${failure}`);

process.exit(1);
