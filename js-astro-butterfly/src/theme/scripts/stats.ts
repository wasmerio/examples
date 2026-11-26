/**
 * Visitor counters for the configured statistics service:
 * site UV / PV in the aside's webinfo card and the page PV in the post meta.
 *
 * Elements: <span data-bsz="site_uv|site_pv|page_pv">…</span>.
 * One request per page view, re-run when Astro swaps in a new page.
 *
 * Slow or blocked network: the request is async and never blocks rendering; the
 * placeholder "…" turns into "—" after TIMEOUT.
 */

type Counts = Partial<Record<string, unknown>>;

const API = 'https://busuanzi.ibruce.info/busuanzi';
const TIMEOUT = 8000;
const SELF_HOSTED_TIMEOUT = 12000;
const countedPages = new WeakSet<HTMLElement>();
let requestId = 0;
let cancelPending: (() => void) | undefined;

document.addEventListener('astro:before-swap', () => cancelPending?.());

function fill(body: HTMLElement, data: Counts | null, prefix = '') {
  body.querySelectorAll<HTMLElement>('[data-bsz]').forEach((el) => {
    const raw = data?.[prefix + el.dataset.bsz];
    const v = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : raw;
    if (typeof v === 'number' && Number.isSafeInteger(v) && v >= 0) {
      el.textContent = v.toLocaleString('zh-CN');
      el.removeAttribute('aria-busy');
      el.removeAttribute('title');
    } else if (el.getAttribute('aria-busy') === 'true') {
      el.textContent = '—';
      el.removeAttribute('aria-busy');
      el.title = '统计服务暂时无法访问';
    }
  });
}

export function initStats() {
  const { body } = document;
  if (!body.hasAttribute('data-busuanzi') || countedPages.has(body)) return;
  countedPages.add(body);

  const endpoint = body.dataset.statsEndpoint;
  if (endpoint || body.dataset.busuanzi === 'busuanzi.cc') {
    void countWithPost(body, endpoint);
  } else {
    countWithJsonp(body);
  }
}

async function countWithPost(body: HTMLElement, endpoint?: string) {
  const { origin, pathname } = location;
  const controller = new AbortController();
  const cancel = () => controller.abort();
  // Let the self-hosted request finish across an Astro swap, including its Set-Cookie.
  if (!endpoint) cancelPending = cancel;
  const timer = window.setTimeout(() => {
    cancel();
    fill(body, null);
  }, endpoint ? SELF_HOSTED_TIMEOUT : TIMEOUT);

  try {
    const data = endpoint
      ? await (await import('./stats-self-hosted')).fetchSelfHostedCounts(endpoint, pathname, controller.signal)
      : await (await import('./stats-post')).fetchCounts(origin + pathname, controller.signal);
    if (!controller.signal.aborted) fill(body, data, endpoint ? '' : 'busuanzi_');
  } catch {
    if (!controller.signal.aborted) fill(body, null);
  } finally {
    window.clearTimeout(timer);
    if (cancelPending === cancel) cancelPending = undefined;
  }
}

function countWithJsonp(body: HTMLElement) {
  const callbackName = `BusuanziCallback_${Date.now().toString(36)}_${++requestId}`;
  const callbacks = window as unknown as Record<string, (data: Counts | null) => void>;
  const script = document.createElement('script');
  const timer = window.setTimeout(() => fill(body, null), TIMEOUT);
  const cleanup = () => {
    window.clearTimeout(timer);
    script.onload = script.onerror = null;
    script.remove();
    delete callbacks[callbackName];
    cancelPending = undefined;
  };
  const finish = (data: Counts | null) => {
    cleanup();
    fill(body, data);
  };

  cancelPending = cleanup;
  callbacks[callbackName] = finish;
  // A response can load successfully without invoking the JSONP callback.
  script.onload = script.onerror = () => finish(null);
  script.src = `${API}?jsonpCallback=${callbackName}`;
  script.async = true;
  // The original service keys page PV by the full Referer.
  script.referrerPolicy = 'no-referrer-when-downgrade';
  document.head.append(script);
}
