import { onPageLoad } from '../../custom/client';

let controller: AbortController | undefined;
let cleanup: void | (() => void);
function dispose() {
  controller?.abort();
  const previous = cleanup;
  cleanup = undefined;
  try {
    if (previous) previous();
  } catch (error) {
    console.error('BlogGPT custom cleanup hook:', error);
  }
}
document.addEventListener('astro:before-swap', dispose);
document.addEventListener('astro:page-load', () => {
  dispose();
  controller = new AbortController();
  try {
    cleanup = onPageLoad({
      document,
      path: location.pathname,
      locale: document.body.dataset.locale ?? '',
      signal: controller.signal,
    });
  } catch (error) {
    console.error('BlogGPT custom page hook:', error);
  }
});
