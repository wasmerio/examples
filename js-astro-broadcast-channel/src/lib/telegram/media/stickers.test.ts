import { load } from 'cheerio'
import { describe, expect, it } from 'vitest'
import { getImageStickers, getTgsStickers, getVideoStickers } from './stickers'

const FALLBACK = '<span class="sticker-fallback" role="img" aria-label="Sticker unavailable">Sticker unavailable</span>'

function messageWith(html: string) {
  const $ = load(`<div class="message">${html}</div>`)
  return { $, message: $('.message') }
}

describe('sticker renderers', () => {
  it('keeps valid image sticker output unchanged', () => {
    const { $, message } = messageWith('<i class="tgme_widget_message_sticker" data-webp="https://cdn-telegram.org/sticker.webp"></i>')

    expect(getImageStickers($, message, { staticProxy: '/static/' }))
      .toBe('<img class="sticker w-64" src="/static/https://cdn-telegram.org/sticker.webp" alt="Sticker" width="256" height="256" loading="eager" />')
  })

  it('falls back when an image sticker has no URL', () => {
    const { $, message } = messageWith('<i class="tgme_widget_message_sticker"></i>')

    expect(getImageStickers($, message, {})).toBe(FALLBACK)
  })

  it.each([
    ['/stickers/relative.webp', '/stickers/relative.webp'],
    ['//cdn-telegram.org/sticker.webp', '/static///cdn-telegram.org/sticker.webp'],
    ['https://cdn-telegram.org/sticker.webp', '/static/https://cdn-telegram.org/sticker.webp'],
  ])('handles image sticker URL %s', (source, expected) => {
    const { $, message } = messageWith(`<i class="tgme_widget_message_sticker" data-webp="${source}"></i>`)
    const rendered = load(getImageStickers($, message, { staticProxy: '/static/' }))

    expect(rendered('img').attr('src')).toBe(expected)
  })

  it('keeps video and image fallback sources when both exist', () => {
    const { $, message } = messageWith(`
      <video class="js-videosticker_video" src="https://cdn-telegram.org/sticker.webm">
        <img src="https://cdn-telegram.org/sticker.webp">
      </video>
    `)
    const rendered = load(getVideoStickers($, message, { staticProxy: '/static/' }))

    expect(rendered('video').hasClass('sticker')).toBe(true)
    expect(rendered('video').attr('src')).toBe('/static/https://cdn-telegram.org/sticker.webm')
    expect(rendered('video img').hasClass('sticker')).toBe(true)
    expect(rendered('video img').attr('src')).toBe('/static/https://cdn-telegram.org/sticker.webp')
  })

  it('renders a video sticker without an absent fallback image', () => {
    const { $, message } = messageWith('<video class="js-videosticker_video" src="/stickers/sticker.webm"></video>')
    const rendered = load(getVideoStickers($, message, { staticProxy: '/static/' }))

    expect(rendered('video').attr('src')).toBe('/stickers/sticker.webm')
    expect(rendered('img')).toHaveLength(0)
    expect(rendered('.sticker-fallback')).toHaveLength(0)
  })

  it('renders only the fallback image when a video URL is absent', () => {
    const { $, message } = messageWith('<video class="js-videosticker_video"><img src="//cdn-telegram.org/sticker.webp"></video>')
    const rendered = load(getVideoStickers($, message, { staticProxy: '/static/' }))

    expect(rendered('video')).toHaveLength(0)
    expect(rendered('img').attr('src')).toBe('/static///cdn-telegram.org/sticker.webp')
  })

  it('falls back when both video sticker sources are absent', () => {
    const { $, message } = messageWith('<video class="js-videosticker_video"><img src=""></video>')

    expect(load(getVideoStickers($, message, {}))('.sticker-fallback').text()).toBe('Sticker unavailable')
  })

  it('marks all TGS fallback media as stickers while preserving image classes', () => {
    const $ = load(`
      <div class="message">
        <div class="tgme_widget_message_sticker_wrap">
          <div class="tgme_widget_message_tgsticker_wrap">
            <picture>
              <img class="fallback" src="https://cdn-telegram.org/sticker.webp">
              <img src="/sticker-fallback.webp">
            </picture>
            <video src="https://cdn-telegram.org/sticker.webm"></video>
          </div>
        </div>
      </div>
    `)
    const rendered = load(getTgsStickers($, $('.message'), {}))
    const images = rendered('img')

    expect(images).toHaveLength(2)
    expect(images.filter('.sticker')).toHaveLength(2)
    expect(images.first().hasClass('fallback')).toBe(true)
    expect(images.first().attr('alt')).toBe('Sticker')
    expect(images.first().attr('loading')).toBe('eager')
    expect(rendered('video').hasClass('sticker')).toBe(true)
  })

  it('keeps a non-empty TGS srcset', () => {
    const { $, message } = messageWith(`
      <div class="tgme_widget_message_sticker_wrap">
        <div class="tgme_widget_message_tgsticker_wrap">
          <picture><source srcset="/stickers/a.webp 1x, https://cdn-telegram.org/b.webp 2x"></picture>
        </div>
      </div>
    `)
    const rendered = load(getTgsStickers($, message, { staticProxy: '/static/' }))

    expect(rendered('source').attr('srcset')).toBe('/stickers/a.webp 1x, /static/https://cdn-telegram.org/b.webp 2x')
    expect(rendered('.sticker-fallback')).toHaveLength(0)
  })

  it('falls back when a TGS sticker has no non-empty source', () => {
    const { $, message } = messageWith(`
      <div class="tgme_widget_message_sticker_wrap">
        <div class="tgme_widget_message_tgsticker_wrap"><img src="" srcset="  "></div>
      </div>
    `)

    expect(getTgsStickers($, message, {})).toBe(FALLBACK)
  })

  it('never emits an empty src attribute', () => {
    const { $, message } = messageWith(`
      <i class="tgme_widget_message_sticker"></i>
      <video class="js-videosticker_video"><img src=""></video>
      <div class="tgme_widget_message_sticker_wrap">
        <div class="tgme_widget_message_tgsticker_wrap"><img src=""></div>
      </div>
    `)
    const rendered = [
      getImageStickers($, message, {}),
      getVideoStickers($, message, {}),
      getTgsStickers($, message, {}),
    ].join('')

    expect(rendered).not.toContain('src=""')
  })
})
