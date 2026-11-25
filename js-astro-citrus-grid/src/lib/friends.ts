import { siteConfig } from '@/lib/mergedSiteConfig'

export interface FriendLink {
  url: string
  name: string
  desc: string
  icon: string
}

export function getFriendLinks(): FriendLink[] {
  const list = siteConfig.friends
  return list.map((f) => {
    const rawUrl = (f.url || '').trim()
    const name = (f.name || '').trim()
    const desc = (f.desc || '').trim()
    // 空 url：new URL('https://') 会抛异常，host 兜底串会污染 name/desc，置空并告警
    if (!rawUrl) {
      console.warn(`[friends] 友链 ${name || '(未命名)'} 缺少 url，已按空链接渲染`)
      return { url: '', name, desc, icon: (f.icon || '').trim() }
    }
    const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
    let host = url
    try {
      host = new URL(url).hostname.replace(/^www\./, '')
    } catch {}
    return {
      url,
      name: name || host,
      desc: desc || host,
      icon: (f.icon || '').trim(),
    }
  })
}
