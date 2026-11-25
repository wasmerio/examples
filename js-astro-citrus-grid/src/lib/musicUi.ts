import {
  clampRatio,
  formatTime,
  type MediaPort,
  type PlayerState,
  type PlayMode,
} from '@/lib/player'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export interface PlayerElements {
  root: HTMLElement
  audio: HTMLAudioElement
  fab: HTMLButtonElement
  panel: HTMLElement
  panelList: HTMLElement
  disc: HTMLImageElement
  cover: HTMLImageElement
  title: HTMLElement
  index: HTMLElement
  progress: HTMLElement
  fill: HTMLElement
  thumb: HTMLElement
  time: HTMLElement
  duration: HTMLElement
  showList: HTMLButtonElement
  closeList: HTMLButtonElement
  mode: HTMLButtonElement
  mute: HTMLButtonElement
  volBar: HTMLElement
  volFill: HTMLElement
  volThumb: HTMLElement
  listCount: HTMLElement
  list: HTMLElement | null
  items: HTMLElement[]
  scrollbar: HTMLElement
  scrollThumb: HTMLElement
  prev: HTMLButtonElement
  play: HTMLButtonElement
  stop: HTMLButtonElement
  next: HTMLButtonElement
}

export function queryPlayerElements(): PlayerElements | null {
  const root = document.querySelector<HTMLElement>('[data-music-player]')
  if (!root) return null
  // 任一必需子元素缺失即整体返回 null（fail fast），由调用方的空值守卫停用播放器；
  // 不做非空断言，否则模板改动后要到 audio.src 等调用处才抛 TypeError
  const q = <T extends Element>(sel: string): T | null => root.querySelector<T>(sel)
  const audio = q<HTMLAudioElement>('[data-music-audio]')
  const fab = q<HTMLButtonElement>('[data-music-open]')
  const panel = q<HTMLElement>('[data-music-panel]')
  const panelList = q<HTMLElement>('[data-music-panel-list]')
  const disc = q<HTMLImageElement>('[data-music-disc]')
  const cover = q<HTMLImageElement>('[data-music-cover]')
  const title = q<HTMLElement>('[data-music-title]')
  const index = q<HTMLElement>('[data-music-index]')
  const progress = q<HTMLElement>('[data-music-progress]')
  const fill = q<HTMLElement>('[data-music-fill]')
  const thumb = q<HTMLElement>('[data-music-thumb]')
  const time = q<HTMLElement>('[data-music-current]')
  const duration = q<HTMLElement>('[data-music-duration]')
  const showList = q<HTMLButtonElement>('[data-music-showlist]')
  const closeList = q<HTMLButtonElement>('[data-music-closelist]')
  const mode = q<HTMLButtonElement>('[data-music-mode]')
  const mute = q<HTMLButtonElement>('[data-music-mute]')
  const volBar = q<HTMLElement>('[data-music-volbar]')
  const volFill = q<HTMLElement>('[data-music-volfill]')
  const volThumb = q<HTMLElement>('[data-music-volthumb]')
  const listCount = q<HTMLElement>('[data-music-listcount]')
  const scrollbar = q<HTMLElement>('[data-music-scrollbar]')
  const scrollThumb = q<HTMLElement>('[data-music-scrollthumb]')
  const prev = q<HTMLButtonElement>('[data-music-prev]')
  const play = q<HTMLButtonElement>('[data-music-play]')
  const stop = q<HTMLButtonElement>('[data-music-stop]')
  const next = q<HTMLButtonElement>('[data-music-next]')
  if (
    !audio ||
    !fab ||
    !panel ||
    !panelList ||
    !disc ||
    !cover ||
    !title ||
    !index ||
    !progress ||
    !fill ||
    !thumb ||
    !time ||
    !duration ||
    !showList ||
    !closeList ||
    !mode ||
    !mute ||
    !volBar ||
    !volFill ||
    !volThumb ||
    !listCount ||
    !scrollbar ||
    !scrollThumb ||
    !prev ||
    !play ||
    !stop ||
    !next
  ) {
    return null
  }
  const list = root.querySelector<HTMLElement>('[data-music-list]')
  return {
    root,
    audio,
    fab,
    panel,
    panelList,
    disc,
    cover,
    title,
    index,
    progress,
    fill,
    thumb,
    time,
    duration,
    showList,
    closeList,
    mode,
    mute,
    volBar,
    volFill,
    volThumb,
    listCount,
    list,
    items: list ? [...list.querySelectorAll<HTMLElement>('[data-music-item]')] : [],
    scrollbar,
    scrollThumb,
    prev,
    play,
    stop,
    next,
  }
}

export function createMediaPort(audio: HTMLAudioElement): MediaPort {
  return {
    setSource(src) {
      audio.src = src
      audio.load()
    },
    reset() {
      audio.removeAttribute('src')
      audio.load()
    },
    play() {
      const p = audio.play()
      if (p) p.catch(() => {})
    },
    pause: () => audio.pause(),
    isPaused: () => audio.paused,
    getCurrentTime: () => audio.currentTime,
    getDuration: () => (Number.isFinite(audio.duration) ? audio.duration : 0),
    setCurrentTime(t) {
      audio.currentTime = t
    },
    setVolume(v) {
      audio.volume = v
    },
  }
}

export interface PanelControllerOptions {
  root: HTMLElement
  fab: HTMLButtonElement
  panel: HTMLElement
  panelList: HTMLElement
  list: HTMLElement | null
  scrollbar: ScrollbarController
}

export interface ScrollbarController {
  sync: () => void
  position: () => void
  scrollActiveIntoView: () => void
  bindThumbDrag: () => void
}

export function createScrollbarController(
  listEl: HTMLElement | null,
  scrollbar: HTMLElement,
  scrollThumb: HTMLElement,
): ScrollbarController {
  function syncScrollbar() {
    if (!listEl) return
    const overflow = listEl.scrollHeight - listEl.clientHeight >= 4
    if (!overflow) {
      scrollbar.style.display = 'none'
      scrollThumb.style.top = '0px'
      return
    }
    scrollbar.style.display = 'block'
    requestAnimationFrame(() => {
      const trackH = scrollbar.clientHeight || 1
      const scrollH = listEl.scrollHeight - listEl.clientHeight
      const thumbH = Math.max(Math.round((listEl.clientHeight / listEl.scrollHeight) * trackH), 24)
      scrollThumb.style.height = `${thumbH}px`
      const maxTop = trackH - thumbH
      scrollThumb.style.top = `${maxTop * (listEl.scrollTop / scrollH)}px`
    })
  }

  function positionListScrollbar() {
    requestAnimationFrame(syncScrollbar)
  }

  function scrollActiveIntoView() {
    if (!listEl) return
    const active = listEl.querySelector<HTMLElement>('li.is-active')
    if (active) listEl.scrollTop = Math.max(0, active.offsetTop - listEl.clientHeight / 2)
  }

  const thumbDrag = { active: false, startY: 0, startScrollTop: 0 }

  function bindThumbDrag() {
    scrollThumb.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      thumbDrag.active = true
      thumbDrag.startY = e.clientY
      thumbDrag.startScrollTop = listEl?.scrollTop ?? 0
      scrollThumb.setPointerCapture(e.pointerId)
    })
    scrollThumb.addEventListener('pointermove', (e) => {
      if (!thumbDrag.active || !listEl) return
      const trackH = scrollbar.clientHeight || 1
      const thumbH = scrollThumb.offsetHeight
      const maxTop = trackH - thumbH
      const scrollH = listEl.scrollHeight - listEl.clientHeight
      if (maxTop <= 0 || scrollH <= 0) return
      const delta = e.clientY - thumbDrag.startY
      listEl.scrollTop = thumbDrag.startScrollTop + (delta / maxTop) * scrollH
    })
    const endThumbDrag = () => {
      thumbDrag.active = false
    }
    scrollThumb.addEventListener('pointerup', endThumbDrag)
    scrollThumb.addEventListener('pointercancel', endThumbDrag)
    listEl?.addEventListener('scroll', syncScrollbar)
    window.addEventListener('resize', syncScrollbar)
  }

  return {
    sync: syncScrollbar,
    position: positionListScrollbar,
    scrollActiveIntoView,
    bindThumbDrag,
  }
}

export function createPanelController({
  root,
  fab,
  panel,
  panelList,
  list,
  scrollbar,
}: PanelControllerOptions) {
  let expanded = false
  let listOpen = false
  let panelClosingTimer = 0

  function applyPanelClosed() {
    panel.hidden = true
    panel.classList.remove('music-panel-in', 'music-panel-out')
  }

  function setListOpen(open: boolean) {
    listOpen = open
    panelList.hidden = !open
    if (open) {
      scrollbar.position()
      scrollbar.scrollActiveIntoView()
    }
  }

  function setExpanded(open: boolean) {
    expanded = open
    fab.setAttribute('aria-expanded', open ? 'true' : 'false')
    root.classList.toggle('is-open', open)
    if (open) {
      window.clearTimeout(panelClosingTimer)
      panel.classList.remove('music-panel-out')
      panel.hidden = false
      if (reduceMotion()) {
        panel.classList.add('music-panel-in')
      } else {
        void panel.offsetWidth
        panel.classList.add('music-panel-in')
      }
      return
    }
    setListOpen(false)
    if (reduceMotion() || !panel.classList.contains('music-panel-in')) {
      applyPanelClosed()
      return
    }
    panel.classList.remove('music-panel-in')
    panel.classList.add('music-panel-out')
    const finalize = () => {
      if (!panel.classList.contains('music-panel-out')) return
      window.clearTimeout(panelClosingTimer)
      applyPanelClosed()
    }
    panel.addEventListener(
      'transitionend',
      (e) => {
        if (e.target === panel && e.propertyName === 'transform') finalize()
      },
      { once: true },
    )
    panelClosingTimer = window.setTimeout(finalize, 400)
  }

  function closeTopmost(): boolean {
    if (listOpen) {
      setListOpen(false)
      return true
    }
    if (expanded) {
      setExpanded(false)
      return true
    }
    return false
  }

  return {
    setExpanded,
    setListOpen,
    closeTopmost,
    isExpanded: () => expanded,
    isListOpen: () => listOpen,
    hasList: () => Boolean(list),
  }
}

export function createLayoutController(
  fab: HTMLElement,
  panel: HTMLElement,
  panelList: HTMLElement,
) {
  return {
    reposition() {
      const nav = document.querySelector<HTMLElement>('.scroll-control-nav')
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const rightGap = isMobile ? 12 : 20
      const bottomSlot = isMobile ? 64 : 32

      fab.style.right = `${rightGap}px`
      fab.style.bottom = `${bottomSlot}px`

      const fabSize = fab.getBoundingClientRect().height || 40
      if (nav) {
        nav.style.right = `${rightGap}px`
        nav.style.bottom = `${bottomSlot + fabSize + 8}px`
      }

      const fabWidth = fab.getBoundingClientRect().width || 40
      const panelRight = rightGap + fabWidth + 10
      const limit = `calc(100vw - ${panelRight + 8}px)`
      for (const el of [panel, panelList]) {
        el.style.right = `${panelRight}px`
        el.style.bottom = `${bottomSlot}px`
        el.style.maxWidth = limit
      }
    },
  }
}

export function applyPlayMode(
  root: HTMLElement,
  button: HTMLButtonElement,
  mode: PlayMode,
  labels: Record<PlayMode, string>,
) {
  root.classList.remove('mode-order', 'mode-loop', 'mode-shuffle')
  root.classList.add(`mode-${mode}`)
  const label = labels[mode]
  button.title = label
  button.setAttribute('aria-label', label)
}

export interface PlayerViewOptions {
  root: HTMLElement
  panel: HTMLElement
  cover: HTMLImageElement
  disc: HTMLImageElement
  fill: HTMLElement
  thumb: HTMLElement
  playBtn: HTMLButtonElement
  modeBtn: HTMLButtonElement
  volFill: HTMLElement
  volThumb: HTMLElement
  items: HTMLElement[]
  modeLabels: Record<PlayMode, string>
  ui: Record<string, string>
}

export interface PlayerView {
  setFill: (ratio: number) => void
  applyCover: (src: string | undefined) => void
  onState: (state: PlayerState) => void
}

export function createPlayerView(opts: PlayerViewOptions): PlayerView {
  function setFill(ratio: number) {
    const pct = `${clampRatio(ratio) * 100}%`
    opts.fill.style.width = pct
    opts.thumb.style.left = pct
  }

  function applyCover(src: string | undefined) {
    if (src) {
      opts.cover.src = src
      opts.cover.hidden = false
      opts.disc.src = src
    } else {
      opts.cover.removeAttribute('src')
      opts.cover.hidden = true
      opts.disc.removeAttribute('src')
    }
  }

  function onState(state: PlayerState) {
    const { ui } = opts
    opts.root.classList.toggle('is-playing', state.playing)
    opts.root.classList.toggle('has-track', state.index >= 0 && state.hasCover)
    opts.panel.classList.toggle('has-head', state.index >= 0)
    opts.playBtn.setAttribute('aria-label', state.playing ? ui.pause : ui.play)
    opts.playBtn.title = state.playing ? ui.pause : ui.play
    opts.items.forEach((li, i) => {
      li.classList.toggle('is-active', i === state.index)
    })
    const pct = `${state.volume * 100}%`
    opts.volFill.style.width = pct
    opts.volThumb.style.left = pct
    opts.root.classList.toggle('is-muted', state.volume === 0)
    applyPlayMode(opts.root, opts.modeBtn, state.playMode, opts.modeLabels)
  }

  return { setFill, applyCover, onState }
}

export function createPlayerViewFrom(els: PlayerElements, ui: Record<string, string>): PlayerView {
  return createPlayerView({
    root: els.root,
    panel: els.panel,
    cover: els.cover,
    disc: els.disc,
    fill: els.fill,
    thumb: els.thumb,
    playBtn: els.play,
    modeBtn: els.mode,
    volFill: els.volFill,
    volThumb: els.volThumb,
    items: els.items,
    modeLabels: { order: ui.order, loop: ui.loop, shuffle: ui.shuffle },
    ui,
  })
}

export function bindAudioEvents(
  audio: HTMLAudioElement,
  player: {
    state: PlayerState
    setPlaying: (playing: boolean) => void
    load: (i: number, shouldPlay: boolean) => void
    next: () => void
  },
  view: {
    setFill: (ratio: number) => void
    setTimeText: (text: string) => void
    setDurationText: (text: string) => void
  },
  isDragging: () => boolean,
) {
  audio.addEventListener('play', () => player.setPlaying(true))
  audio.addEventListener('pause', () => player.setPlaying(false))
  audio.addEventListener('loadedmetadata', () => {
    view.setDurationText(formatTime(audio.duration))
  })
  audio.addEventListener('timeupdate', () => {
    if (isDragging()) return
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      view.setFill(audio.currentTime / audio.duration)
    }
    view.setTimeText(formatTime(audio.currentTime))
  })
  audio.addEventListener('ended', () => {
    if (player.state.playMode === 'loop') player.load(player.state.index, true)
    else player.next()
  })
  audio.addEventListener('error', () => player.setPlaying(false))
}

export function bindProgressDrag(el: HTMLElement, onSeek: (ratio: number) => void): () => boolean {
  const drag = { active: false }
  const ratioFrom = (clientX: number): number | null => {
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return null
    return clampRatio((clientX - rect.left) / rect.width)
  }
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    drag.active = true
    el.setPointerCapture(e.pointerId)
    const r = ratioFrom(e.clientX)
    if (r !== null) onSeek(r)
  })
  el.addEventListener('pointermove', (e) => {
    if (!drag.active) return
    const r = ratioFrom(e.clientX)
    if (r !== null) onSeek(r)
  })
  const end = () => {
    drag.active = false
  }
  el.addEventListener('pointerup', end)
  el.addEventListener('pointercancel', end)
  return () => drag.active
}

export function bindVolumeDrag(el: HTMLElement, onVolume: (ratio: number) => void) {
  const drag = { active: false }
  const ratioFrom = (clientX: number) => {
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return null
    return (clientX - rect.left) / rect.width
  }
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    drag.active = true
    el.setPointerCapture(e.pointerId)
    const r = ratioFrom(e.clientX)
    if (r !== null) onVolume(r)
  })
  el.addEventListener('pointermove', (e) => {
    if (!drag.active) return
    const r = ratioFrom(e.clientX)
    if (r !== null) onVolume(r)
  })
  const end = () => {
    drag.active = false
  }
  el.addEventListener('pointerup', end)
  el.addEventListener('pointercancel', end)
}
