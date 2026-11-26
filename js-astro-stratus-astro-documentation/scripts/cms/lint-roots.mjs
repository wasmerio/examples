/**
 * Flag prop-driven attributes on the root of any component CloudCannon can make a
 * region root. The re-render keeps the root and swaps its contents, so such an
 * attribute goes stale; see `.agents/skills/editable-regions/SKILL.md`. Region
 * wiring, `aria-*` and ALLOWED are skipped.
 *
 *   node scripts/cms/lint-roots.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { glob } from "glob";

const root = join(dirname(new URL(import.meta.url).pathname), "..", "..");

// CloudCannon binds region wiring on the root.
const REGION_ATTRS = new Set([
  "data-editable",
  "data-prop",
  "data-children-prop",
  "data-direction",
  "data-id",
]);

const ALLOWED = [
  // A stale anchor id is harmless until the next reload.
  { attr: "id" },
  // `_flow.css` documents the roots with no child to carry the attribute.
  { attr: "data-space-before", components: ["Video", "Pagination"] },
];

// ARIA must sit on the element with the role; a stale value only affects the editor preview.
const ALLOWED_ARIA = /^aria-/;

const WATCHED = /^(class|class:list|style|role|data-|aria-)/;

function firstElement(source) {
  const fence = source.indexOf("\n---", 3);
  const body = source.startsWith("---") && fence !== -1 ? source.slice(fence + 4) : source;
  let index = 0;

  while (index < body.length) {
    const open = body.indexOf("<", index);

    if (open === -1) return null;

    const next = body[open + 1];

    if (next === "!" || next === "/") {
      index = open + 1;
      continue;
    }
    if (!/[A-Za-z]/.test(next ?? "")) {
      index = open + 1;
      continue;
    }

    let depth = 0;
    let quote = null;

    for (let i = open + 1; i < body.length; i += 1) {
      const char = body[i];

      if (quote) {
        if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "'" || char === "`") quote = char;
      else if (char === "{") depth += 1;
      else if (char === "}") depth -= 1;
      else if (char === ">" && depth === 0) {
        const raw = body.slice(open + 1, i);
        const tag = /^[A-Za-z][\w:.-]*/.exec(raw)?.[0] ?? "";

        return { tag, attrs: raw.slice(tag.length) };
      }
    }

    return null;
  }

  return null;
}

function parseAttrs(text) {
  const attrs = [];
  let i = 0;

  while (i < text.length) {
    while (i < text.length && /[\s\n]/.test(text[i])) i += 1;
    if (i >= text.length) continue;

    if (text[i] === "{") {
      let depth = 0;

      for (; i < text.length; i += 1) {
        if (text[i] === "{") depth += 1;
        else if (text[i] === "}") {
          depth -= 1;
          if (depth === 0) {
            i += 1;
            break;
          }
        }
      }
      continue;
    }

    const nameMatch = /^[^\s=/>]+/.exec(text.slice(i));

    if (!nameMatch) {
      i += 1;
      continue;
    }

    const name = nameMatch[0];

    i += name.length;
    while (i < text.length && /\s/.test(text[i])) i += 1;

    if (text[i] !== "=") {
      attrs.push({ name, value: "" });
      continue;
    }

    i += 1;
    while (i < text.length && /\s/.test(text[i])) i += 1;

    const start = i;

    if (text[i] === "{") {
      let depth = 0;

      for (; i < text.length; i += 1) {
        if (text[i] === "{") depth += 1;
        else if (text[i] === "}") {
          depth -= 1;
          if (depth === 0) {
            i += 1;
            break;
          }
        }
      }
    } else if (text[i] === '"' || text[i] === "'") {
      const quote = text[i];

      i += 1;
      while (i < text.length && text[i] !== quote) i += 1;
      i += 1;
    } else {
      while (i < text.length && !/[\s>]/.test(text[i])) i += 1;
    }

    attrs.push({ name, value: text.slice(start, i) });
  }

  return attrs;
}

/** Destructure bindings (after rename) plus every frontmatter `const`/`let`. */
function propDerivedNames(source) {
  const names = new Set();
  const marker = source.indexOf("= Astro.props");

  if (marker !== -1) {
    const close = source.lastIndexOf("}", marker);
    // A `= {}` default would otherwise be mistaken for the opening brace.
    let depth = 0;
    let open = -1;

    for (let i = close; i >= 0; i -= 1) {
      if (source[i] === "}") depth += 1;
      else if (source[i] === "{") {
        depth -= 1;
        if (depth === 0) {
          open = i;
          break;
        }
      }
    }

    const body = source
      .slice(open + 1, close)
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");

    for (const part of splitTopLevel(body)) {
      const trimmed = part.trim();

      if (!trimmed || trimmed.startsWith("...")) continue;

      const colon = firstTopLevel(trimmed, ":");
      const withoutDefault = (colon === -1 ? trimmed : trimmed.slice(colon + 1)).trim();
      const local = /^[A-Za-z_$][\w$]*/.exec(withoutDefault.replace(/^['"]|['"]$/g, ""))?.[0];

      if (local) names.add(local);
    }
  }

  const fence = source.indexOf("\n---", 3);
  const frontmatter = fence === -1 ? "" : source.slice(0, fence);

  for (const match of frontmatter.matchAll(/^\s*(?:const|let)\s+([A-Za-z_$][\w$]*)/gm)) {
    names.add(match[1]);
  }

  names.delete("className");

  return [...names];
}

/** So `class:list={["text", …]}` isn't read as using a `text` prop. Keeps `${…}`. */
function stripStrings(text) {
  return text
    .replace(/`(?:[^`\\]|\\.)*`/g, (literal) =>
      [...literal.matchAll(/\$\{([^}]*)\}/g)].map((match) => match[1]).join(" ")
    )
    .replace(/"(?:[^"\\]|\\.)*"/g, " ")
    .replace(/'(?:[^'\\]|\\.)*'/g, " ");
}

function splitTopLevel(text) {
  const out = [];
  let depth = 0;
  let quote = null;
  let start = 0;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if ("{[(".includes(char)) depth += 1;
    else if ("}])".includes(char)) depth -= 1;
    else if (char === "," && depth === 0) {
      out.push(text.slice(start, i));
      start = i + 1;
    }
  }
  out.push(text.slice(start));

  return out;
}

function firstTopLevel(text, needle) {
  let depth = 0;
  let quote = null;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if ("{[(".includes(char)) depth += 1;
    else if ("}])".includes(char)) depth -= 1;
    else if (char === needle && depth === 0) return i;
  }

  return -1;
}

const files = (
  await glob("src/components/**/*.astro", { cwd: root, ignore: ["**/utils/**"] })
).sort();
const findings = [];

const kebabOf = (file) =>
  basename(file, ".astro")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

// Item components have no YAML; a parent names them in a `data-id`.
const itemComponents = new Set();

for (const file of files) {
  const source = readFileSync(join(root, file), "utf8");

  for (const match of source.matchAll(/data-id"?\s*[:=]\s*"([^"]+)"/g)) {
    itemComponents.add(match[1].split("/").pop());
  }
}

function isRegionRoot(file) {
  const dir = join(root, dirname(file));
  const kebab = kebabOf(file);

  return (
    itemComponents.has(kebab) ||
    existsSync(join(dir, `${kebab}.cloudcannon.inputs.yml`)) ||
    existsSync(join(dir, `${kebab}.cloudcannon.structure-value.yml`))
  );
}

for (const file of files) {
  if (!isRegionRoot(file)) continue;

  const source = readFileSync(join(root, file), "utf8");
  const props = propDerivedNames(source);

  if (!props.length) continue;

  const element = firstElement(source);

  if (!element) continue;

  const componentName = file
    .split("/")
    .pop()
    .replace(/\.astro$/, "");

  for (const { name, value } of parseAttrs(element.attrs)) {
    if (!WATCHED.test(name)) continue;
    if (REGION_ATTRS.has(name)) continue;
    if (ALLOWED_ARIA.test(name)) continue;
    if (
      ALLOWED.some(
        (rule) =>
          rule.attr === name && (!rule.components || rule.components.includes(componentName))
      )
    ) {
      continue;
    }
    if (!value.startsWith("{")) continue;

    const expression = stripStrings(value);
    const referenced = props.filter((prop) =>
      new RegExp(`(?<![.\\w$])${prop.replace(/[$]/g, "\\$")}(?![\\w$])`).test(expression)
    );

    if (!referenced.length) continue;

    findings.push({
      file: relative(".", file),
      tag: element.tag,
      attr: name,
      props: referenced,
    });
  }
}

if (findings.length === 0) {
  console.log(`lint:roots: ${files.length} components, no prop-driven attributes on roots.`);
  process.exit(0);
}

console.error(
  `lint:roots: ${findings.length} prop-driven attribute(s) on component roots.\n` +
    "These go stale in the CloudCannon editor — move them to a direct child\n" +
    "(see .agents/skills/editable-regions/SKILL.md).\n"
);

for (const finding of findings) {
  console.error(`  ${finding.file}`);
  console.error(`    <${finding.tag} ${finding.attr}> reads ${finding.props.join(", ")}\n`);
}

process.exit(1);
