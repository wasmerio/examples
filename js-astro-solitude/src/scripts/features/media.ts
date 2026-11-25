import { lifecycle } from '@/scripts/core/lifecycle';
export const initPostCoverTilt = () => {
  const cover = document.querySelector<HTMLElement>('.post-cover-aside');
  const canTilt = window.matchMedia(
    '(hover: hover) and (pointer: fine)',
  ).matches;
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (!cover || !canTilt || reduceMotion) return;
  const updateTilt = (event: PointerEvent) => {
    const rect = cover.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 10;
    const rotateY = (x - 0.5) * 10;
    cover.style.setProperty('--post-cover-glow-x', `${(x * 100).toFixed(2)}%`);
    cover.style.setProperty('--post-cover-glow-y', `${(y * 100).toFixed(2)}%`);
    cover.style.setProperty(
      '--post-cover-rotate-x',
      `${rotateX.toFixed(2)}deg`,
    );
    cover.style.setProperty(
      '--post-cover-rotate-y',
      `${rotateY.toFixed(2)}deg`,
    );
    cover.style.setProperty('--post-cover-img-x', `${(-rotateY).toFixed(2)}px`);
    cover.style.setProperty('--post-cover-img-y', `${rotateX.toFixed(2)}px`);
  };
  const resetTilt = () => {
    cover.style.setProperty('--post-cover-rotate-x', '0deg');
    cover.style.setProperty('--post-cover-rotate-y', '0deg');
    cover.style.setProperty('--post-cover-img-x', '0px');
    cover.style.setProperty('--post-cover-img-y', '0px');
  };
  lifecycle.listen(cover, 'pointerenter', updateTilt);
  lifecycle.listen(cover, 'pointermove', updateTilt);
  lifecycle.listen(cover, 'pointerleave', resetTilt);
  lifecycle.listen(cover, 'pointercancel', resetTilt);
};

export const initGalleryMasonry = () => {
  const galleries = [...document.querySelectorAll<HTMLElement>('.tag-gallery')];
  if (!galleries.length) return;
  const frames = new Set<number>();
  const observers: ResizeObserver[] = [];
  galleries.forEach((gallery) => {
    const items = Array.from(gallery.children).filter(
      (item): item is HTMLElement =>
        item instanceof HTMLElement && item.classList.contains('gallery-item'),
    );
    if (!items.length) return;
    const layout = () => {
      if (!gallery.isConnected) return;
      const style = window.getComputedStyle(gallery);
      const rowHeight = Number.parseFloat(style.gridAutoRows) || 1;
      const rowGap = Number.parseFloat(style.rowGap) || 0;
      items.forEach((item) => {
        item.style.gridRowEnd = 'auto';
      });
      gallery.classList.add('is-masonry-ready');
      items.forEach((item) => {
        const itemHeight = item.getBoundingClientRect().height;
        const span = Math.max(
          1,
          Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap)),
        );
        item.style.gridRowEnd = `span ${span}`;
      });
    };
    const scheduleLayout = () => {
      const frame = requestAnimationFrame(() => {
        frames.delete(frame);
        layout();
      });
      frames.add(frame);
    };
    const resizeObserver = new ResizeObserver(scheduleLayout);
    resizeObserver.observe(gallery);
    items.forEach((item) => resizeObserver.observe(item));
    observers.push(resizeObserver);
    gallery.querySelectorAll('img').forEach((image: HTMLImageElement) => {
      if (!image.complete) {
        lifecycle.listen(image, 'load', scheduleLayout, { once: true });
        lifecycle.listen(image, 'error', scheduleLayout, { once: true });
      }
    });
    scheduleLayout();
  });
  lifecycle.add(() => {
    observers.forEach((observer) => observer.disconnect());
    frames.forEach(cancelAnimationFrame);
  });
};
