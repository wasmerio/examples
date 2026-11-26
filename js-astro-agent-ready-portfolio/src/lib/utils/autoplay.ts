// Figures play themselves: a timer advances them while they are on screen,
// so readers watch instead of clicking. Returns null, and does nothing, when
// the reader prefers reduced motion; the figure then shows a static version.
// The pause button on the surrounding .blog-figure stops the timer (WCAG 2.2.2).
export function autoplay(
  node: Element,
  everyMs: number,
  tick: () => void,
  isPaused: () => boolean = () => Boolean(node.closest(".blog-figure.is-paused")),
) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  let timer: ReturnType<typeof setInterval> | undefined;
  const observer = new IntersectionObserver(
    ([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = setInterval(() => {
        if (!isPaused() && !document.hidden) tick();
      }, everyMs);
    },
    { threshold: 0.35 },
  );
  observer.observe(node);

  return () => {
    observer.disconnect();
    clearInterval(timer);
  };
}
