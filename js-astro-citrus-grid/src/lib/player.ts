export type PlayMode = 'order' | 'loop' | 'shuffle'

export interface PlayerTrack {
  title: string
  src: string
  cover?: string
}

export interface MediaPort {
  setSource(src: string): void
  reset(): void
  play(): void
  pause(): void
  isPaused(): boolean
  getCurrentTime(): number
  getDuration(): number
  setCurrentTime(seconds: number): void
  setVolume(volume: number): void
}

export interface PlayerState {
  index: number
  playing: boolean
  playMode: PlayMode
  volume: number
  hasCover: boolean
}

export interface PlayerEvents {
  onState?: (state: PlayerState) => void
  onTrack?: (track: PlayerTrack, index: number) => void
}

export function formatTime(s: number): string {
  let sec0 = s
  if (!Number.isFinite(sec0) || sec0 < 0) sec0 = 0
  const m = Math.floor(sec0 / 60)
  const sec = Math.floor(sec0 % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function clampRatio(v: number): number {
  if (!Number.isFinite(v)) return 0
  return Math.min(1, Math.max(0, v))
}

export function nextMode(mode: PlayMode): PlayMode {
  return mode === 'order' ? 'loop' : mode === 'loop' ? 'shuffle' : 'order'
}

export function nextIndex(
  index: number,
  length: number,
  mode: PlayMode,
  random: () => number = Math.random,
): number {
  if (mode === 'shuffle' && length > 1) {
    let i = index < 0 ? Math.floor(random() * length) : index
    while (i === index) i = Math.floor(random() * length)
    return i
  }
  return index < 0 ? 0 : (index + 1) % length
}

export function prevIndex(index: number, length: number): number {
  return index <= 0 ? length - 1 : index - 1
}

export function createPlayer(tracks: PlayerTrack[], media: MediaPort, events: PlayerEvents = {}) {
  const state: PlayerState = {
    index: -1,
    playing: false,
    playMode: 'order',
    volume: 0.5,
    hasCover: false,
  }
  let lastVolume = 0.5

  const notify = () => events.onState?.({ ...state })

  function load(i: number, shouldPlay: boolean) {
    const track = tracks[i]
    if (!track) return
    state.index = i
    state.hasCover = Boolean(track.cover)
    media.setSource(track.src)
    events.onTrack?.(track, i)
    if (shouldPlay) {
      media.play()
    } else {
      state.playing = false
    }
    notify()
  }

  function setVolume(v: number) {
    state.volume = clampRatio(v)
    if (state.volume > 0) lastVolume = state.volume
    media.setVolume(state.volume)
    notify()
  }

  return {
    state,
    tracks,
    load,
    togglePlay() {
      if (state.index < 0) {
        if (tracks.length) load(0, true)
        return
      }
      if (media.isPaused()) media.play()
      else media.pause()
    },
    next() {
      if (!tracks.length) return
      load(nextIndex(state.index, tracks.length, state.playMode), true)
    },
    prev() {
      if (!tracks.length) return
      if (state.index >= 0 && media.getCurrentTime() > 3) {
        media.setCurrentTime(0)
        return
      }
      load(prevIndex(state.index, tracks.length), true)
    },
    stop() {
      media.pause()
      media.reset()
      state.index = -1
      state.playing = false
      state.hasCover = false
      state.playMode = 'order'
      notify()
    },
    seekToRatio(ratio: number): number | null {
      if (state.index < 0) {
        if (!tracks.length) return null
        load(0, false)
      }
      const dur = media.getDuration()
      if (dur > 0) {
        const t = dur * ratio
        media.setCurrentTime(t)
        return t
      }
      return null
    },
    setVolume,
    // 走闭包而非 this：与返回对象的其余方法风格一致，被解构调用也不会断掉接收者
    toggleMute() {
      setVolume(state.volume === 0 ? (lastVolume > 0 ? lastVolume : 0.5) : 0)
    },
    cycleMode() {
      state.playMode = nextMode(state.playMode)
      notify()
    },
    setPlaying(playing: boolean) {
      if (state.playing === playing) return
      state.playing = playing
      notify()
    },
    setHasCover(hasCover: boolean) {
      if (state.hasCover === hasCover) return
      state.hasCover = hasCover
      notify()
    },
  }
}
