import { config } from '../site-config'

/** Accept BCP 47 tags and the human-readable values used by older posts. */
function languageTag(value?: string): string | undefined {
  const name = value?.trim()
  if (!name) return undefined
  const aliases: Record<string, string> = { '中文': 'zh-CN', english: 'en' }
  try {
    return Intl.getCanonicalLocales(aliases[name.toLowerCase()] ?? name)[0]
  } catch {
    return undefined
  }
}

export const siteLanguage = languageTag(config.site.lang) ?? 'en'
export const isChineseUI = /^zh(?:-|$)/i.test(siteLanguage)
export const articleLanguage = (value?: string) => languageTag(value) ?? siteLanguage

export function ui(english: string, chinese: string): string {
  return isChineseUI ? chinese : english
}

export function readingTimeLabel(minutes: number): string {
  return ui(`${minutes} min read`, `阅读约 ${minutes} 分钟`)
}
