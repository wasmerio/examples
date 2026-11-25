let observer: ResizeObserver | undefined;

function setup() {
  observer?.disconnect();
  observer = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const frame = (
        target.matches('[data-overflow-title]') ? target : target.parentElement
      ) as HTMLElement;
      const text = frame.firstElementChild as HTMLElement;
      const overflow = Math.ceil(text.scrollWidth - frame.clientWidth);
      frame.dataset.overflow = String(overflow > 1);
      frame.style.setProperty('--title-travel', `${-Math.max(0, overflow)}px`);
      frame.style.setProperty(
        '--title-duration',
        `${Math.max(1.6, overflow / 72 + 0.8)}s`,
      );
    }
  });
  document
    .querySelectorAll<HTMLElement>('[data-overflow-title]')
    .forEach((frame) => {
      observer!.observe(frame);
      if (frame.firstElementChild) observer!.observe(frame.firstElementChild);
    });
}
document.addEventListener('astro:page-load', setup);
document.addEventListener('astro:before-swap', () => observer?.disconnect());
