import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { categoryListOf, createTimeTextOf, postMetaConfigOf, postsFor, routeOf, tagClassOf, wordCountOf, type ContentEntry, type Lang, type PostMetaConfig } from '../lib/content'
import { encryptionPolicy } from '../lib/encrypt-policy'
import { postExcerptOf } from '../lib/post-excerpt'
import { siteConfig } from '../../site.config.mjs'
import { configuredLanguages, readingTimeOf } from '../lib/locales'
import { postCollectionsFor, type ResolvedPostCollection } from '../lib/collections'
import { withBaseInHtml } from '../lib/client-utils'

const records = (entries: ContentEntry[], lang: Lang, collection: ResolvedPostCollection, includeDrafts = false) => Promise.all(postsFor(entries, lang, collection, includeDrafts).map(async post => {
  const tagsTheme = (collection.tagsTheme ?? siteConfig.tagsTheme ?? 'colored') as 'colored' | 'gray' | 'brand'
  const metaConfig = postMetaConfigOf(siteConfig.meta as PostMetaConfig | false | undefined, collection.meta)
  const words = wordCountOf(post)
  const encrypted = encryptionPolicy(post).pageEncrypted
  return {
    route: routeOf(post),
    title: post.data.title,
    categories: categoryListOf(post).map(({ name, id }) => ({ name, id })),
    tags: post.data.tags.slice(0, 4).map(name => ({ name, className: tagClassOf(name, tagsTheme) })),
    date: metaConfig.createTime === false ? '' : createTimeTextOf(post, metaConfig.createTime === true ? 'short' : metaConfig.createTime ?? 'short'),
    words,
    readingTime: readingTimeOf(lang, words),
    draft: Boolean(post.data.draft),
    sticky: post.data.sticky,
    encrypt: encrypted,
    cover: post.data.cover,
    coverStyle: post.data.coverStyle,
    excerpt: encrypted ? '' : withBaseInHtml(await postExcerptOf(post), import.meta.env.BASE_URL),
  }
}))

export const GET: APIRoute = async () => {
  const entries = await getCollection('content')
  const posts = Object.fromEntries(await Promise.all(configuredLanguages().map(async lang => [lang, Object.fromEntries(await Promise.all(postCollectionsFor(lang).map(async collection => [collection.key, await records(entries, lang, collection, import.meta.env.DEV)])))])))
  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
