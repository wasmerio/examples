import {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleMeta,
  type Locale,
} from "@/config/locales"
import { SITE_CONFIG } from "@/config/site"

export function withTrailingSlash(path: string): string {
  if (path === "") return "/"
  return path.endsWith("/") ? path : `${path}/`
}

export function normalizePath(path: string): string {
  const next = path.startsWith("/") ? path : `/${path}`
  return withTrailingSlash(next)
}

export function localePath(locale: Locale, path = "/"): string {
  const normalized = normalizePath(path)
  return withTrailingSlash(`/${locale}${normalized === "/" ? "" : normalized}`)
}

export function canonicalUrl(locale: Locale, path = "/"): string {
  return `${SITE_CONFIG.url}${localePath(locale, path)}`
}

export function buildAlternates(path = "/"): Record<string, string> {
  const entries = Object.fromEntries(
    LOCALES.map((locale) => [
      getLocaleMeta(locale).hreflang,
      canonicalUrl(locale, path),
    ])
  )
  return { ...entries, "x-default": canonicalUrl(DEFAULT_LOCALE, path) }
}
