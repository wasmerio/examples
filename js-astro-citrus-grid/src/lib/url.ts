import { siteConfig } from '@/lib/mergedSiteConfig'

export type Lang = 'zh' | 'ja' | 'en'

export const langs: Lang[] = ['zh', 'ja', 'en']

export const defaultLang: Lang = siteConfig.defaultLang

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/')
  if (langs.includes(seg as Lang)) return seg as Lang
  return defaultLang
}

export function localePath(lang: Lang, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const last = p.slice(p.lastIndexOf('/') + 1)
  const isFile = last.includes('.')
  const withSlash = p.length > 1 && !p.endsWith('/') && !isFile ? `${p}/` : p
  return lang === defaultLang ? withSlash : `/${lang}${withSlash === '/' ? '' : withSlash}`
}

const ASSET_EXT_RE = /\.(xml|txt|json|pdf|zip|png|jpe?g|webp|gif|svg|ico|avif|woff2?|ttf|eot)$/i

const RESERVED_PATH_RE = /^\/(pagefind|fonts|images)\//

export function isAssetUrl(path: string): boolean {
  return ASSET_EXT_RE.test(path) || RESERVED_PATH_RE.test(path)
}

export function shouldIgnoreSwup(url: string): boolean {
  if (url.includes('#')) return true
  const path = new URL(url, 'https://example.com').pathname
  return (
    /\.(xml|txt|json|pdf|zip|png|jpe?g|webp|gif|svg|ico|avif|woff2?|ttf|eot)$/i.test(path) ||
    /^\/(pagefind|fonts|images)\//.test(path)
  )
}
