import { readFileSync } from 'node:fs'
import path from 'node:path'

const FILE = path.resolve(process.cwd(), 'src', 'lib', 'url.ts')
const src = readFileSync(FILE, 'utf8')

const CONSTS = ['ASSET_EXT_RE', 'RESERVED_PATH_RE']

function constLiteral(name) {
  const m = src.match(new RegExp(`const ${name} = (/(?:\\\\.|[^\\\\/])+/[a-z]*)`))
  return m ? m[1] : null
}

function fnBody(name) {
  const start = src.indexOf(`export function ${name}`)
  if (start < 0) return null
  const rest = src.slice(start)
  const end = rest.indexOf('\n}')
  return end < 0 ? rest : rest.slice(0, end + 2)
}

const problems = []
const swupBody = fnBody('shouldIgnoreSwup')
const assetBody = fnBody('isAssetUrl')

if (!swupBody) problems.push('shouldIgnoreSwup function not found')
if (!assetBody) problems.push('isAssetUrl function not found')

for (const name of CONSTS) {
  const literal = constLiteral(name)
  if (!literal) {
    problems.push(`regex literal for const ${name} not found`)
    continue
  }
  if (swupBody && !swupBody.includes(literal)) {
    problems.push(
      `inline copy in shouldIgnoreSwup is out of sync with ${name}; expected the function body to contain the literal ${literal}`,
    )
  }
  if (assetBody && !assetBody.includes(name)) {
    problems.push(
      `isAssetUrl does not reference const ${name}; reuse the const instead of writing another regex literal`,
    )
  }
}

if (problems.length) {
  console.error(
    '[check-swup-ignore] FAILED: inline regexes in shouldIgnoreSwup are out of sync with the const definitions',
  )
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(
  `[check-swup-ignore] OK: inline regexes in shouldIgnoreSwup match ${CONSTS.join(' / ')} verbatim; isAssetUrl reuses the consts`,
)
