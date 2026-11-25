import type { CheerioAPI } from 'cheerio'
import type { IndexedStaticProxyOptions, MessageSelection } from '../types'
import { getImageLoading, getMaybeProxiedSrcset, getMaybeProxiedUrl } from './utils'

const STICKER_FALLBACK = '<span class="sticker-fallback" role="img" aria-label="Sticker unavailable">Sticker unavailable</span>'

function getNonEmptyAttribute(value: string | undefined): string | null {
  return value?.trim() || null
}

export function getVideoStickers($: CheerioAPI, message: MessageSelection, options: IndexedStaticProxyOptions): string {
  const { staticProxy = '', index = 0 } = options
  const fragments: string[] = []
  const loading = getImageLoading(index)

  for (const videoNode of message.find('.js-videosticker_video').toArray()) {
    const videoSrc = getNonEmptyAttribute($(videoNode).attr('src'))
    const imageSrc = getNonEmptyAttribute($(videoNode).find('img').attr('src'))

    const image = imageSrc
      ? `<img class="sticker" src="${getMaybeProxiedUrl(staticProxy, imageSrc)}" alt="Video sticker" width="256" height="256" loading="${loading}" />`
      : ''
    let media = image || STICKER_FALLBACK
    if (videoSrc) {
      media = image
        ? `<video class="sticker" src="${getMaybeProxiedUrl(staticProxy, videoSrc)}" width="256" height="256" aria-label="Video sticker" preload muted autoplay loop playsinline disablepictureinpicture>
        ${image}
      </video>`
        : `<video class="sticker" src="${getMaybeProxiedUrl(staticProxy, videoSrc)}" width="256" height="256" aria-label="Video sticker" preload muted autoplay loop playsinline disablepictureinpicture></video>`
    }

    fragments.push(`
    <div class="w-64 bg-none">
      ${media}
    </div>
    `)
  }

  return fragments.join('')
}

export function getImageStickers($: CheerioAPI, message: MessageSelection, options: IndexedStaticProxyOptions): string {
  const { staticProxy = '', index = 0 } = options
  const fragments: string[] = []
  const loading = getImageLoading(index)

  for (const imageNode of message.find('.tgme_widget_message_sticker').toArray()) {
    const imageSrc = getNonEmptyAttribute($(imageNode).attr('data-webp'))

    fragments.push(
      imageSrc
        ? `<img class="sticker w-64" src="${getMaybeProxiedUrl(staticProxy, imageSrc)}" alt="Sticker" width="256" height="256" loading="${loading}" />`
        : STICKER_FALLBACK,
    )
  }

  return fragments.join('')
}

export function getTgsStickers($: CheerioAPI, message: MessageSelection, options: IndexedStaticProxyOptions): string {
  const { staticProxy = '', index = 0 } = options
  const fragments: string[] = []
  const loading = getImageLoading(index)

  for (const stickerNode of message.find('.tgme_widget_message_tgsticker_wrap').toArray()) {
    const sticker = $(stickerNode)
    const wrapper = sticker.parent('.tgme_widget_message_sticker_wrap')
    const root = wrapper.length ? wrapper : sticker
    let hasSource = false

    for (const sourceNode of root.find('[src], [srcset]').toArray()) {
      const source = $(sourceNode)
      const src = getNonEmptyAttribute(source.attr('src'))
      const srcset = getNonEmptyAttribute(source.attr('srcset'))

      if (src) {
        hasSource = true
        source.attr('src', getMaybeProxiedUrl(staticProxy, src))
      }
      else {
        source.removeAttr('src')
      }

      if (srcset) {
        hasSource = true
        source.attr('srcset', getMaybeProxiedSrcset(staticProxy, srcset))
      }
      else {
        source.removeAttr('srcset')
      }
    }

    if (!hasSource) {
      fragments.push(STICKER_FALLBACK)
      continue
    }

    root.find('img').addClass('sticker').attr('alt', 'Sticker').attr('loading', loading)
    root.find('video').addClass('sticker')
    fragments.push($.html(root))
  }

  return fragments.join('')
}
