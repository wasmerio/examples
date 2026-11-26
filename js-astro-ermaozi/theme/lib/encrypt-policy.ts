import type { ContentEntry } from './content.ts'
import { routeOf } from './content.ts'
import { siteConfig } from '../../site.config.mjs'

type Password = string | number
type EncryptConfig = {
  global?: boolean
  admin?: Password | Password[]
  rules?: Record<string, Password | Password[]>
}

const passwords = (value?: Password | Password[]) => (Array.isArray(value) ? value : value === undefined ? [] : [value]).map(String).filter(Boolean)

export const matchesEncryptRule = (match: string, route: string, filePath = '') => {
  if (match.startsWith('^')) {
    try {
      const regex = new RegExp(match)
      return regex.test(route) || regex.test(filePath)
    } catch {
      return false
    }
  }
  if (match.endsWith('.md')) return filePath.endsWith(match)
  return route.startsWith(match) || filePath.startsWith(match.replace(/^\//, ''))
}

export const encryptionPolicy = (entry: ContentEntry, config = siteConfig.encrypt as EncryptConfig | undefined) => {
  const route = routeOf(entry)
  const filePath = entry.filePath ?? entry.id
  const credentials: Array<{ password: string, scope: string }> = []
  for (const password of passwords(entry.data.password as Password | Password[] | undefined)) credentials.push({ password, scope: `page:${route}` })
  for (const [match, value] of Object.entries(config?.rules ?? {})) {
    if (matchesEncryptRule(match, route, filePath)) {
      for (const password of passwords(value)) credentials.push({ password, scope: `rule:${match}` })
    }
  }
  const pageEncrypted = credentials.length > 0
  if (pageEncrypted) {
    for (const password of passwords(config?.admin)) credentials.push({ password, scope: '__admin__' })
  }
  return {
    global: Boolean(config?.global && passwords(config.admin).length),
    pageEncrypted,
    credentials: credentials.filter((credential, index, list) => list.findIndex(item => item.password === credential.password && item.scope === credential.scope) === index),
  }
}

export const globalAdminCredentials = (config = siteConfig.encrypt as EncryptConfig | undefined) => passwords(config?.admin).map(password => ({ password, scope: '__admin__' }))
