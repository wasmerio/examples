type PagefindData = {
  url: string;
  excerpt: string;
  meta: { title?: string; description?: string; sections?: string };
};
export type Pagefind = {
  init: () => Promise<void>;
  destroy: () => Promise<void>;
  search: (
    query: string,
    options?: { filters: { kind?: string; locale?: string } },
  ) => Promise<{ results: { data: () => Promise<PagefindData> }[] }>;
};
type PagefindModule = {
  createInstance: (options?: { baseUrl: string }) => Pagefind;
};
let retryId = 0;
const importUrls = new Map<string, string>();

/** ES modules survive Astro navigation. Each page needs its own language-aware instance. */
export function searchIndexes(
  base: string,
  signal: AbortSignal,
  load: (path: string) => Promise<PagefindModule> = (path) =>
    import(/* @vite-ignore */ path),
) {
  const promises = new Map<string, Promise<Pagefind>>();
  const disposers = new WeakMap<Pagefind, () => Promise<void>>();
  const get = (folder: string) => {
    if (signal.aborted)
      return Promise.reject(
        new DOMException('Navigation cancelled', 'AbortError'),
      );
    let promise = promises.get(folder);
    if (!promise) {
      // Browsers also cache failed module imports; a retry needs a fresh URL.
      const path = `${base}${folder}/pagefind.js`;
      const url = importUrls.get(path) ?? path;
      promise = Promise.resolve()
        .then(() => load(url))
        .catch((error) => {
          if ((importUrls.get(path) ?? path) === url)
            importUrls.set(path, `${path}?retry=${++retryId}`);
          throw error;
        })
        .then((module) => {
          if (signal.aborted)
            throw new DOMException('Navigation cancelled', 'AbortError');
          // Our records already carry the full pathname including site.base.
          const instance = module.createInstance({ baseUrl: '/' });
          let disposal: Promise<void> | undefined;
          const onAbort = () => {
            void dispose();
          };
          const dispose = () => {
            signal.removeEventListener('abort', onAbort);
            // Wait for a starting worker, and destroy even if initialization fails.
            return (disposal ??= Promise.resolve()
              .then(() => instance.init())
              .catch(() => {})
              .then(() => instance.destroy())
              .catch(() => {}));
          };
          disposers.set(instance, dispose);
          signal.addEventListener('abort', onAbort, { once: true });
          return instance;
        })
        .catch((error) => {
          if (promises.get(folder) === promise) promises.delete(folder);
          throw error;
        });
      promises.set(folder, promise);
    }
    return promise;
  };
  return Object.assign(get, {
    async invalidate(folder: string, instance: Pagefind) {
      const pending = promises.get(folder);
      if (
        !pending ||
        (await pending.catch(() => undefined)) !== instance ||
        promises.get(folder) !== pending
      )
        return;
      promises.delete(folder);
      await disposers.get(instance)?.();
    },
  });
}
