import { iconifySvg } from './iconify.ts'
import { siteConfig } from '../../site.config.mjs'
import type { SocialLink, ThemeIcon } from '../config-types.ts'
import { localeOf, type Lang } from './locales.ts'

export type SocialIcon = ThemeIcon
export type { SocialLink }

const aliases: Record<string, string> = { twitter: 'x', weibo: 'sinaweibo' }

export const socialLinks = siteConfig.social as SocialLink[]

export const socialLinksFor = (lang: Lang): SocialLink[] => {
  const configured = localeOf(lang).social as false | SocialLink[] | undefined
  return configured === false ? [] : configured ?? socialLinks
}

export const twitterHandleOf = (links: SocialLink[]) => {
  for (const { link } of links) {
    try {
      const url = new URL(link)
      if (!['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(url.hostname)) continue
      const handle = url.pathname.split('/').find(Boolean)
      if (handle) return `@${handle.replace(/^@/, '')}`
    }
    catch {}
  }
  return ''
}

export const twitterHandle = twitterHandleOf(socialLinks)

export const navbarSocialLinks = socialLinks.filter(({ icon }) => {
  const includes = siteConfig.navbarSocialInclude as string[]
  if (!includes.length) return true
  return includes.includes(typeof icon === 'string' ? icon : icon.name ?? '')
})

export const navbarSocialLinksFor = (lang: Lang) => {
  const links = socialLinksFor(lang)
  const includes = (localeOf(lang).navbarSocialInclude as string[] | undefined) ?? []
  if (!includes.length) return links
  return links.filter(({ icon }) => includes.includes(typeof icon === 'string' ? icon : icon.name ?? ''))
}

export const socialLabel = ({ icon, ariaLabel }: SocialLink) => ariaLabel
  ?? (typeof icon === 'string' ? (icon.includes(':') ? icon.split(':').at(-1) : icon) : icon.name)
  ?? 'social link'

export const socialIconName = (icon: SocialIcon) => {
  if (typeof icon !== 'string') return ''
  const name = aliases[icon] ?? icon
  return name.includes(':') ? name : `simple-icons:${name}`
}

export const socialSvg = (icon: SocialIcon) => {
  if (typeof icon !== 'string') return icon.svg
  return iconifySvg(socialIconName(icon))
}
