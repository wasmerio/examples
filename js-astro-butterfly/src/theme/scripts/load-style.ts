/** Load library CSS on first use, retaining it across Astro navigations. */
const pending = new Map<string, Promise<void>>();
export function loadStyle(href: string): Promise<void> {
  let promise = pending.get(href);
  if (!promise) {
    promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-runtime-style', '');
      link.onload = () => resolve();
      link.onerror = () => {
        pending.delete(href);
        link.remove();
        reject(new Error(`Unable to load stylesheet: ${href}`));
      };
      document.head.append(link);
    });
    pending.set(href, promise);
  }
  return promise;
}
