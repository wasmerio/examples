import { baseCopy } from './base-copy'
import { componentCopy } from './component-copy'
import { cv } from './cv'

export const site = cv.site
export const uiCopy: Record<string, string> = {
  ...baseCopy,
  ...componentCopy,
  ...cv.ui,
}
export const allSections = cv.sections.filter(item => item.enabled).map((item, index) => ({
  ...item,
  index: String(index).padStart(2, '0'),
}))
export const sectionLinks = allSections.filter(item => item.id !== 'top')

export function section(id: string) {
  return allSections.find(item => item.id === id)
    ?? {
      id,
      index: '00',
      label: id,
      title: id,
      kicker: '',
      tagline: '',
      enabled: false,
      nav: false,
      tone: 'paper' as const,
      ...cv.sections.find(item => item.id === id),
    }
}

export function text(key: string): string {
  return uiCopy[key] ?? key
}

export function asset(path: string): string {
  if (!path || /^(?:https?:|data:|mailto:|tel:|#)/i.test(path))
    return path
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  return `${base}${path.replace(/^\//, '')}`
}

export function absoluteUrl(path = ''): string {
  return new URL(path
    ? asset(path)
    : import.meta.env.BASE_URL, import.meta.env.SITE ?? site.url).href
}
