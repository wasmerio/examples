import type { CollectionEntry } from 'astro:content'

type PostEntry = CollectionEntry<'posts'>

export const normalizePostAlias = (rawAlias: string): string | null => {
    const normalized = rawAlias
        .trim()
        .replaceAll('\\\\', '/')
        .replace(/^\/+|\/+$/g, '')
        .replace(/^posts(?:\.html)?\//, '')
        .replace(/\/+/g, '/')

    if (!normalized || normalized === 'posts' || normalized === 'posts.html') {
        return null
    }

    return normalized
}

export const getPostAliasPaths = (post: PostEntry): string[] => {
    const aliases = Array.isArray(post.data.alias) ? post.data.alias : []
    const uniqueAliases = new Set<string>()

    for (const rawAlias of aliases) {
        const normalized = normalizePostAlias(rawAlias)
        if (!normalized || normalized === post.id) {
            continue
        }
        uniqueAliases.add(normalized)
    }

    return [...uniqueAliases]
}

export const getPostCanonicalPath = (postId: string, isWithExt: boolean | undefined): string => {
    return `/posts/${postId}${isWithExt ? '.html' : ''}`
}
