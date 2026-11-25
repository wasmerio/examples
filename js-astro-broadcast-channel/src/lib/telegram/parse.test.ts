import { load } from 'cheerio'
import { describe, expect, it } from 'vitest'
import { extractPost } from './parse'

const TELEGRAM_POST_HTML = `
  <div class="tgme_widget_message_wrap">
    <div class="tgme_widget_message" data-post="ExampleChannel/42">
      <div class="tgme_widget_message_text js-message_text">Release notes。Details for <a href="?q=%23release">#release</a> and <a href="?q=%23astro">#astro</a></div>
      <a class="tgme_widget_message_date"><time datetime="2026-07-14T08:30:00+00:00"></time></a>
      <div class="tgme_widget_message_reactions"><span class="tgme_reaction"><span class="emoji"><b>👍</b></span>7</span></div>
    </div>
  </div>
`

async function extractContent(html: string) {
  const $ = load(`
    <div class="tgme_widget_message_wrap">
      <div class="tgme_widget_message" data-post="ExampleChannel/42">
        <div class="tgme_widget_message_text js-message_text">${html}</div>
      </div>
    </div>
  `)

  return extractPost($, $('.tgme_widget_message_wrap').get(0) ?? null, {
    channel: 'ExampleChannel',
    telegramHost: 'telegram.me',
    staticProxy: '/static/',
    reactionsEnabled: false,
  })
}

function normalizedContent(post: Awaited<ReturnType<typeof extractContent>>) {
  return load(`<div id="content">${post.content}</div>`)('#content')
}

describe('extractPost', () => {
  it('extracts stable Telegram post fields and rewrites tag links', async () => {
    const $ = load(TELEGRAM_POST_HTML)
    const item = $('.tgme_widget_message_wrap').get(0) ?? null

    const post = await extractPost($, item, {
      channel: 'ExampleChannel',
      telegramHost: 'telegram.me',
      staticProxy: '/static/',
      reactionsEnabled: false,
    })

    expect(post.id).toBe('42')
    expect(post.title).toBe('Release notes')
    expect(post.datetime).toBe('2026-07-14T08:30:00+00:00')
    expect(post.tags).toEqual(['release', 'astro'])
    expect(post.text).toBe('Release notes。Details for #release and #astro')
    expect(post.content).toBe('<span class="post-title-source">Release notes。</span>Details for <a href="/search/result?q=%23release" title="#release">#release</a> and <a href="/search/result?q=%23astro" title="#astro">#astro</a>')
    expect(post.reactions).toEqual([])
  })

  it('uses only the first segment across consecutive breaks', async () => {
    const post = await extractContent('First title<br><br>Second paragraph<br>More text')
    const content = normalizedContent(post)

    expect(post.title).toBe('First title')
    expect(post.text).toBe('First titleSecond paragraphMore text')
    expect(content.text()).toBe(post.text)
    expect(content.find('.post-title-source').text()).toBe('First title')
    expect(content.find('br')).toHaveLength(3)
  })

  it('treats top-level blocks as separate title segments', async () => {
    const post = await extractContent('<p>Block title</p><p>Body paragraph</p>')
    const content = normalizedContent(post)

    expect(post.title).toBe('Block title')
    expect(post.text).toBe('Block titleBody paragraph')
    expect(content.text()).toBe(post.text)
    expect(content.find('p')).toHaveLength(2)
    expect(content.find('p').eq(1).text()).toBe('Body paragraph')
  })

  it('includes the full stop in the hidden source without truncating post text', async () => {
    const post = await extractContent('Sentence title。Body remains。')
    const content = normalizedContent(post)

    expect(post.title).toBe('Sentence title')
    expect(post.text).toBe('Sentence title。Body remains。')
    expect(content.text()).toBe(post.text)
    expect(content.find('.post-title-source').text()).toBe('Sentence title。')
  })

  it('stops before a URL and leaves its link visible', async () => {
    const post = await extractContent('Link title <a href="https://example.com/path">https://example.com/path</a> after')
    const content = normalizedContent(post)
    const link = content.find('a[href="https://example.com/path"]')

    expect(post.title).toBe('Link title ')
    expect(post.text).toBe('Link title https://example.com/path after')
    expect(content.text()).toBe(post.text)
    expect(content.find('.post-title-source').text()).toBe('Link title ')
    expect(link.text()).toBe('https://example.com/path')
    expect(link.closest('.post-title-source')).toHaveLength(0)
  })

  it('preserves inline formatting while marking a safely splittable title', async () => {
    const post = await extractContent('<strong>Formatted</strong> title。Body')
    const content = normalizedContent(post)

    expect(post.title).toBe('Formatted title')
    expect(post.text).toBe('Formatted title。Body')
    expect(content.text()).toBe(post.text)
    expect(content.find('strong').text()).toBe('Formatted')
    expect(content.find('.post-title-source').text()).toBe('Formatted title。')
  })

  it('keeps an interactive title unchanged instead of wrapping it', async () => {
    const post = await extractContent('<a href="https://example.com/story">Linked title</a>。Body')
    const content = normalizedContent(post)

    expect(post.title).toBe('Linked title')
    expect(post.text).toBe('Linked title。Body')
    expect(content.text()).toBe(post.text)
    expect(content.find('a[href="https://example.com/story"]').text()).toBe('Linked title')
    expect(content.find('.post-title-source')).toHaveLength(0)
  })

  it('marks a title-only post without removing its content', async () => {
    const post = await extractContent('Only title')
    const content = normalizedContent(post)

    expect(post.title).toBe('Only title')
    expect(post.text).toBe('Only title')
    expect(content.text()).toBe('Only title')
    expect(content.find('.post-title-source').text()).toBe('Only title')
  })

  it('skips empty segments and preserves media-only content', async () => {
    const post = await extractContent('<br><p>   </p><img src="https://example.com/image.jpg" alt="Example">')
    const content = normalizedContent(post)

    expect(post.title).toBe('')
    expect(post.text).toBe('   ')
    expect(content.text()).toBe(post.text)
    expect(content.find('img').attr('src')).toBe('https://example.com/image.jpg')
    expect(content.find('.post-title-source')).toHaveLength(0)
  })
})
