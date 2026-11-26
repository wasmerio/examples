import type { ContentEntry } from './content.ts'
import { renderMarkdown } from './markdown.ts'

const marker = '<!-- more -->'
const heading = /<h(\d)[^>]*>.*?<\/h\1>/giu

export async function postExcerptOf(post: ContentEntry) {
  if (post.data.excerpt === false) return ''
  if (typeof post.data.excerpt === 'string') return post.data.excerpt
  if (!(post.body ?? '').includes(marker)) return ''
  return (await renderMarkdown((post.body ?? '').split(marker, 1)[0], { sourcePath: post.filePath, plot: post.data.plot })).replace(heading, '')
}
