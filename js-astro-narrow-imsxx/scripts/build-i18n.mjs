// Generate typed dictionaries from the upstream i18n TOML files.
// Run: node scripts/build-i18n.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "smol-toml"

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, "../upstream/hugo-narrow/i18n")
const target = join(here, "../src/i18n")

const SKIP = new Set(["zh-hans.toml", "en.toml"])
const ARRAY_KEYS = new Set(["searchHints"])
const RANGE_KEYS = new Set(["pageInfo", "seriesPartOf"])

const placeholder = /\{\{\s*\.(\w+)\s*\}\}/g

const escape = (value) =>
  value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")

/** Replace Hugo placeholders with template literals, using fixed param names. */
function template(value) {
  const body = escape(value).replace(placeholder, (_, name) => {
    if (name === "count") return "${n}"
    return "${" + name + "}"
  })
  return "`" + body + "`"
}

function hasCount(value) {
  return /\{\{\s*\.count\s*\}\}/.test(value)
}

function hasRange(value) {
  return (
    /\{\{\s*\.current\s*\}\}/.test(value) || /\{\{\s*\.total\s*\}\}/.test(value)
  )
}

function convertValue(key, value, indent) {
  const pad = "  ".repeat(indent)

  if (typeof value === "string") {
    if (ARRAY_KEYS.has(key)) {
      const parts = value.split("|").map((part) => JSON.stringify(part.trim()))
      return `[${parts.join(", ")}]`
    }
    if (RANGE_KEYS.has(key) || hasRange(value)) {
      return `(current, total) => ${template(value)}`
    }
    if (hasCount(value)) {
      return `(n) => ${template(value)}`
    }
    if (/%[ds]/.test(value)) {
      const body = escape(value).replace(/%[ds]/g, "${n}")
      return `(n) => \`${body}\``
    }
    return JSON.stringify(value)
  }

  if (value && typeof value === "object") {
    if ("one" in value || "other" in value) {
      const one = value.one ?? value.other
      const other = value.other ?? value.one
      if (hasCount(other)) {
        return `(n) => (n === 1 ? ${template(one)} : ${template(other)})`
      }
      return `(n) => ${JSON.stringify(other)}`
    }

    const entries = Object.entries(value).map(
      ([childKey, childValue]) =>
        `${pad}  ${JSON.stringify(childKey)}: ${convertValue(childKey, childValue, indent + 1)},`,
    )
    return `{\n${entries.join("\n")}\n${pad}}`
  }

  return JSON.stringify(value)
}

const files = readdirSync(source).filter(
  (name) => name.endsWith(".toml") && !SKIP.has(name),
)

for (const file of files) {
  const locale = file.replace(/\.toml$/, "")
  const data = parse(readFileSync(join(source, file), "utf8"))
  const body = Object.entries(data)
    .map(
      ([key, value]) =>
        `  ${JSON.stringify(key)}: ${convertValue(key, value, 1)},`,
    )
    .join("\n")

  const name = locale.replace(/-/g, "_")
  const content = `// Generated from upstream i18n/${file} by scripts/build-i18n.mjs
import type { DeepPartial, Dict } from "./zh-hans"

export const ${name}: DeepPartial<Dict> = {
${body}
}
`
  writeFileSync(join(target, `${locale}.ts`), content, "utf8")
  console.log("generated", `${locale}.ts`)
}
