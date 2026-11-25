import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const TARGETS = [
  '.astro',
  path.join('node_modules', '.astro'),
  path.join('node_modules', '.cache', 'jiti'),
]

for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel)
  if (!existsSync(abs)) continue
  rmSync(abs, { recursive: true, force: true })
  // 已删除：
  console.log(`[clean-cache] removed ${rel}`)
}
