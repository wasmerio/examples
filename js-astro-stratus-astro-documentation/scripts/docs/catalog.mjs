/**
 * Regenerate the component tables in the page-content-authoring skill and the
 * README component counts from each component's own YAML. Never hand-edit them.
 *
 *   npm run docs:catalog          rewrite the generated blocks
 *   npm run docs:catalog:check    fail if they are stale
 */
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { glob } from "glob";
import * as yaml from "js-yaml";

const root = join(import.meta.dirname, "..", "..");
const catalogPath = join(root, ".agents/skills/page-content-authoring/component-catalog.md");
const readmePath = join(root, "README.md");
const check = process.argv.includes("--check");

/** Props every page section shares; listed once in the skill, not per row. */
const SECTION_SHELL = new Set([
  "sectionLabel",
  "maxContentWidth",
  "paddingHorizontal",
  "paddingVertical",
  "colorScheme",
  "lockColorScheme",
  "backgroundColor",
  "background",
  "spaceBefore",
]);

const PAGE_SECTION_ORDER = [
  "heroes",
  "builders",
  "collections",
  "conversion",
  "explainers",
  "proof",
];
const BUILDING_BLOCK_ORDER = [
  ["core-elements", "Core elements"],
  ["wrappers", "Wrappers"],
  ["forms", "Forms"],
];

const titleCase = (slug) =>
  slug.replace(/(^|-)([a-z])/g, (_, sep, char) => (sep ? " " : "") + char.toUpperCase());

function loadComponents() {
  const files = glob
    .sync("src/components/**/*.cloudcannon.structure-value.yml", { cwd: root })
    .sort();

  return files.flatMap((file) => {
    const dir = dirname(file);
    const slug = basename(file).replace(".cloudcannon.structure-value.yml", "");
    const structure = yaml.load(readFileSync(join(root, file), "utf8"));
    const key = structure?.value?._component;

    if (!key) return [];

    let inputs = {};

    try {
      inputs =
        yaml.load(readFileSync(join(root, dir, `${slug}.cloudcannon.inputs.yml`), "utf8")) ?? {};
    } catch {
      /* Inputs are optional. */
    }

    return [{ key, slug, dir, structure, inputs }];
  });
}

/** `variant` → "`variant` (`a`/`b`)", `items` → "`items[]`", prose → "`text` (markdown)". */
function describeProp(name, value, inputs) {
  const input = inputs[name];
  const values = input?.options?.values;

  if (Array.isArray(values) && values.length && values.length <= 12) {
    const ids = values.map((option) => (typeof option === "string" ? option : option.id));

    if (ids.every((id) => id !== undefined)) {
      return `\`${name}\` (${ids.map((id) => `\`${id}\``).join("/")})`;
    }
  }

  if (Array.isArray(value)) return `\`${name}[]\``;
  if (input?.type === "markdown") return `\`${name}\` (markdown)`;

  return `\`${name}\``;
}

function contentProps(component, { dropShell }) {
  const value = component.structure?.value ?? {};

  return Object.keys(value)
    .filter((name) => name !== "_component")
    .filter((name) => !(dropShell && SECTION_SHELL.has(name)))
    .map((name) => describeProp(name, value[name], component.inputs))
    .join(", ");
}

function table(rows, keyHeader) {
  const header = [keyHeader, "Use for", "Key content props"];
  const widths = header.map((cell, i) =>
    Math.max(cell.length, ...rows.map((row) => row[i].length))
  );
  const line = (cells) => `| ${cells.map((c, i) => c.padEnd(widths[i])).join(" | ")} |`;

  return [
    line(header),
    `| ${widths.map((w) => "-".repeat(w)).join(" | ")} |`,
    ...rows.map(line),
  ].join("\n");
}

const components = loadComponents();

function pageSectionsBlock() {
  const byCategory = new Map();

  for (const component of components) {
    const match = component.key.match(/^page-sections\/([^/]+)\//);

    if (!match) continue;
    const list = byCategory.get(match[1]) ?? [];

    list.push(component);
    byCategory.set(match[1], list);
  }

  const categories = [
    ...PAGE_SECTION_ORDER.filter((name) => byCategory.has(name)),
    ...[...byCategory.keys()].filter((name) => !PAGE_SECTION_ORDER.includes(name)).sort(),
  ];

  return categories
    .map((category) => {
      const rows = byCategory
        .get(category)
        .map((component) => [
          `\`${component.key}\``,
          String(component.structure.description ?? "").trim(),
          contentProps(component, { dropShell: true }),
        ]);

      return `### ${titleCase(category)}\n\n${table(rows, "`_component`")}`;
    })
    .join("\n\n");
}

function buildingBlocksBlock() {
  return BUILDING_BLOCK_ORDER.filter(([tier]) =>
    components.some((component) => component.key.startsWith(`building-blocks/${tier}/`))
  )
    .map(([tier, heading]) => {
      const rows = components
        .filter((component) => component.key.startsWith(`building-blocks/${tier}/`))
        .map((component) => [
          `\`${component.key.split("/").pop()}\``,
          String(component.structure.description ?? "").trim(),
          contentProps(component, { dropShell: true }),
        ]);

      return `### ${heading} — \`building-blocks/${tier}/<slug>\`\n\n${table(rows, "`<slug>`")}`;
    })
    .join("\n\n");
}

function countsBlock() {
  const tally = (prefix) =>
    components.filter((component) => component.key.startsWith(prefix)).length;
  const sections = tally("page-sections/");
  const blocks = tally("building-blocks/");
  const navBlocks = tally("navigation/");
  const chromeDirs = new Set(
    glob
      .sync("src/components/navigation/*/", { cwd: root })
      .map((dir) => basename(dir.replace(/\/$/, "")))
  );

  for (const component of components) {
    if (component.key.startsWith("navigation/")) chromeDirs.delete(component.key.split("/").pop());
  }

  const icons = glob.sync("src/icons/**/*.svg", { cwd: root }).length;

  return (
    `${sections + blocks + navBlocks} page-builder components — ${sections} page sections, ` +
    `${blocks} building blocks and ${navBlocks} navigation blocks — plus\n` +
    `${chromeDirs.size} pieces of site chrome and ${icons} icons.`
  );
}

function replaceBlock(source, name, body) {
  const start = source.indexOf(`<!-- generated:catalog:${name}:start`);
  const startEnd = source.indexOf("-->", start) + 3;
  const end = source.indexOf(`<!-- generated:catalog:${name}:end -->`);

  if (start === -1 || end === -1) {
    throw new Error(`a generated file is missing the ${name} markers`);
  }

  return `${source.slice(0, startEnd)}\n\n${body}\n\n${source.slice(end)}`;
}

const targets = [
  {
    path: catalogPath,
    name: "component-catalog.md",
    original: readFileSync(catalogPath, "utf8"),
    blocks: [
      ["page-sections", pageSectionsBlock()],
      ["building-blocks", buildingBlocksBlock()],
    ],
  },
  {
    path: readmePath,
    name: "README.md",
    original: readFileSync(readmePath, "utf8"),
    blocks: [["counts", countsBlock()]],
  },
];

const stale = [];

for (const target of targets) {
  target.next = target.blocks.reduce(
    (source, [name, body]) => replaceBlock(source, name, body),
    target.original
  );

  if (target.next !== target.original) stale.push(target);
}

if (stale.length === 0) {
  console.log(`ok     component catalog is up to date (${components.length} components).`);
  process.exit(0);
}

if (check) {
  console.error(
    `FAIL   ${stale.map((target) => target.name).join(" and ")} stale. Run \`npm run docs:catalog\`.`
  );
  process.exit(1);
}

for (const target of stale) writeFileSync(target.path, target.next);
console.log(
  `Rewrote ${stale.map((target) => target.name).join(" and ")} (${components.length} components).`
);
