/**
 * 讲解里的行内公式：`<RichText text="令 $q = W^{Q}x$" />` 和 `<Tex tex="W^{UK}" />`。
 *
 * KaTeX（约 77KB gzip）按需加载，不进没有公式的讲解页面的客户端包：
 * - 服务端：模块初始化时静态等到 katex 加载完，岛屿的服务端 HTML 里就是排好的公式。
 * - 客户端：先从服务端预渲染的 `.wisp-tex[data-tex]` DOM 采集缓存，只有仍存在未命中公式时才用动态 import()
 *   加载 katex。水合时公式节点用 dangerouslySetInnerHTML + suppressHydrationWarning 保留服务端 HTML。
 * 样式（katex.css，含字体）按 URL 仅在客户端渲染公式且页面尚未引入时动态插入 `<link>`，避免打进共享样式包。
 */
import { useEffect, useSyncExternalStore } from 'react';
import type KatexNS from 'katex';
import { parseInlineMath } from '../core/math';
import katexCssUrl from '../../styles/katex.css?url';

type Katex = typeof KatexNS;

let katex: Katex | null = null;
let pending: Promise<Katex> | null = null;
const listeners = new Set<() => void>();

if (import.meta.env.SSR) katex = (await import('katex')).default;

function ensureKatexCss() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[rel="stylesheet"][href*="katex"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = katexCssUrl;
  document.head.appendChild(link);
}

/** 加载 KaTeX（幂等）。TexLabel / RichText 遇到未缓存公式时自动调用；也可以提前预热。 */
export function loadKatex(): Promise<Katex> {
  if (katex) return Promise.resolve(katex);
  pending ??= import('katex').then((m) => {
    katex = m.default;
    for (const l of listeners) l();
    return katex;
  });
  return pending;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => katex;
// 水合时客户端必须假定还没有 katex（服务端 HTML 由 suppressHydrationWarning 保留）
const getServerSnapshot = () => (import.meta.env.SSR ? katex : null);

function useKatex(needed: boolean, hasMath: boolean): Katex | null {
  const k = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    if (hasMath) ensureKatexCss();
    if (needed && !k) void loadKatex();
  }, [needed, hasMath, k]);
  return k;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const cache = new Map<string, string>();

/** 从服务端预渲染的 `.wisp-tex[data-tex]` 元素采集 KaTeX HTML 到客户端缓存（幂等）。 */
export function harvestSsrTex(): void {
  if (typeof document === 'undefined') return;
  for (const el of document.querySelectorAll<HTMLElement>('.wisp-tex[data-tex]')) {
    const tex = el.dataset.tex;
    if (tex !== undefined && !cache.has(tex) && el.querySelector('.katex')) {
      cache.set(tex, el.innerHTML);
    }
  }
}

/** 公式 → HTML。优先复用缓存（含 SSR 采集结果）；未命中且未加载 KaTeX 时回落为转义源码。 */
export function renderTex(k: Katex | null, tex: string): string {
  let html = cache.get(tex);
  if (html !== undefined) return html;
  if (!import.meta.env.SSR) {
    harvestSsrTex();
    html = cache.get(tex);
    if (html !== undefined) return html;
  }
  if (!k) return escapeHtml(tex);
  html = k.renderToString(tex, {
    throwOnError: false,
    errorColor: 'var(--wisp-sem-error)',
    strict: 'ignore',
    output: 'htmlAndMathml',
  });
  cache.set(tex, html);
  return html;
}

const TRAILING_KINSOKU = /^[，,。.、；;：:！!？?）》」』】〉…]/;

function TexSpan({ tex, k, kinsoku }: { tex: string; k: Katex | null; kinsoku?: boolean }) {
  return (
    <span
      className="wisp-tex"
      data-tex={tex}
      data-wisp-kinsoku={kinsoku ? '' : undefined}
      dangerouslySetInnerHTML={{ __html: renderTex(k, tex) }}
      suppressHydrationWarning
    />
  );
}

export interface TexProps {
  /** TeX 源码，不带 `$` */
  tex: string;
}

/** 单个行内公式。 */
export function Tex({ tex }: TexProps) {
  let needsClientKatex = true;
  if (!import.meta.env.SSR) {
    if (!cache.has(tex)) harvestSsrTex();
    needsClientKatex = !cache.has(tex);
  }
  const k = useKatex(needsClientKatex, true);
  return <TexSpan tex={tex} k={k} />;
}

export interface RichTextProps {
  /** 带 `$…$` 行内公式的文字；公式以外的文字原样转义输出，`\$` 是字面量美元符号 */
  text: string;
}

/** 文字 + 行内公式（片段，不加外层元素）。 */
export function RichText({ text }: RichTextProps) {
  const segments = parseInlineMath(text);
  const mathSegments = segments.filter((s) => s.type === 'math');
  const hasMath = mathSegments.length > 0;
  let needsClientKatex = false;
  if (hasMath) {
    if (import.meta.env.SSR) {
      needsClientKatex = true;
    } else {
      if (mathSegments.some((s) => !cache.has(s.value))) harvestSsrTex();
      needsClientKatex = mathSegments.some((s) => !cache.has(s.value));
    }
  }
  const k = useKatex(needsClientKatex, hasMath);
  return (
    <>
      {segments.map((s, i) => {
        if (s.type === 'text') return s.value;
        const next = segments[i + 1];
        const kinsoku = next?.type === 'text' && TRAILING_KINSOKU.test(next.value);
        return <TexSpan key={i} tex={s.value} k={k} kinsoku={kinsoku} />;
      })}
    </>
  );
}
