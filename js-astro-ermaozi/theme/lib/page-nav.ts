import { resolveNavLink } from './client-utils.ts'

export type PageNavLink = { href: string, title: string, icon?: string | { svg: string } }
export type PageNavSetting = false | string | { link: string, text?: string, icon?: string | { svg: string } } | undefined

export function resolvePageNav(setting: PageNavSetting, fallback: PageNavLink | undefined, pages: PageNavLink[]) {
  if (setting === false) return undefined
  if (typeof setting === 'string') {
    const resolved = resolveNavLink(setting)
    const matched = pages.find(page => page.href.replace(/\/$/u, '') === resolved.link.replace(/\/$/u, ''))
    return { href: matched?.href ?? resolved.link, title: matched?.title ?? resolved.text, icon: matched?.icon }
  }
  if (setting) {
    const matched = pages.find(page => page.href === setting.link)
    return { href: setting.link, title: setting.text ?? matched?.title ?? resolveNavLink(setting.link).text, icon: setting.icon ?? matched?.icon }
  }
  return fallback
}
