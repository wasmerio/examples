import { readdirSync } from 'node:fs'
import path from 'node:path'
import type { MusicTrack } from '@/lib/mergedSiteConfig'

const AUDIO_EXTS = new Set(['.flac', '.mp3', '.m4a', '.ogg', '.wav', '.opus', '.aac', '.webm'])

export function discoverPlaylist(): MusicTrack[] {
  const dir = path.resolve(process.cwd(), 'public', 'music')
  try {
    return readdirSync(dir)
      .filter((f) => AUDIO_EXTS.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'zh'))
      .map((f) => ({
        title: path.basename(f, path.extname(f)),
        src: `/music/${encodeURIComponent(f)}`,
      }))
  } catch {
    return []
  }
}
