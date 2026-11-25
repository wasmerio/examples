const mediaContainerSelector = '.featured-thumb-wrap, .featured-post-card-media';

function markLoaded(img: HTMLImageElement) {
  img.classList.remove('is-image-pending');
  img.classList.add('is-image-loaded');
  img.closest(mediaContainerSelector)?.classList.remove('is-image-pending');
  img.closest(mediaContainerSelector)?.classList.add('is-media-loaded');
}

function markPending(img: HTMLImageElement) {
  img.classList.add('is-image-pending');
  img.closest(mediaContainerSelector)?.classList.add('is-image-pending');
}

export function mountImageLoadingStates() {
  document.querySelectorAll<HTMLImageElement>('main img').forEach((img) => {
    if (img.dataset.loadingStateReady === 'true') return;
    img.dataset.loadingStateReady = 'true';

    const container = img.closest(mediaContainerSelector);
    if (container && container.getClientRects().length === 0) return;

    if (img.complete && img.naturalWidth > 0) {
      markLoaded(img);
      return;
    }

    markPending(img);
    img.addEventListener('load', () => markLoaded(img), { once: true });
    img.addEventListener(
      'error',
      () => {
        img.classList.remove('is-image-pending');
        img.closest(mediaContainerSelector)?.classList.remove('is-image-pending');
      },
      { once: true }
    );
  });
}
