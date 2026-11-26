import { describe, expect, it } from 'vitest';
import { chapterIndex, chooseSource, easeToward, resolveSeekableSource, scrollProgress, scrollYForProgress, snapFrame } from '../../src/scripts/scroll-film-core';
import film from '../../public/media/film/film-chapters.json';

describe('scroll progress', () => {
  it('accounts for world offset and viewport height', () => {
    expect(scrollProgress(2350, 100, 5400, 900)).toBe(.5);
    expect(scrollProgress(100, 100, 5400, 900)).toBe(0);
    expect(scrollProgress(4600, 100, 5400, 900)).toBe(1);
  });
  it('clamps outside the world and handles a non-scrollable world', () => {
    expect(scrollProgress(-20, 100, 5400, 900)).toBe(0);
    expect(scrollProgress(9000, 100, 5400, 900)).toBe(1);
    expect(scrollProgress(0, 0, 900, 900)).toBe(0);
  });
});

describe('frame snapping', () => {
  it.each([24, 12])('snaps to the nearest frame at %i fps', (fps) => {
    expect(snapFrame(1.01, 1 / fps)).toBe(1);
    expect(snapFrame(1.75 / fps, 1 / fps)).toBe(2 / fps);
    expect(snapFrame(-1, 1 / fps)).toBe(0);
    const end = snapFrame(film.duration - 1 / fps, 1 / fps);
    expect(end).toBeLessThan(film.duration);
    // Nearest-frame snapping: within half a frame of the target, never past the end.
    expect(Math.abs(end - (film.duration - 1 / fps))).toBeLessThanOrEqual(0.5 / fps + 1e-9);
  });
});

describe('chapters', () => {
  it('uses each inclusive chapter boundary from the build-time map', () => {
    film.chapters.forEach((chapter, index) => {
      expect(chapterIndex(chapter.progress, film.chapters)).toBe(index);
      if (index) expect(chapterIndex(chapter.progress - .00001, film.chapters)).toBe(index - 1);
    });
    expect(chapterIndex(.5, film.chapters)).toBe(2);
    expect(chapterIndex(-1, film.chapters)).toBe(0);
    expect(chapterIndex(2, film.chapters)).toBe(4);
  });
});

describe('source choice', () => {
  it.each([[false, false, 'desktop', 24], [true, false, 'mobile', 12], [false, true, 'mobile', 12], [true, true, 'mobile', 12]] as const)(
    'chooses by pointer=%s hover=%s', (coarse, noHover, src, fps) => {
      expect(chooseSource(coarse, noHover, 'desktop', 'mobile')).toEqual({ src, frame: 1 / fps, touch: coarse || noHover });
    });
});

describe('playhead easing', () => {
  it('moves part of the way toward the target each frame, never overshooting', () => {
    const next = easeToward(0, 10, 16, 100);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
    expect(easeToward(10, 0, 16, 100)).toBeLessThan(10);
    expect(easeToward(10, 0, 16, 100)).toBeGreaterThan(0);
  });
  it('covers half the remaining distance after one half-life', () => {
    expect(easeToward(0, 10, 100, 100)).toBeCloseTo(5, 6);
  });
  it('is frame-rate independent: two 8 ms steps equal one 16 ms step', () => {
    expect(easeToward(easeToward(0, 10, 8, 100), 10, 8, 100)).toBeCloseTo(easeToward(0, 10, 16, 100), 9);
  });
  it('lands exactly on the target once within epsilon, so the loop can stop', () => {
    expect(easeToward(9.9995, 10, 16, 100, 0.001)).toBe(10);
  });
  it('treats a non-positive dt or half-life as no movement / instant', () => {
    expect(easeToward(3, 10, 0, 100)).toBe(3);
    expect(easeToward(3, 10, 16, 0)).toBe(10);
  });
});

describe('seekable source', () => {
  const fake = (status: number) => (async () => new Response(status === 206 ? 'ab' : 'whole-file', { status })) as unknown as typeof fetch;
  it('streams directly when the server honours Range (206)', async () => {
    expect(await resolveSeekableSource('/f.mp4', fake(206), () => 'blob:x')).toEqual({ src: '/f.mp4', mode: 'stream' });
  });
  it('reuses the full 200 body as a blob URL when Range is ignored', async () => {
    let size = 0;
    const result = await resolveSeekableSource('/f.mp4', fake(200), (blob) => { size = blob.size; return 'blob:film'; });
    expect(result).toEqual({ src: 'blob:film', mode: 'blob' });
    expect(size).toBe('whole-file'.length);
  });
  it('falls back to the plain URL on errors', async () => {
    const failing = (async () => { throw new Error('offline'); }) as unknown as typeof fetch;
    expect(await resolveSeekableSource('/f.mp4', failing, () => 'blob:x')).toEqual({ src: '/f.mp4', mode: 'stream' });
    expect(await resolveSeekableSource('/f.mp4', fake(404), () => 'blob:x')).toEqual({ src: '/f.mp4', mode: 'stream' });
  });
});

describe('scroll position for a chapter', () => {
  it('is the inverse of scrollProgress', () => {
    for (const p of [0, .2, .5, .79, 1]) {
      const y = scrollYForProgress(p, 100, 5400, 900);
      expect(scrollProgress(y, 100, 5400, 900)).toBeCloseTo(p, 3);
    }
  });
  it('clamps out-of-range progress', () => {
    expect(scrollYForProgress(-1, 100, 5400, 900)).toBe(100);
    expect(scrollYForProgress(2, 100, 5400, 900)).toBe(4600);
  });
});
