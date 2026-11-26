/** Photo viewer for the gallery: native <dialog>, arrow keys, swipe, no dependency. */
export function initLightbox(list: HTMLElement, dialog: HTMLDialogElement): void {
  const links = [...list.querySelectorAll<HTMLAnchorElement>('a[data-index]')];
  const image = dialog.querySelector<HTMLImageElement>('[data-image]');
  const caption = dialog.querySelector<HTMLElement>('[data-caption]');
  const counter = dialog.querySelector<HTMLElement>('[data-counter]');
  if (!links.length || !image || !caption || !counter) return;

  let current = 0;
  let opener: HTMLElement | null = null;

  const show = (index: number) => {
    current = (index + links.length) % links.length;
    const link = links[current];
    if (!link) return;
    image.src = link.href;
    image.alt = link.dataset.alt ?? '';
    caption.textContent = link.dataset.alt ?? '';
    counter.textContent = `${current + 1} / ${links.length}`;
    // Preload the next photo so the swipe feels instant.
    const next = links[(current + 1) % links.length];
    if (next) new Image().src = next.href;
  };

  links.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      opener = link;
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1));
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });

  let startX: number | null = null;
  dialog.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
  });
  dialog.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    const dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
}
