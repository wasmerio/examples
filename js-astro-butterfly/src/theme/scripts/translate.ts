import { load, save, toast } from './store';
import { useFallbackFont } from './fallback-font';

/**
 * Simplified ⇄ Traditional switch (Butterfly `translate`, rightside "繁" button).
 *
 * The site is written in Simplified Chinese. Switching converts text nodes and the
 * title / alt / placeholder / aria-label attributes character by character, with
 * Butterfly's own 2,520-pair table. Differences from tw_cn.js:
 *  - the table (15 KB) is a separate chunk, fetched only when someone has chosen
 *    Traditional, so everyone else downloads nothing extra (matters on slow links);
 *  - originals are remembered, so switching back restores the exact source text
 *    instead of running a lossy reverse conversion;
 *  - code (pre/code/kbd/samp, Expressive Code) is left alone, so samples still compile;
 *  - content added later (comments, newest-comments card, toasts) is converted as it
 *    appears, and the choice follows client-side navigation.
 */

type Script = 'hans' | 'hant';
const KEY = 'zh-script';
const ATTRS = ['title', 'alt', 'placeholder', 'aria-label'] as const;
const SKIP = 'script, style, noscript, textarea, pre, code, kbd, samp, svg, .expressive-code, [data-no-translate]';

const root = document.documentElement;
let script: Script = load<Script>(KEY) === 'hant' ? 'hant' : 'hans';
let toHant: Map<string, string> | null = null;
let toHans: Map<string, string> | null = null;
let observer: MutationObserver | null = null;

// Exact originals for everything we changed, so switching back is lossless.
const textOriginal = new WeakMap<Text, { from: string; to: string }>();
const attrOriginal = new WeakMap<Element, Map<string, { from: string; to: string }>>();

async function table() {
  if (toHant && toHans) return;
  const { SIMPLIFIED, TRADITIONAL } = await import('./zh-map');
  const s = [...SIMPLIFIED];
  const t = [...TRADITIONAL];
  toHant = new Map(s.map((c, i) => [c, t[i]]));
  toHans = new Map(t.map((c, i) => [c, s[i]]));
}

function convert(text: string, map: Map<string, string>) {
  let out = '';
  let changed = false;
  for (const ch of text) {
    const r = map.get(ch);
    if (r && r !== ch) changed = true;
    out += r ?? ch;
  }
  return changed ? out : text;
}

const skipped = (el: Element | null) => !!el?.closest(SKIP);

function toTraditional(scope: Node) {
  useFallbackFont(); // most traditional characters are outside the site's font chunks
  const map = toHant!;
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) =>
      n.nodeType === Node.ELEMENT_NODE && (n as Element).matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const visit = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const t = n as Text;
      const next = convert(t.data, map);
      if (next !== t.data) {
        textOriginal.set(t, { from: t.data, to: next });
        t.data = next;
      }
      return;
    }
    const el = n as Element;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v) continue;
      const next = convert(v, map);
      if (next === v) continue;
      let m = attrOriginal.get(el);
      if (!m) attrOriginal.set(el, (m = new Map()));
      m.set(a, { from: v, to: next });
      el.setAttribute(a, next);
    }
  };
  if (scope.nodeType === Node.TEXT_NODE) {
    if (!skipped(scope.parentElement)) visit(scope);
    return;
  }
  if (scope.nodeType === Node.ELEMENT_NODE && skipped(scope as Element)) return;
  if (scope.nodeType === Node.ELEMENT_NODE) visit(scope);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) visit(n);
}

function toSimplified() {
  const map = toHans!;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) {
      const t = n as Text;
      const o = textOriginal.get(t);
      // untouched since we converted it → exact original; otherwise (new comment etc.) reverse-map
      if (o && t.data === o.to) t.data = o.from;
      else if (!skipped(t.parentElement)) t.data = convert(t.data, map);
      textOriginal.delete(t);
      continue;
    }
    const el = n as Element;
    const m = attrOriginal.get(el);
    if (!m) continue;
    for (const [a, o] of m) if (el.getAttribute(a) === o.to) el.setAttribute(a, o.from);
    attrOriginal.delete(el);
  }
}

function convertTitle() {
  if (script === 'hant') document.title = convert(document.title, toHant!);
}

function watch() {
  observer?.disconnect();
  if (script !== 'hant') return;
  observer = new MutationObserver((records) => {
    observer!.disconnect(); // our own writes must not re-trigger us
    for (const r of records) {
      if (r.type === 'characterData') toTraditional(r.target);
      else r.addedNodes.forEach((n) => toTraditional(n));
    }
    observer!.observe(document.body, { childList: true, characterData: true, subtree: true });
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });
}

function syncButton() {
  // Only when it changes: any write re-matches :lang for the whole page, a full
  // style pass on every load (~0.2 s on a phone-class CPU on a long post).
  const lang = script === 'hant' ? 'zh-TW' : 'zh-CN';
  if (root.lang !== lang) root.lang = lang;
  document.querySelectorAll<HTMLButtonElement>('[data-translate]').forEach((b) => {
    // shows what a click switches to, like Butterfly (繁 / 簡)
    b.textContent = script === 'hant' ? '簡' : '繁';
    b.title = script === 'hant' ? '切换为简体中文' : '切换为繁体中文';
    b.setAttribute('aria-label', b.title);
  });
}

/** Re-apply after every page load (first load and client-side navigation). */
async function apply() {
  syncButton();
  if (script !== 'hant') return;
  await table();
  if (script !== 'hant') return; // switched back while the table was loading
  toTraditional(document.body);
  convertTitle();
  syncButton(); // the walker skips nothing in the button, so reset its label
  watch();
}

export function initTranslate() {
  document.addEventListener('click', async (e) => {
    const btn = (e.target as Element).closest('[data-translate]');
    if (!btn) return;
    const next: Script = script === 'hant' ? 'hans' : 'hant';
    btn.setAttribute('aria-busy', 'true');
    try {
      await table(); // one small request on first use; no-op afterwards
    } catch {
      btn.removeAttribute('aria-busy');
      toast('转换表加载失败，请检查网络后重试', 'error');
      return;
    }
    btn.removeAttribute('aria-busy');
    script = next;
    save(KEY, script);
    if (script === 'hant') {
      toTraditional(document.body);
      convertTitle();
      watch();
      syncButton();
      toast('已切换为繁体中文'); // converted by the observer
    } else {
      observer?.disconnect();
      toSimplified();
      document.title = convert(document.title, toHans!);
      syncButton();
      toast('已切换为简体中文');
    }
  });

  document.addEventListener('astro:page-load', () => {
    apply().catch(() => {
      /* table failed to load on a bad connection: page simply stays Simplified */
    });
  });
  // the next page's <title> arrives in Simplified
  document.addEventListener('astro:after-swap', () => observer?.disconnect());
}
