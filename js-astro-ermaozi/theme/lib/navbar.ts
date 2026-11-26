import type { NavigationItem } from '../config-types.ts'
import { postCollectionsFor } from './collections.ts'
import { localeOf, localePath, type Lang } from './locales.ts'

export function navbarFor(lang: Lang): NavigationItem[] {
  const locale = localeOf(lang)
  const configured = locale.navbar ?? locale.navigation
  if (configured === false) return []
  if (Array.isArray(configured)) return configured

  const posts = postCollectionsFor(lang)[0]
  return [
    { text: locale.homeText, link: localePath(lang) },
    ...(posts ? [
      { text: posts.title, link: posts.link },
      ...(posts.tags === false ? [] : [{ text: posts.tagsText ?? locale.tagText, link: posts.tagsLink }]),
      ...(posts.archives === false ? [] : [{ text: posts.archivesText ?? locale.archiveText, link: posts.archivesLink }]),
    ] : []),
  ]
}
