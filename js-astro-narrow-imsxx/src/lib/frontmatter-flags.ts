import { readFileSync } from "node:fs"

type VFileLike = { path?: string }

type Flags = {
  katex?: boolean
  mermaid?: boolean
  lightbox?: boolean
  toc?: boolean
}

const KEYS = ["katex", "mermaid", "lightbox", "toc"] as const
const cache = new Map<string, Flags>()

function parseFrontmatter(raw: string): string {
  const lines = raw.split(/\r?\n/)
  if (lines[0]?.trim() !== "---") return ""
  const end = lines.indexOf("---", 1)
  if (end < 0) return ""
  return lines.slice(1, end).join("\n")
}

/** Read `key: false` or a nested `enabled: false` under `key:`. */
function readFlags(path: string): Flags {
  const cached = cache.get(path)
  if (cached) return cached

  const flags: Flags = {}
  try {
    const front = parseFrontmatter(readFileSync(path, "utf8"))
    const lines = front.split("\n")

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i]
      for (const key of KEYS) {
        const inline = line.match(new RegExp(`^${key}:\\s*(true|false)\\s*$`))
        if (inline) {
          flags[key] = inline[1] === "true"
          continue
        }
        if (new RegExp(`^${key}:\\s*$`).test(line)) {
          for (let j = i + 1; j < lines.length; j += 1) {
            if (!/^\s+/.test(lines[j])) break
            const nested = lines[j].match(/^\s+enabled:\s*(true|false)\s*$/)
            if (nested) {
              flags[key] = nested[1] === "true"
              break
            }
          }
        }
      }
    }
  } catch {
    // Unreadable file: fall back to the site default.
  }

  cache.set(path, flags)
  return flags
}

/**
 * Resolve a page-level toggle from the file being rendered.
 * Returns `undefined` when the page does not override it.
 */
export function pageFlag(file: unknown, key: keyof Flags): boolean | undefined {
  const path = (file as VFileLike | undefined)?.path
  if (!path) return undefined
  return readFlags(path)[key]
}
