import { prepareAssets } from '@/scripts/app/assets';
import '@/scripts/features/comments';
import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';
import { initPreloader } from '@/scripts/core/preloader';
import { installUtilities } from '@/scripts/core/utils';

installUtilities();
initPreloader(Solitude);
// Astro 7.3.2 does not observe ViewTransition.ready. A superseding navigation
// legitimately rejects it when skipTransition() cancels the visual transition.
// Observe that promise without changing DOM updates or suppressing page errors.
const startViewTransition = document.startViewTransition?.bind(document);
if (startViewTransition) {
  document.startViewTransition = (...args) => {
    const transition = startViewTransition(...args);
    void transition.ready.catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.warn('Solitude view transition could not animate:', error);
      }
    });
    return transition;
  };
}
let first = true;
let navigation = 0;
document.addEventListener('astro:before-swap', () => {
  navigation++;
  document.documentElement.dataset.solitudeRuntime = 'mounting';
  lifecycle.emit('beforeNavigate');
  lifecycle.disposePage();
  document.body.style.overflow = '';
  document.documentElement.classList.remove('search-open');
  window.Fancybox?.close?.();
});
async function mount() {
  const version = ++navigation;
  document.documentElement.dataset.solitudeRuntime = 'mounting';
  await prepareAssets();
  if (version !== navigation) return;
  const { initializeApp } = await import('@/scripts/app');
  if (version !== navigation) return;
  if (first) {
    first = false;
    await initializeApp(() => version === navigation);
  } else {
    await Solitude.refresh();
    if (version !== navigation) return;
    lifecycle.emit('afterNavigate', { page: Solitude.page });
  }
  if (version !== navigation) return;
  await import('@/scripts/features/mdx');
  if (version !== navigation) return;
  window.__solitudeShortcodeRuntime?.init();
  if (version === navigation) {
    document.documentElement.dataset.solitudeRuntime = 'ready';
  }
}
document.addEventListener('astro:page-load', () => {
  void mount().catch((error) => {
    document.documentElement.dataset.solitudeRuntime = 'error';
    console.error('Solitude initialization failed', error);
  });
});
