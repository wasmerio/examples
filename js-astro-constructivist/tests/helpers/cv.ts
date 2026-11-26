import { readFileSync } from 'node:fs'
import { componentCopy } from '../../src/data/component-copy'
import { cvSchema } from '../../src/data/schema'

export const cv = cvSchema.parse(JSON.parse(readFileSync(new URL('../../cv.json', import.meta.url), 'utf8')))

export const cvBasics = cv.basics

export function uiText(key: string, values: Record<string, string | number> = {}): string {
  const text = cv.ui[key] ?? componentCopy[key] ?? key
  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) => String(values[name] ?? placeholder))
}
