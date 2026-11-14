import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = await fs.readFile(path.join(root, '_shared/starter-ui/wasmer-starter-ui.js'), 'utf8')
const hash = createHash('sha256').update(source).digest('hex')
const output = `// Generated from _shared/starter-ui/wasmer-starter-ui.js; SHA256 ${hash}\n${source}`
const checking = process.argv.includes('--check')
const destinations = process.argv.slice(2).filter(arg => arg !== '--check')
if (!destinations.length) throw new Error('Pass the destination JS file paths, relative to the repository root.')
for (const destination of destinations) {
  const target = path.resolve(root, destination)
  if (!target.startsWith(root + path.sep)) throw new Error('Destination must stay inside the repository.')
  if (checking) {
    if (await fs.readFile(target, 'utf8') !== output) throw new Error(`Stale starter UI: ${destination}`)
  } else {
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, output)
  }
  console.log(`${checking ? 'Verified' : 'Wrote'} ${destination} (${hash})`)
}
