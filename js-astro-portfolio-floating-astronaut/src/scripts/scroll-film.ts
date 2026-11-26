import chapters from '../../public/media/film/film-chapters.json';
import { chapterIndex, chooseSource, easeToward, resolveSeekableSource, scrollProgress, snapFrame } from './scroll-film-core';

// Half-life of the playhead glide. Each scroll pushes the film forward and it
// eases to a stop instead of jumping frame-to-frame with every wheel tick.
const GLIDE_HALF_LIFE_MS = 110;

const world = document.querySelector<HTMLElement>('.film-world');
const video = world?.querySelector<HTMLVideoElement>('video');

if (world && video) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const source = chooseSource(matchMedia('(pointer: coarse)').matches, matchMedia('(hover: none)').matches,
    video.dataset.srcDesktop!, video.dataset.srcMobile!);
  let worldTop = 0;
  let worldHeight = 1;
  let duration = 0;
  let targetTime = 0;
  let playhead = 0;
  let lastTick = 0;
  let inFlight = false;
  let initialized = false;
  let priming = false;
  let raf = 0;
  let loading: Promise<void> | undefined;

  const measure = (): void => {
    worldTop = world.getBoundingClientRect().top + window.scrollY;
    worldHeight = world.offsetHeight;
  };

  const seekLatest = (): void => {
    if (!initialized || motion.matches || inFlight || video.seeking) return;
    const frameTime = snapFrame(playhead, source.frame);
    if (world.classList.contains('is-ready') && Math.abs(video.currentTime - frameTime) < source.frame * .45) return;
    inFlight = true;
    // Explicitly assigning zero also requests the initial seek, keeping the
    // poster in place until the decoder has completed its first seek.
    video.currentTime = frameTime;
  };

  // Components follow the film, not the raw scroll, so text and video stay in step.
  const publish = (): void => {
    const progress = duration > 0 ? Math.min(1, playhead / Math.max(source.frame, duration - source.frame)) : targetProgress;
    document.documentElement.style.setProperty('--film-progress', String(progress));
    document.documentElement.dataset.chapter = String(chapterIndex(progress, chapters.chapters));
  };

  let targetProgress = 0;
  const readTarget = (): void => {
    targetProgress = scrollProgress(window.scrollY, worldTop, worldHeight, window.innerHeight);
    targetTime = targetProgress * Math.max(0, duration - source.frame);
  };

  const tick = (now: number): void => {
    raf = 0;
    const dt = lastTick ? Math.min(64, now - lastTick) : 16;
    lastTick = now;
    playhead = easeToward(playhead, targetTime, dt, GLIDE_HALF_LIFE_MS, source.frame * .1);
    publish();
    seekLatest();
    if (playhead !== targetTime) raf = requestAnimationFrame(tick);
    else lastTick = 0;
  };

  const schedule = (): void => {
    readTarget();
    if (motion.matches || !initialized) { playhead = targetTime; publish(); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  };

  // First paint and resizes jump straight to the scroll position (no glide).
  const sync = (): void => {
    readTarget();
    playhead = targetTime;
    publish();
    seekLatest();
  };

  const initialize = (): void => {
    if (motion.matches || video.readyState < 1) return;
    video.pause();
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    initialized = duration > 0;
    measure();
    sync();
  };

  const prime = (): void => {
    if (motion.matches || priming || initialized) return;
    priming = true;
    video.play().then(() => {
      video.pause();
      priming = false;
      if (motion.matches) return;
      if (video.readyState >= 1) initialize();
      else video.addEventListener('loadedmetadata', initialize, { once: true });
    }).catch(() => {
      priming = false;
      // Low Power Mode may require a gesture; the poster remains visible.
    });
  };

  video.addEventListener('seeked', () => {
    inFlight = false;
    if (motion.matches) return;
    world.classList.add('is-ready');
    seekLatest();
  });
  video.addEventListener('loadedmetadata', () => {
    if (!source.touch) initialize();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { measure(); sync(); }, { passive: true });
  // Content (fonts, images, opened <details>) changes the world's height.
  if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); schedule(); }).observe(world);
  if (source.touch) {
    window.addEventListener('touchstart', prime, { passive: true });
    window.addEventListener('pointerdown', prime, { passive: true });
  }
  const start = (): void => {
    if (motion.matches) return;
    if (!video.getAttribute('src')) {
      if (!loading) {
        loading = resolveSeekableSource(source.src).then(({ src, mode }) => {
          world.dataset.filmMode = mode;
          video.src = src;
          video.load();
        });
      }
      // Re-enter once the seekable source is attached.
      void loading.then(() => { if (video.getAttribute('src')) start(); });
      return;
    }
    if (source.touch) prime();
    else if (video.readyState >= 1) initialize();
  };
  motion.addEventListener('change', () => {
    if (motion.matches) {
      video.pause();
      world.classList.remove('is-ready');
    } else start();
    schedule();
  });
  measure();
  sync();
  start();
}
