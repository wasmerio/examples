export interface CustomPageContext {
  document: Document;
  path: string;
  locale: string;
  signal: AbortSignal;
}

/** Runs on the initial page and every Astro client navigation. */
export function onPageLoad(context: CustomPageContext): void | (() => void) {
  // Example: document.querySelector('button')?.addEventListener('click', handler, { signal: context.signal });
  // Analytics page views can be sent here. Return a cleanup function if needed.
  void context;
}
