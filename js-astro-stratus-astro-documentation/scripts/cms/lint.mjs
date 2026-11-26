/**
 * Lint the CloudCannon CMS layer against the Astro components it configures.
 *
 *   node scripts/cms/lint.mjs
 *
 * FAILs exit 1; WARNs never fail — they are for checks that can't be made
 * false-positive free.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { glob } from "glob";
import { componentKeyFromPath, pascalToKebab } from "../../src/components/utils/componentKey.mjs";
import {
  parseDestructure,
  loadYaml,
  collectComponentRefs,
  frontmatter,
  isMainComponentFile,
  NON_PROP_KEY,
} from "../lib/componentModel.mjs";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");
const rel = (p) => relative(root, p);

const fails = [];
const warns = [];
const oks = [];
const fail = (file, reason) => fails.push({ file, reason });
const warn = (file, reason) => warns.push({ file, reason });
const ok = (label) => oks.push(label);

// `_component` key → input names the component doesn't read, downgraded from FAIL
// to WARN. A temporary bridge only: remove the entry once the input is fixed.
const KNOWN_DEAD_INPUTS = {};

const componentsDir = join(root, "src", "components");
const astroPaths = (await glob("**/*.astro", { cwd: componentsDir })).sort();

const componentKeys = new Set();
const mainByDir = new Map();

for (const relToComponents of astroPaths) {
  const astroAbs = join(componentsDir, relToComponents);

  componentKeys.add(componentKeyFromPath(relToComponents));

  if (isMainComponentFile(astroAbs)) {
    const parsed = parseDestructure(readFileSync(astroAbs, "utf8"));

    mainByDir.set(dirname(astroAbs), { astroAbs, parsed });
  }
}

// Check 1 — Prop drift (FAIL): every inputs.yml key and structure-value `value:`
// key must be a prop the component destructures.

for (const [dir, { astroAbs, parsed }] of mainByDir) {
  if (!parsed) continue;
  const destructured = parsed.props;
  const componentKey = componentKeyFromPath(relative(componentsDir, astroAbs));
  const knownDead = new Set(KNOWN_DEAD_INPUTS[componentKey] || []);

  const report = (yamlAbs, label, strayKeys) => {
    const stray = [...new Set(strayKeys)];
    const dead = stray.filter((k) => knownDead.has(k));
    const broken = stray.filter((k) => !knownDead.has(k));

    if (broken.length)
      fail(rel(yamlAbs), `${label} not destructured in ${rel(astroAbs)}: ${broken.join(", ")}`);
    if (dead.length)
      warn(rel(yamlAbs), `known dead input(s), not read by ${rel(astroAbs)}: ${dead.join(", ")}`);
    if (!broken.length && !dead.length) ok(`prop drift  ${rel(yamlAbs)}`);
  };

  const inputsAbs = join(dir, `${dir.split("/").pop()}.cloudcannon.inputs.yml`);

  if (existsSync(inputsAbs)) {
    const inputs = loadYaml(inputsAbs) || {};
    const stray = Object.keys(inputs)
      .filter((k) => !NON_PROP_KEY(k))
      // CloudCannon addresses nested inputs with dotted keys (`background.type`)
      // and array items with `name[*]`; the actual prop is the first segment.
      .map((k) => k.split(".")[0].replace(/\[\*\]$/, ""))
      .filter((k) => !destructured.has(k));

    report(inputsAbs, "input key(s)", stray);
  }

  const valueAbs = join(dir, `${dir.split("/").pop()}.cloudcannon.structure-value.yml`);

  if (existsSync(valueAbs)) {
    const value = (loadYaml(valueAbs) || {}).value || {};
    const stray = Object.keys(value)
      .filter((k) => k !== "_component" && !NON_PROP_KEY(k))
      .filter((k) => !destructured.has(k));

    report(valueAbs, "default value key(s)", stray);
  }
}

// Check 2 — Missing structure-value (FAIL): every main component (kebab filename ===
// dir name) under building-blocks/ and page-sections/. Child components have none.

for (const relToComponents of astroPaths) {
  const scoped =
    relToComponents.startsWith("building-blocks/") || relToComponents.startsWith("page-sections/");

  if (!scoped) continue;
  const astroAbs = join(componentsDir, relToComponents);

  if (!isMainComponentFile(astroAbs)) continue;

  const dir = dirname(astroAbs);
  const valueAbs = join(dir, `${dir.split("/").pop()}.cloudcannon.structure-value.yml`);

  if (existsSync(valueAbs)) ok(`has structure ${rel(astroAbs)}`);
  else fail(rel(astroAbs), "main component has no sibling *.cloudcannon.structure-value.yml");
}

// Check 3 — Orphaned YAML (FAIL): every *.cloudcannon.*.yml needs a sibling .astro
// whose kebab filename equals the YAML's prefix.

const yamlPaths = (await glob("**/*.cloudcannon.*.yml", { cwd: componentsDir })).sort();

for (const relYaml of yamlPaths) {
  const yamlAbs = join(componentsDir, relYaml);
  const prefix = relYaml.split("/").pop().split(".cloudcannon.")[0];
  const dir = dirname(yamlAbs);
  const siblingMatch = readdirSync(dir)
    .filter((f) => f.endsWith(".astro"))
    .some((f) => pascalToKebab(f.replace(/\.astro$/, "")) === prefix);

  if (siblingMatch) ok(`co-located  ${rel(yamlAbs)}`);
  else fail(rel(yamlAbs), `no sibling .astro whose kebab name is "${prefix}"`);
}

// Check 1b — Default-value drift (FAIL): a knob's structure-value seed must equal
// its literal destructure default. Prose inputs, SAMPLE_SEEDS and expression or
// absent defaults are skipped.

const KNOB_INPUT_TYPES = new Set([
  "checkbox",
  "multiselect",
  "number",
  "range",
  "select",
  "switch",
]);

// Number knobs that seed starting content, so the seed differs from the fallback.
const SAMPLE_SEEDS = {
  "building-blocks/core-elements/counter": ["number"],
  "building-blocks/core-elements/rating": ["value"],
};

// Real value lives in `src/data/*.json`; the destructure default is only a fail-safe.
const DATA_BACKED = new Set([
  "navigation/main-nav",
  "navigation/announcement-bar",
  "navigation/footer",
]);

const asLiteral = (raw) => {
  if (raw === undefined) return { literal: false };

  const text = raw.trim();

  if (text === "true") return { literal: true, value: true };
  if (text === "false") return { literal: true, value: false };
  if (text === "null") return { literal: true, value: null };
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return { literal: true, value: Number(text) };
  if (/^"[^"\\]*"$/.test(text) || /^'[^'\\]*'$/.test(text)) {
    return { literal: true, value: text.slice(1, -1) };
  }

  return { literal: false };
};

for (const [dir, { astroAbs, parsed }] of mainByDir) {
  if (!parsed) continue;

  const valueAbs = join(dir, `${dir.split("/").pop()}.cloudcannon.structure-value.yml`);

  if (!existsSync(valueAbs)) continue;

  const componentKey = componentKeyFromPath(relative(componentsDir, astroAbs));

  if (DATA_BACKED.has(componentKey)) continue;

  const sampleSeeds = new Set(SAMPLE_SEEDS[componentKey] || []);
  const inputsAbs = join(dir, `${dir.split("/").pop()}.cloudcannon.inputs.yml`);
  const inputs = existsSync(inputsAbs) ? loadYaml(inputsAbs) || {} : {};
  const value = (loadYaml(valueAbs) || {}).value || {};
  const drift = [];

  for (const [key, seeded] of Object.entries(value)) {
    if (key === "_component" || NON_PROP_KEY(key)) continue;
    if (!parsed.props.has(key) || sampleSeeds.has(key)) continue;
    if (seeded !== null && typeof seeded === "object") continue;
    if (!KNOB_INPUT_TYPES.has(inputs[key]?.type)) continue;

    const fallback = asLiteral(parsed.defaults.get(key));

    if (!fallback.literal || fallback.value === seeded) continue;

    drift.push(
      `${key}: seed ${JSON.stringify(seeded)} vs default ${JSON.stringify(fallback.value)}`
    );
  }

  if (drift.length) fail(rel(valueAbs), `default drift vs ${rel(astroAbs)} — ${drift.join("; ")}`);
  else ok(`defaults    ${rel(valueAbs)}`);
}

// Check 3b — Input-group coverage (FAIL): with a `groups` block, every `value:` key
// sits in exactly one group, or a new prop silently lands among ungrouped inputs.

for (const relYaml of yamlPaths.filter(
  (p) => p.startsWith("page-sections/") && p.endsWith(".structure-value.yml")
)) {
  const yamlAbs = join(componentsDir, relYaml);
  const doc = loadYaml(yamlAbs) || {};

  if (!Array.isArray(doc.groups)) {
    warn(
      rel(yamlAbs),
      "page section has no `groups` block — settings inputs present as peers of content"
    );
    continue;
  }
  const valueKeys = Object.keys(doc.value || {}).filter((k) => k !== "_component");
  const listed = doc.groups.flatMap((g) => g.inputs || []);
  const seen = new Set();
  const dupes = [...new Set(listed.filter((k) => (seen.has(k) ? true : (seen.add(k), false))))];
  const ungrouped = valueKeys.filter((k) => !seen.has(k));
  const unknown = listed.filter((k) => !valueKeys.includes(k));
  const problems = [];

  if (ungrouped.length) problems.push(`value key(s) in no group: ${ungrouped.join(", ")}`);
  if (unknown.length) problems.push(`group input(s) with no value key: ${unknown.join(", ")}`);
  if (dupes.length) problems.push(`input(s) listed in two groups: ${dupes.join(", ")}`);

  if (problems.length) fail(rel(yamlAbs), problems.join("; "));
  else ok(`group cover ${rel(yamlAbs)}`);
}

// Check 3c — `hidden:` takes a boolean or a sibling input name (optionally `!`). An
// expression is read as a name, silently never matches, and passes `lint:schema`.

const HIDDEN_NAME = /^!?[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/;

function checkHidden(abs, node, path = []) {
  if (!node || typeof node !== "object") return;

  for (const [key, value] of Object.entries(node)) {
    if (key === "hidden" && typeof value === "string" && !HIDDEN_NAME.test(value.trim())) {
      fail(
        rel(abs),
        `\`hidden: "${value}"\` at ${path.join(".") || "root"} is an expression, not a sibling input name`
      );
    }
    if (value && typeof value === "object") checkHidden(abs, value, [...path, key]);
  }
}

for (const relYaml of yamlPaths) {
  const abs = join(componentsDir, relYaml);

  checkHidden(abs, loadYaml(abs) || {});
}

// Check 4 — `_component` resolution (FAIL): structure YAML and content frontmatter.

const refSources = [];

for (const relYaml of yamlPaths.filter((p) => p.endsWith(".structure-value.yml"))) {
  const abs = join(componentsDir, relYaml);

  refSources.push([abs, collectComponentRefs(loadYaml(abs))]);
}
for (const abs of (await glob(".cloudcannon/structures/*.yml", { cwd: root })).map((p) =>
  join(root, p)
)) {
  refSources.push([abs, collectComponentRefs(loadYaml(abs))]);
}
const contentFiles = (await glob("src/content/**/*.{md,mdx}", { cwd: root })).map((p) =>
  join(root, p)
);

for (const abs of contentFiles) {
  const fm = frontmatter(readFileSync(abs, "utf8"));

  if (fm) refSources.push([abs, collectComponentRefs(fm)]);
}

for (const [abs, refs] of refSources) {
  const broken = [...new Set(refs)].filter((r) => !componentKeys.has(r));

  if (!refs.length) continue;
  if (broken.length) fail(rel(abs), `unresolved _component: ${broken.join(", ")}`);
  else ok(`refs ok     ${rel(abs)}`);
}

// MDX bodies are matched by regex, not parsed, so only WARN.
for (const abs of contentFiles) {
  const source = readFileSync(abs, "utf8");
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---/, "");
  const bodyRefs = [...body.matchAll(/_component:\s*["']([\w/-]+)["']/g)].map((m) => m[1]);
  const broken = [...new Set(bodyRefs)].filter((r) => !componentKeys.has(r));

  if (broken.length)
    warn(rel(abs), `unresolved _component in body (MDX/JSX): ${broken.join(", ")}`);
}

// Check 5 — `*_from_glob` literal paths must exist (FAIL). Missing `!` exclusions
// and empty globs only WARN — they are no-ops in CloudCannon.

const structureFiles = (await glob(".cloudcannon/structures/*.yml", { cwd: root })).map((p) =>
  join(root, p)
);

for (const abs of structureFiles) {
  const doc = loadYaml(abs) || {};
  const entries = [];
  const walk = (node) => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        if (/_from_glob$/.test(key) && Array.isArray(value)) entries.push(...value);
        else walk(value);
      }
    }
  };

  walk(doc);

  let problems = 0;

  for (const entryRaw of entries) {
    if (typeof entryRaw !== "string") continue;
    const negation = entryRaw.startsWith("!");
    const pattern = (negation ? entryRaw.slice(1) : entryRaw).replace(/^\//, "");
    const isGlob = /[*?[\]{}]/.test(pattern);

    if (isGlob) {
      const matches = await glob(pattern, { cwd: root });

      if (!matches.length)
        warn(rel(abs), `${negation ? "exclusion " : ""}glob matches nothing: ${entryRaw}`);
    } else if (!existsSync(join(root, pattern))) {
      if (negation) warn(rel(abs), `excludes a non-existent file: ${entryRaw}`);
      else {
        fail(rel(abs), `lists a non-existent file: ${entryRaw}`);
        problems += 1;
      }
    }
  }
  if (!problems) ok(`structures  ${rel(abs)}`);
}

// Check 6 — Unseeded input (FAIL): CloudCannon builds a new block from `value:`
// alone, so a visible input with no seeded key never renders a field.
// `hidden: true` and `<name>[*]` keys are exempt.

const hasPath = (obj, path) => {
  let cursor = obj;

  for (const part of path.split(".")) {
    if (cursor == null || typeof cursor !== "object" || !(part in cursor)) return false;
    cursor = cursor[part];
  }
  return true;
};

for (const [dir] of mainByDir) {
  const slug = dir.split("/").pop();
  const inputsAbs = join(dir, `${slug}.cloudcannon.inputs.yml`);
  const valueAbs = join(dir, `${slug}.cloudcannon.structure-value.yml`);

  if (!existsSync(inputsAbs) || !existsSync(valueAbs)) continue;

  const value = (loadYaml(valueAbs) || {}).value || {};
  const unseeded = Object.entries(loadYaml(inputsAbs) || {})
    .filter(
      ([key, cfg]) =>
        !NON_PROP_KEY(key) && !key.endsWith("[*]") && cfg?.hidden !== true && !hasPath(value, key)
    )
    .map(([key]) => key);

  if (unseeded.length) {
    fail(
      rel(inputsAbs),
      `input(s) with no seeded default in ${rel(valueAbs)} — the field will not appear on a newly inserted block: ${unseeded.join(", ")}`
    );
  } else {
    ok(`seeded     ${rel(inputsAbs)}`);
  }
}

// Check 7 — Unconfigured array input (FAIL): a visible `type: array` input without
// a `<name>[*]` sibling or `options.structures` renders as "not configured".

function collectInputMaps(node, out = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectInputMaps(item, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "_inputs" && value && typeof value === "object" && !Array.isArray(value))
        out.push(value);
      collectInputMaps(value, out);
    }
  }
  return out;
}

const arraySources = [];

// An `.inputs.yml` root is itself an input map.
for (const relYaml of yamlPaths) {
  const abs = join(componentsDir, relYaml);
  const doc = loadYaml(abs) || {};
  const maps = collectInputMaps(doc);

  if (relYaml.endsWith(".inputs.yml") && doc && typeof doc === "object") maps.unshift(doc);
  arraySources.push([abs, maps]);
}

for (const abs of [join(root, "cloudcannon.config.yml"), ...structureFiles]) {
  arraySources.push([abs, collectInputMaps(loadYaml(abs) || {})]);
}

for (const [abs, maps] of arraySources) {
  const unconfigured = [];
  let arrayInputs = 0;

  for (const map of maps) {
    const siblings = new Set(Object.keys(map));

    for (const [name, cfg] of Object.entries(map)) {
      if (!cfg || typeof cfg !== "object" || cfg.type !== "array") continue;
      arrayInputs += 1;
      if (cfg.hidden === true) continue;
      if (siblings.has(`${name}[*]`)) continue;
      if (cfg.options?.structures) continue;
      unconfigured.push(name);
    }
  }

  if (unconfigured.length) {
    fail(
      rel(abs),
      `array input(s) with no item configuration — CloudCannon renders these as "not configured" and the editor cannot add items. Add a \`<name>[*]\` sub-input or \`options.structures\`: ${[...new Set(unconfigured)].join(", ")}`
    );
  } else if (arrayInputs) {
    ok(`array items ${rel(abs)}`);
  }
}

// Check 8 — `_structures.<name>` must be in scope for the document (same file, its
// own `_structures_from_glob`, or root config), or the array silently renders as free text.

const globalStructureNames = new Set();

{
  const config = loadYaml(join(root, "cloudcannon.config.yml")) || {};

  for (const name of Object.keys(config._structures || {})) globalStructureNames.add(name);
  for (const pattern of config._structures_from_glob || [])
    for (const file of await glob(pattern.replace(/^\//, ""), { cwd: root }))
      for (const name of Object.keys(loadYaml(join(root, file)) || {}))
        globalStructureNames.add(name);
}

function collectStructureRefs(node, out = new Set()) {
  if (Array.isArray(node)) {
    for (const item of node) collectStructureRefs(item, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "structures" && typeof value === "string" && value.startsWith("_structures."))
        out.add(value.slice("_structures.".length));
      else collectStructureRefs(value, out);
    }
  }
  return out;
}

async function collectStructureNames(node, out = new Set()) {
  if (Array.isArray(node)) {
    for (const item of node) await collectStructureNames(item, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "_structures" && value && typeof value === "object" && !Array.isArray(value))
        for (const name of Object.keys(value)) out.add(name);
      if (key === "_structures_from_glob" && Array.isArray(value))
        for (const pattern of value)
          for (const file of await glob(pattern.replace(/^\//, ""), { cwd: root }))
            for (const name of Object.keys(loadYaml(join(root, file)) || {})) out.add(name);
      await collectStructureNames(value, out);
    }
  }
  return out;
}

function collectInputGlobs(node, out = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectInputGlobs(item, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "_inputs_from_glob" && Array.isArray(value)) out.push(...value);
      collectInputGlobs(value, out);
    }
  }
  return out;
}

// An `inputs.yml` is never its own scope: it is checked via each document that globs it in.
const structureScopes = [
  join(root, "cloudcannon.config.yml"),
  ...structureFiles,
  ...yamlPaths
    .filter(
      (relYaml) => relYaml.endsWith(".structure-value.yml") || relYaml.endsWith(".snippets.yml")
    )
    .map((relYaml) => join(componentsDir, relYaml)),
];

for (const abs of structureScopes) {
  const doc = loadYaml(abs) || {};
  const inScope = new Set([...globalStructureNames, ...(await collectStructureNames(doc))]);
  const needed = collectStructureRefs(doc);

  for (const pattern of collectInputGlobs(doc))
    for (const file of await glob(pattern.replace(/^\//, ""), { cwd: root }))
      collectStructureRefs(loadYaml(join(root, file)), needed);

  const unresolved = [...needed].filter((name) => !inScope.has(name));

  if (unresolved.length) {
    fail(
      rel(abs),
      `\`options.structures\` names structure(s) this document cannot see — CloudCannon renders the array as free text with no error. Move them to .cloudcannon/structures/, or add a \`_structures_from_glob\` entry: ${unresolved.join(", ")}`
    );
  } else if (needed.size) {
    ok(`structure refs ${rel(abs)}`);
  }
}

for (const label of oks) console.log(`ok     ${label}`);
for (const { file, reason } of warns) console.warn(`WARN   ${file}\n   ${reason}`);
for (const { file, reason } of fails) console.error(`FAIL   ${file}\n   ${reason}`);

console.log(
  `\n${oks.length} ok, ${warns.length} warning(s), ${fails.length} failure(s) across the CMS layer.`
);

if (fails.length) {
  console.error(`\nCMS drift detected. Fix the component or its co-located *.cloudcannon.*.yml.`);
  process.exit(1);
}

// An empty run means a glob path regressed.
if (!oks.length && !warns.length) {
  console.error("lint:cms found nothing to check — likely a path/glob bug.");
  process.exit(1);
}
