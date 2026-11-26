// 用于获取首页文章和说说列表

import { getCollection, type CollectionEntry } from 'astro:content'

export interface HomePostItem {
    type: 'post'
    entry: CollectionEntry<'posts'>
}

export interface HomeZoneItem {
    type: 'zone'
    entry: CollectionEntry<'zone'>
}

export type HomeFeedItem = HomePostItem | HomeZoneItem

export const getHomeFeed = async (): Promise<HomeFeedItem[]> => {
    const [posts, zones] = await Promise.all([getCollection('posts'), getCollection('zone')])

    return [
        ...posts.map((entry) => ({ type: 'post' as const, entry })),
        ...zones.map((entry) => ({ type: 'zone' as const, entry })),
    ].sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf())
}
