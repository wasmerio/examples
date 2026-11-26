export const clamp = (value: number): number => Math.min(1, Math.max(0, value));

export function scrollProgress(scrollY: number, worldTop: number, worldHeight: number, viewportHeight: number): number {
  return clamp((scrollY - worldTop) / Math.max(1, worldHeight - viewportHeight));
}

export function snapFrame(time: number, frame: number): number {
  return Math.round(Math.max(0, time) / frame) * frame;
}

export function chapterIndex(progress: number, chapters: readonly { progress: number }[]): number {
  let active = 0;
  chapters.forEach((chapter, index) => {
    if (clamp(progress) >= chapter.progress) active = index;
  });
  return active;
}

export function chooseSource(coarsePointer: boolean, noHover: boolean, desktop: string, mobile: string): { src: string; frame: number; touch: boolean } {
  const touch = coarsePointer || noHover;
  return { src: touch ? mobile : desktop, frame: 1 / (touch ? 12 : 24), touch };
}

/**
 * Exponential ease of the playhead toward the scroll target. `halfLifeMs` is how
 * long it takes to cover half the remaining distance, which keeps the glide
 * frame-rate independent. Returns the target exactly once within `epsilon`.
 */
export function easeToward(current: number, target: number, dtMs: number, halfLifeMs: number, epsilon = 0.0005): number {
  if (halfLifeMs <= 0) return target;
  if (dtMs <= 0) return current;
  const next = current + (target - current) * (1 - Math.pow(2, -dtMs / halfLifeMs));
  return Math.abs(target - next) <= epsilon ? target : next;
}

/**
 * Seeking a <video> needs HTTP Range support. Cloudflare Pages' *.pages.dev
 * hosts (and cold cache misses) answer a Range request with 200 + the whole
 * file, and Chrome then can't seek — the film freezes on one frame. Probe with
 * a 2-byte range: 206 means stream the URL directly; 200 means the body *is*
 * the full file, so reuse it as a blob URL (always seekable, no double download).
 */
export async function resolveSeekableSource(
  url: string,
  fetcher: typeof fetch = fetch,
  toObjectUrl: (blob: Blob) => string = (blob) => URL.createObjectURL(blob),
): Promise<{ src: string; mode: 'stream' | 'blob' }> {
  try {
    const response = await fetcher(url, { headers: { Range: 'bytes=0-1' } });
    if (response.status === 206) {
      void response.body?.cancel();
      return { src: url, mode: 'stream' };
    }
    if (response.ok) return { src: toObjectUrl(await response.blob()), mode: 'blob' };
  } catch {
    // Network/CORS trouble: fall back to the plain URL.
  }
  return { src: url, mode: 'stream' };
}

/** Document Y that puts the film at `progress` (inverse of scrollProgress). */
export function scrollYForProgress(progress: number, worldTop: number, worldHeight: number, viewportHeight: number): number {
  return Math.round(worldTop + clamp(progress) * Math.max(0, worldHeight - viewportHeight));
}
