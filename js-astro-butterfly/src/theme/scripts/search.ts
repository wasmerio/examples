/** Pagefind search in a native <dialog>. The index is built after `astro build`. */
import { useFallbackFont } from './fallback-font';

type PagefindResult = { id: string; data: () => Promise<PagefindData> };
type PagefindData = {
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results?: { title: string; url: string; excerpt: string }[];
};
type Pagefind = {
  init: () => Promise<void>;
  options: (o: object) => Promise<void>;
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
};

const PAGE_SIZE = 8;
let pagefind: Promise<Pagefind> | undefined;
let results: PagefindResult[] = [];
let querySeq = 0;
let debounce: number | undefined;
const wait = (ms: number) => new Promise<void>((r) => (debounce = window.setTimeout(r, ms)));
let shown = 0;

/** Cache the whole initialisation, so a fast typist never searches a half-initialised index. */
function loadPagefind() {
  pagefind ??= (async () => {
    const url = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}pagefind/pagefind.js`;
    const pf = (await import(/* @vite-ignore */ url)) as Pagefind;
    // result URLs come back relative to the site root; give them the base too
    await pf.options({ excerptLength: 40, baseUrl: import.meta.env.BASE_URL });
    await pf.init();
    return pf;
  })().catch((e) => {
    pagefind = undefined; // allow a retry
    throw e;
  });
  return pagefind;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Appends the next page of results. `seq` is the query it belongs to: when another
 * input (typing, clearing) supersedes it while the details load, nothing is written.
 */
async function renderMore(seq: number, list: HTMLOListElement, more: HTMLButtonElement) {
  const slice = results.slice(shown, shown + PAGE_SIZE);
  more.disabled = true; // one page at a time, so pages can never append out of order
  try {
    const items = await Promise.all(slice.map((r) => r.data()));
    if (seq !== querySeq) return;
    shown += slice.length;
    for (const d of items) {
      const li = document.createElement('li');
      const sub = d.sub_results?.find((s) => s.url !== d.url && s.url.includes('#'));
      li.innerHTML = `<a class="search-result-title" href="${esc(d.url)}">${esc(d.meta.title ?? d.url)}</a>${
        sub ? `<a class="search-result-sub" href="${esc(sub.url)}"># ${esc(sub.title)}</a>` : ''
      }<p class="search-result-excerpt">${sub?.excerpt ?? d.excerpt}</p>`;
      list.append(li);
    }
    more.hidden = shown >= results.length;
  } finally {
    if (seq === querySeq) more.disabled = false;
  }
}

export function initSearch() {
  const dialog = () => document.getElementById('search-dialog') as HTMLDialogElement | null;

  const open = async () => {
    const dlg = dialog();
    if (!dlg) return;
    dlg.showModal();
    useFallbackFont(); // whatever the visitor types
    document.documentElement.style.overflow = 'hidden';
    const input = dlg.querySelector<HTMLInputElement>('[data-search-input]')!;
    input.focus();
    input.select();
    try {
      await loadPagefind();
    } catch {
      dlg.querySelector('[data-search-stats]')!.textContent = '搜索索引不可用（开发模式下请先运行 pnpm build）';
    }
  };

  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t.closest('[data-search-open]')) {
      e.preventDefault();
      open();
    } else if (t.closest('[data-search-close]')) {
      dialog()?.close();
    } else if (t instanceof HTMLDialogElement && t.id === 'search-dialog') {
      t.close(); // backdrop click
    } else if (t.closest('#search-dialog a')) {
      dialog()?.close();
    }
  });

  document.addEventListener('keydown', (e) => {
    // a type=search input swallows the first Escape (clears the text) — close in one press
    if (e.key === 'Escape' && dialog()?.open) {
      e.preventDefault();
      dialog()!.close();
      return;
    }
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/INPUT|TEXTAREA/.test((e.target as Element).tagName) && !(e.target as HTMLElement).isContentEditable)) {
      e.preventDefault();
      open();
    }
  });

  document.addEventListener('close', (e) => {
    if ((e.target as Element).id === 'search-dialog') document.documentElement.style.overflow = '';
  }, true);

  document.addEventListener('input', async (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.matches('[data-search-input]')) return;
    const dlg = dialog()!;
    const list = dlg.querySelector<HTMLOListElement>('[data-search-results]')!;
    const stats = dlg.querySelector<HTMLElement>('[data-search-stats]')!;
    const more = dlg.querySelector<HTMLButtonElement>('[data-search-more]')!;
    const q = input.value.trim();
    // Every input supersedes the previous one, clearing included: only the latest may render.
    const seq = ++querySeq;
    clearTimeout(debounce);
    if (!q) {
      results = [];
      shown = 0;
      list.replaceChildren();
      stats.textContent = '';
      more.hidden = true;
      more.disabled = false;
      return;
    }
    await wait(200);
    if (seq !== querySeq) return;
    const pf = await loadPagefind().catch(() => undefined);
    if (!pf || seq !== querySeq) return;
    const t0 = performance.now();
    const res = await pf.search(q);
    if (seq !== querySeq) return;
    results = res.results;
    shown = 0;
    list.replaceChildren();
    stats.textContent = results.length
      ? `找到 ${results.length} 条结果，用时 ${Math.round(performance.now() - t0)} 毫秒`
      : `没有找到与“${q}”相关的内容`;
    await renderMore(seq, list, more);
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-search-more]')) return;
    const dlg = dialog()!;
    const more = dlg.querySelector<HTMLButtonElement>('[data-search-more]')!;
    if (!more.disabled) renderMore(querySeq, dlg.querySelector('[data-search-results]')!, more);
  });
}
