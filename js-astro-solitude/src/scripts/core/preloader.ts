import type {
  TransitionBeforePreparationEvent,
  TransitionBeforeSwapEvent,
} from 'astro:transitions/client';
import type { SolitudeAPI } from '@/scripts/types/api';

export function initPreloader(api: Pick<SolitudeAPI, 'endLoading'>) {
  const loader = document.getElementById('page-loader');
  let activeNavigation: AbortSignal | undefined;
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

  const end = () => {
    activeNavigation = undefined;
    clearTimeout(fallbackTimer);
    if (loader) loader.dataset.state = 'complete';
  };

  api.endLoading = end;
  if (!loader) return;

  if (document.readyState === 'complete') end();
  else {
    window.addEventListener('load', () => {
      if (!activeNavigation) end();
    }, { once: true });
  }

  document.addEventListener('astro:before-preparation', (event) => {
    const { signal } = event as TransitionBeforePreparationEvent;
    activeNavigation = signal;
    loader.dataset.state = 'loading';
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(end, 5000);

    signal.addEventListener('abort', () => {
      // If a second navigation starts in this turn, it owns the loader now.
      queueMicrotask(() => {
        if (activeNavigation === signal) end();
      });
    }, { once: true });
  });

  document.addEventListener('astro:before-swap', (event) => {
    const { signal, viewTransition } = event as TransitionBeforeSwapEvent;
    const finish = () => {
      if (activeNavigation === signal) end();
    };
    void viewTransition.finished.then(finish, finish);
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) end();
  });
}
