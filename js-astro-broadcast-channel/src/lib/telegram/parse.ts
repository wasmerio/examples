import type { AnyNode, CheerioAPI } from 'cheerio'
import type { Post, Reaction } from '../../types'
import type { ExtractPostOptions, MessageSelection } from './types'
import { modifyHTMLContent } from './content'
import { getCustomEmojiImage, normalizeEmoji } from './emoji'
import { getAudio, getForwardedFrom, getImages, getImageStickers, getLinkPreview, getReply, getTgsStickers, getVideo, getVideoStickers } from './media'
import { renderRawContent } from './renderers/raw'
import { normalizeUrlAttributes } from './url'

const TITLE_PREVIEW_REGEX = /^.*?(?=[。\n]|http\S)/
const BLOCK_TAGS = new Set('address article aside blockquote div dl fieldset figure footer form h1 h2 h3 h4 h5 h6 header hr main nav ol p pre section table ul'.split(' '))
const INTERACTIVE_TAGS = new Set(['a', 'button', 'input', 'label', 'select', 'textarea', 'tg-spoiler'])

type TextNode = AnyNode

function getTextData(node: TextNode): string {
  return (node as unknown as { data: string }).data
}

function setTextData(node: TextNode, data: string): void {
  (node as unknown as { data: string }).data = data
}

function getFirstVisibleSegment(content: MessageSelection): TextNode[] {
  const segments: TextNode[][] = [[]]

  const breakSegment = () => {
    if (segments.at(-1)?.length) {
      segments.push([])
    }
  }
  const visit = (node: AnyNode) => {
    if (node.type === 'text') {
      segments.at(-1)?.push(node as TextNode)
      return
    }
    if (node.type !== 'tag' || node.name === 'script' || node.name === 'style') {
      return
    }
    if (node.name === 'br') {
      breakSegment()
      return
    }
    for (const child of node.childNodes) {
      visit(child)
    }
  }

  for (const node of content.contents().toArray()) {
    const isBlock = node.type === 'tag' && BLOCK_TAGS.has(node.name)
    if (isBlock) {
      breakSegment()
    }
    visit(node)
    if (isBlock) {
      breakSegment()
    }
  }

  return segments.find(segment => segment.some(node => getTextData(node).trim())) ?? []
}

function hasInteractiveAncestor(node: TextNode, contentNode: AnyNode): boolean {
  let parent = node.parent
  while (parent && parent !== contentNode) {
    if (parent.type === 'tag' && INTERACTIVE_TAGS.has(parent.name)) {
      return true
    }
    parent = parent.parent
  }
  return false
}

function markTitleSource($: CheerioAPI, content: MessageSelection, nodes: TextNode[], length: number): void {
  const contentNode = content.get(0)
  let coveredLength = 0
  const coveredNodes = nodes.filter((node) => {
    const nodeLength = getTextData(node).length
    const covered = coveredLength < length && nodeLength > 0
    coveredLength += nodeLength
    return covered
  })
  if (!contentNode || coveredNodes.some(node => hasInteractiveAncestor(node, contentNode))) {
    return
  }

  let remaining = length
  for (const node of nodes) {
    if (remaining <= 0) {
      break
    }
    const nodeText = getTextData(node)
    const markedText = nodeText.slice(0, remaining)
    if (!markedText) {
      continue
    }

    const parent = node.parent
    const nodeIndex = parent?.childNodes.indexOf(node) ?? -1
    const marker = $('<span class="post-title-source"></span>').text(markedText).get(0)
    if (!parent || nodeIndex < 0 || !marker) {
      return
    }

    marker.parent = parent
    if (markedText.length < nodeText.length) {
      setTextData(node, nodeText.slice(markedText.length))
      parent.childNodes.splice(nodeIndex, 1, marker, node)
    }
    else {
      parent.childNodes.splice(nodeIndex, 1, marker)
    }
    remaining -= markedText.length
  }
}

function extractTitleAndMarkSource($: CheerioAPI, content: MessageSelection): string {
  const segment = getFirstVisibleSegment(content)
  const segmentText = segment.map(getTextData).join('')
  if (!segmentText.trim()) {
    return ''
  }

  const title = segmentText.match(TITLE_PREVIEW_REGEX)?.[0] ?? segmentText
  if (!title) {
    return ''
  }

  const markerLength = segmentText[title.length] === '。' ? title.length + 1 : title.length
  markTitleSource($, content, segment, markerLength)
  return title
}

function isNonEmptyString(value: string | null | undefined): value is string {
  return Boolean(value)
}

function rewriteTagLinksAndCollectTags($: CheerioAPI, content: MessageSelection): string[] {
  const tags: string[] = []

  for (const tagNode of content.find('a[href^="?q="]').toArray()) {
    const tagLink = $(tagNode)
    const tagText = tagLink.text()

    tagLink.attr('href', `/search/result?q=${encodeURIComponent(tagText)}`)

    const normalizedTag = tagText.replace('#', '')
    if (normalizedTag) {
      tags.push(normalizedTag)
    }
  }

  return tags
}

function renderPostContent(
  $: CheerioAPI,
  message: MessageSelection,
  content: MessageSelection,
  options: {
    channel: string
    staticProxy: string
    index: number
    id: string
    title: string
  },
): string {
  const { channel, staticProxy, index, id, title } = options

  return [
    getForwardedFrom($, message),
    getReply($, message, { channel }),
    getImages($, message, { staticProxy, id, index, title }),
    getVideo($, message, { staticProxy, index }),
    getAudio($, message, { staticProxy }),
    content.html(),
    getImageStickers($, message, { staticProxy, index }),
    getTgsStickers($, message, { staticProxy, index }),
    getVideoStickers($, message, { staticProxy, index }),
    ...renderRawContent($, message, { staticProxy }),
    getLinkPreview($, message, { staticProxy, index }),
  ]
    .filter(isNonEmptyString)
    .join('')
}

function getReactions($: CheerioAPI, message: MessageSelection, telegramHost: string, staticProxy: string): Reaction[] {
  const reactions: Reaction[] = []

  for (const reactionNode of message.find('.tgme_widget_message_reactions .tgme_reaction').toArray()) {
    const reaction = $(reactionNode)
    const isPaid = reaction.hasClass('tgme_reaction_paid')
    let emoji = ''
    let emojiId: string | undefined
    let emojiImage: string | undefined

    const standardEmoji = reaction.find('.emoji b')
    if (standardEmoji.length) {
      emoji = normalizeEmoji(standardEmoji.text().trim())
    }

    const tgEmoji = reaction.find('tg-emoji')
    if (tgEmoji.length && !emoji) {
      emojiId = tgEmoji.attr('emoji-id')
      const customEmojiImage = getCustomEmojiImage(emojiId, { telegramHost, staticProxy })
      if (customEmojiImage) {
        emojiImage = customEmojiImage
      }
    }

    if (isPaid && !emoji && !emojiImage) {
      emoji = '\u2B50'
    }

    const clone = reaction.clone()
    clone.find('.emoji, tg-emoji, i').remove()
    const count = clone.text().trim()

    if (count) {
      reactions.push({
        emoji,
        emojiId,
        emojiImage,
        count,
        isPaid,
      })
    }
  }

  return reactions
}

export async function extractPost($: CheerioAPI, item: AnyNode | null, options: ExtractPostOptions): Promise<Post> {
  const { channel, telegramHost, staticProxy, index = 0, reactionsEnabled } = options
  const message = item ? $(item).find('.tgme_widget_message') : $('.tgme_widget_message')
  normalizeUrlAttributes($, message)
  const hasReplyText = message.find('.js-message_reply_text').length > 0
  const content = await modifyHTMLContent(
    $,
    message.find(hasReplyText ? '.tgme_widget_message_text.js-message_text' : '.tgme_widget_message_text'),
    { index, telegramHost, staticProxy, normalizeUrls: false },
  )
  const contentText = content.text()
  const title = extractTitleAndMarkSource($, content)
  const id = message.attr('data-post')?.replace(new RegExp(`${channel}/`, 'i'), '') ?? ''
  const tags = rewriteTagLinksAndCollectTags($, content)
  const contentHtml = renderPostContent($, message, content, { channel, staticProxy, index, id, title })

  return {
    id,
    title,
    type: message.attr('class')?.includes('service_message') ? 'service' : 'text',
    datetime: message.find('.tgme_widget_message_date time').attr('datetime') ?? '',
    tags,
    text: contentText,
    content: contentHtml,
    reactions: reactionsEnabled ? getReactions($, message, telegramHost, staticProxy) : [],
  }
}
