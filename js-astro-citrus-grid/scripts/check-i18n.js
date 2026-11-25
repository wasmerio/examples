import { readFileSync } from 'node:fs'
import path from 'node:path'

const LANGS = ['zh', 'ja', 'en']
const BASE = 'zh'

function collectKeys(value, prefix = '') {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return [prefix]
  return Object.entries(value).flatMap(([k, v]) => collectKeys(v, `${prefix}${k}.`))
}

function loadKeys(lang) {
  const file = path.resolve(process.cwd(), 'src', 'i18n', `${lang}.json`)
  const json = JSON.parse(readFileSync(file, 'utf8'))
  return collectKeys(json).map((k) => k.replace(/\.$/, ''))
}

const keys = Object.fromEntries(LANGS.map((lang) => [lang, new Set(loadKeys(lang))]))
const base = keys[BASE]

let failed = false
for (const lang of LANGS) {
  if (lang === BASE) continue
  const missing = [...base].filter((k) => !keys[lang].has(k))
  const extra = [...keys[lang]].filter((k) => !base.has(k))
  if (missing.length) {
    failed = true
    console.error(
      `[check-i18n] ${lang}.json is missing ${missing.length} key(s) present in ${BASE}.json:`,
    )
    for (const k of missing.sort()) console.error(`  - ${k}`)
  }
  if (extra.length) {
    failed = true
    console.error(
      `[check-i18n] ${lang}.json has ${extra.length} extra key(s) not present in ${BASE}.json:`,
    )
    for (const k of extra.sort()) console.error(`  + ${k}`)
  }
}

if (failed) {
  console.error(`[check-i18n] FAILED: key sets differ across ${LANGS.join(' / ')}`)
  process.exit(1)
}
console.log(`[check-i18n] OK: ${LANGS.join(' / ')} share the same ${base.size} keys`)
