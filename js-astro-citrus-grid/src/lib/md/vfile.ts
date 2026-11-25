import { fileURLToPath } from 'node:url'

export interface VFileLike {
  path?: string | URL
  history?: string[]
}

export function resolveFilePath(file: VFileLike): string {
  const raw = file.path || file.history?.[0] || ''
  const rawStr = typeof raw === 'string' ? raw : raw.href
  if (!rawStr) return ''
  try {
    return rawStr.startsWith('file:') ? fileURLToPath(rawStr) : rawStr
  } catch {
    return ''
  }
}
