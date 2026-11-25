export interface ScriptOptions {
  async?: boolean;
  attributes?: Record<string, string>;
  timeout?: number;
}
export interface StyleOptions {
  id?: string;
  timeout?: number;
}
const scriptRequests = new Map<string, Promise<HTMLScriptElement>>();
const styleRequests = new Map<string, Promise<HTMLLinkElement>>();
function loadElement<T extends HTMLScriptElement | HTMLLinkElement>(
  cache: Map<string, Promise<T>>,
  selector: string,
  create: (url: string) => T,
  source: string,
  timeout = 8000,
): Promise<T> {
  if (!source) return Promise.reject(new Error('A resource URL is required'));
  const address = new URL(source, document.baseURI).href;
  const existing = document.querySelector<T>(
    `${selector}[data-solitude-resource="${CSS.escape(address)}"]`,
  );
  if (cache.has(address))
    return cache.get(address)!.then((element) => {
      if (!element.isConnected) document.head.append(element);
      return element;
    });
  if (existing?.dataset.loaded === 'true') return Promise.resolve(existing);
  const promise = new Promise<T>((resolve, reject) => {
    const element = existing ?? create(address);
    element.dataset.solitudeResource = address;
    let timer: ReturnType<typeof setTimeout>;
    const complete = () => {
      clearTimeout(timer);
      element.dataset.loaded = 'true';
      resolve(element);
    };
    const fail = () => {
      clearTimeout(timer);
      cache.delete(address);
      element.remove();
      reject(new Error(`Unable to load ${address}`));
    };
    element.addEventListener('load', complete, { once: true });
    element.addEventListener('error', fail, { once: true });
    timer = setTimeout(fail, timeout);
    if (!existing) document.head.append(element);
  });
  cache.set(address, promise);
  return promise;
}
export const loadScript = (source: string, options: ScriptOptions = {}) =>
  loadElement(
    scriptRequests,
    'script',
    (address) => {
      const script = document.createElement('script');
      script.src = address;
      script.async = options.async ?? true;
      Object.entries(options.attributes ?? {}).forEach(([k, v]) =>
        script.setAttribute(k, v),
      );
      return script;
    },
    source,
    options.timeout,
  );
export const loadStyle = (source: string, options: StyleOptions = {}) =>
  loadElement(
    styleRequests,
    'link',
    (address) => {
      const link = document.createElement('link');
      link.href = address;
      link.rel = 'stylesheet';
      if (options.id) link.id = options.id;
      return link;
    },
    source,
    options.timeout,
  );
