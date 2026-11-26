/**
 * 图表渲染的共享实现（diagrams.md §5）：remark-diagram 与 Diagram.astro 都调用 renderDiagram()。
 *
 * 职责：
 * - 解析引用（`./diagrams/x.drawio#page=encoder`），相对 Markdown 文件定位源文件；
 * - 用 diagrams.manifest.json 校验源文件与 .wisp.svg 的哈希（与 `pnpm diagram check` 同一套逻辑）；
 * - 选择 draw.io 页面（页名或 1 起的序号）；
 * - 处理 SVG：id 页面内唯一化、alt 写入 <title>、去掉根元素 width/height；
 * - 生成 <figure>：题注独占全宽，动作（下载源文件、可选的“在 draw.io 中打开”）在桌面端悬浮于图表右上角、触屏与窄屏回退到底部换行。
 * 产物缺失或过期：dev 返回醒目的占位块；build 抛错。
 *
 * 只依赖 node 内置模块：remark 插件会被打进 SSR 构建。manifest 由 skill 的 Python CLI 写入，
 * 这里只做只读校验（哈希算法与 wisp_diagram_lib/manifest.py 一致）。
 */
import { iconSvg } from './icons';
import { figureCaptionHtml } from '../plugins/figure-caption';
import { postId } from '../utils/post-id';
import { createHash } from 'node:crypto';
import { existsSync, globSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export type DiagramStyle = 'hand' | 'clean';

export interface DiagramRef {
  /** 写在文章里的路径，可带 `#page=<名称|序号>`；相对路径相对 `from` 所在目录解析 */
  src: string;
  /** 引用方 Markdown/MDX 文件的绝对路径（相对 src 时必需） */
  from?: string;
  /** draw.io 页面：页名，或从 1 起的序号；优先于 src 中的 #page= */
  page?: string | number;
  /** 写入 <title>；为空时保留构建时生成的标题 */
  alt?: string;
  /** 写入 <figcaption> */
  caption?: string;
  /** 突破正文宽度（.wisp-wide） */
  wide?: boolean;
  /** false 时不显示下载链接（覆盖全局开关） */
  download?: boolean;
  /** 页面内序号，用于 id 唯一化 */
  seq: number | string;
}

export interface DiagramEnv {
  /** dev：问题以占位块显示；否则抛错 */
  dev: boolean;
  /** features.diagramDownload */
  downloads?: boolean;
  /** Astro site；用于“在 draw.io 中打开”的绝对 URL */
  siteUrl?: string;
  /** Astro base，默认 `/` */
  base?: string;
  /** 项目根，默认 process.cwd() */
  root?: string;
  /** manifest 路径（测试用） */
  manifestPath?: string;
  /** 站点或文章语言（默认 'zh-CN'） */
  lang?: string;
}

export interface RenderedDiagram {
  html: string;
  ok: boolean;
  style: DiagramStyle;
  /** 源文件绝对路径 */
  source: string;
  /** 下载 URL（不含站点前缀以外的 origin） */
  downloadHref?: string;
  /** 问题描述（ok=false 时） */
  problem?: string;
}

export const DIAGRAM_EXT = /\.(excalidraw|drawio)$/i;

/** 识别图表引用：路径部分以 .excalidraw / .drawio 结尾（可带 #fragment / ?query），且不是外部 URL。 */
export function isDiagramUrl(url: string): boolean {
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) return false;
  return DIAGRAM_EXT.test(url.split(/[?#]/)[0]!);
}

/** 拆出路径与 #page=。 */
export function parseDiagramUrl(url: string): { path: string; page?: string } {
  const hashAt = url.indexOf('#');
  const head = hashAt >= 0 ? url.slice(0, hashAt) : url;
  const hash = hashAt >= 0 ? url.slice(hashAt + 1) : '';
  const path = safeDecode(head.split('?')[0]!);
  const page = new URLSearchParams(hash).get('page') ?? undefined;
  return { path, page: page === '' ? undefined : page };
}

const safeDecode = (s: string) => {
  try {
    return decodeURI(s);
  } catch {
    return s;
  }
};

export const styleOf = (file: string): DiagramStyle =>
  /\.excalidraw$/i.test(file) ? 'hand' : 'clean';
const stemOf = (file: string) => basename(file).replace(DIAGRAM_EXT, '');
const toPosix = (p: string) => p.split(sep).join('/');

/** 与 skills/wisp-diagram/scripts/build.ts 的 outputPathFor 一致（不引入导出器依赖）。 */
export function outputPathFor(file: string, pageIndex = 0): string {
  return toPosix(
    join(
      dirname(file),
      pageIndex === 0
        ? `${stemOf(file)}.wisp.svg`
        : `${stemOf(file)}.page-${pageIndex + 1}.wisp.svg`,
    ),
  );
}

export { postId };

export const POSTS_DIR = 'src/content/posts';
export const SHARED_DIR = 'src/content/shared/diagrams';

/**
 * 源文件 → 下载路径中 `/diagrams/` 之后的部分。
 * - src/content/shared/diagrams/<f>          → shared/<f>
 * - src/content/posts/<dir>/diagrams/<f>     → <postId(dir/index.mdx)>/<f>
 * - src/content/posts/diagrams/<f>（单文件文章共用）→ <f>
 * 其他位置返回 undefined（不提供下载）。
 */
export function downloadKeyFor(absSource: string, root = REPO_ROOT): string | undefined {
  const rel = toPosix(relative(root, absSource));
  const file = basename(rel);
  if (rel === `${SHARED_DIR}/${file}`) return `shared/${file}`;
  const prefix = `${POSTS_DIR}/`;
  if (!rel.startsWith(prefix)) return undefined;
  const inner = rel.slice(prefix.length);
  const m = /^(?:(.+)\/)?diagrams\/([^/]+)$/.exec(inner);
  if (!m) return undefined;
  if (!m[1]) return file;
  return `${postId(`${m[1]}/index.mdx`)}/${file}`;
}

/** 下载路径的反向映射（dev 中间件用）。返回源文件绝对路径；不合法或不是图表源文件时返回 undefined。 */
export function sourceForDownloadKey(key: string, root = REPO_ROOT): string | undefined {
  const parts = key.split('/');
  if (!parts.length || parts.some((p) => !p || p === '.' || p === '..' || p.includes('\\')))
    return undefined;
  const file = parts.at(-1)!;
  if (!DIAGRAM_EXT.test(file)) return undefined;
  const dir = parts.slice(0, -1).join('/');
  const rel =
    dir === 'shared'
      ? `${SHARED_DIR}/${file}`
      : dir === ''
        ? `${POSTS_DIR}/diagrams/${file}`
        : `${POSTS_DIR}/${dir}/diagrams/${file}`;
  return toPosix(join(root, rel));
}

export const CONTENT_TYPES: Record<string, string> = {
  '.excalidraw': 'application/json; charset=utf-8',
  '.drawio': 'application/xml; charset=utf-8',
};
export const contentTypeFor = (file: string) =>
  CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';

const KIND_NAME: Record<DiagramStyle, string> = { hand: 'Excalidraw', clean: 'draw.io' };

const escAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- manifest（只读子集；写入由 skill 的 Python CLI 负责，格式见 wisp_diagram_lib/manifest.py） ----
/**
 * 项目根：默认取 process.cwd()（astro dev/build 都在项目根运行）。
 * 不用 import.meta.url：本模块会被打进 SSR 产物，那里的 URL 指向 dist 内的 chunk。
 * integration 通过 remark 选项传入 Astro 的 root。
 */
export const REPO_ROOT = process.cwd();
export const MANIFEST_FILE = 'diagrams.manifest.json';
const manifestPathFor = (root: string) => join(root, MANIFEST_FILE);
export const SCAN_PATTERNS = [
  'src/content/**/diagrams/*.excalidraw',
  'src/content/**/diagrams/*.drawio',
];

export interface ManifestEntry {
  source: string;
  style: DiagramStyle;
  /** 以下字段由 Python CLI 写入，页面渲染不读取 */
  exporter?: string;
  embedFonts?: boolean;
  outputs: Record<string, string>;
  pages?: string[];
}
export interface Manifest {
  version: 1;
  generator: string;
  entries: Record<string, ManifestEntry>;
}

/** 与 wisp_diagram_lib/manifest.py 的 content_hash 相同：统一换行后 sha256。 */
export function contentHash(data: string | Buffer): string {
  const text = typeof data === 'string' ? data : data.toString('utf8');
  return `sha256-${createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex')}`;
}

export function loadManifest(path = manifestPathFor(REPO_ROOT)): Manifest {
  if (!existsSync(path)) return { version: 1, generator: '', entries: {} };
  const m = JSON.parse(readFileSync(path, 'utf8')) as Manifest;
  m.entries ??= {};
  return m;
}

/** 与 wisp_diagram_lib/manifest.py 的扫描规则相同。 */
export function scanSources(root = REPO_ROOT): string[] {
  const set = new Set<string>();
  for (const p of SCAN_PATTERNS) for (const f of globSync(p, { cwd: root })) set.add(toPosix(f));
  return [...set].sort();
}

/**
 * 源文件与产物的哈希校验；返回问题描述，一致时返回 undefined。
 * 不检查生成器版本（那是 `pnpm diagram check` 的职责，页面渲染只关心产物是否对应源文件）。
 */
export function manifestProblem(rel: string, m: Manifest, root = REPO_ROOT): string | undefined {
  const e = m.entries[rel];
  if (!e) return '尚未构建（manifest 中没有记录）';
  if (contentHash(readFileSync(join(root, rel))) !== e.source) return '源文件已修改，产物过期';
  for (const [out, h] of Object.entries(e.outputs)) {
    const abs = join(root, out);
    if (!existsSync(abs)) return `缺少产物 ${out}`;
    if (contentHash(readFileSync(abs)) !== h) return `产物 ${out} 被手动修改（哈希不一致）`;
  }
  return undefined;
}

// ---- manifest（按 mtime 缓存） ----
let manifestCache: { path: string; mtime: number; m: Manifest } | undefined;
function manifestAt(path: string): Manifest {
  const mtime = existsSync(path) ? statSync(path).mtimeMs : -1;
  if (manifestCache && manifestCache.path === path && manifestCache.mtime === mtime)
    return manifestCache.m;
  const m = loadManifest(path);
  manifestCache = { path, mtime, m };
  return m;
}

class DiagramProblem extends Error {}

function selectPage(pages: string[], page: string | number | undefined): number {
  if (page === undefined || page === '') return 0;
  const s = String(page);
  const named = pages.indexOf(s);
  if (named >= 0) return named;
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    if (n >= 1 && n <= pages.length) return n - 1;
  }
  throw new DiagramProblem(
    `找不到页面 "${s}"（可用：${pages.map((p, i) => `${i + 1}=${p}`).join('，')}）`,
  );
}

/**
 * 处理 SVG 文本：id 加后缀、引用同步改写、alt 写入 <title>、去掉根元素 width/height。
 * 返回新 SVG 与自然宽度（viewBox 宽，用于 CSS 的 --wd-w）。
 */
export function prepareSvg(
  svg: string,
  opts: { suffix: string; alt?: string; fallbackTitleId: string },
): { svg: string; width?: number } {
  let out = svg.replace(/^﻿?\s*(<\?xml[^>]*\?>\s*)?(<!DOCTYPE[^>]*>\s*)?/i, '').trim();
  const rootMatch = /<svg\b[^>]*>/i.exec(out);
  if (!rootMatch) throw new DiagramProblem('产物不是 SVG');

  // 1. 清理旧版 drawio-cli 产物遗留的 `.MathJax svg{shape-rendering:crispEdges}`（避免关闭矢量抗锯齿并污染全页）
  out = out
    .replace(/\.MathJax[\w-]*\s+svg\s*\{\s*shape-rendering\s*:\s*crispEdges\s*;?\s*\}/gi, '')
    .replace(/<style\b[^>]*>\s*<\/style>/gi, '')
    .replace(/<defs\b[^>]*>\s*<\/defs>/gi, '');

  // 2. 根元素：去掉 width/height，记录自然宽度
  const rootMatch2 = /<svg\b[^>]*>/i.exec(out)!;
  let rootTag = rootMatch2[0];
  const vb = /\sviewBox="([^"]+)"/
    .exec(rootTag)?.[1]
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const wAttr = /\swidth="([\d.]+)(?:px)?"/.exec(rootTag)?.[1];
  const width = vb && vb.length === 4 && vb[2]! > 0 ? vb[2] : wAttr ? Number(wAttr) : undefined;
  rootTag = rootTag.replace(/\s(?:width|height)="[^"]*"/g, '');
  out =
    out.slice(0, rootMatch2.index) + rootTag + out.slice(rootMatch2.index + rootMatch2[0].length);

  // 3. id 唯一化（只匹配独立的 id 属性，不碰 data-cell-id 等）
  const ids = new Map<string, string>();
  for (const m of out.matchAll(/\sid="([^"]+)"/g)) ids.set(m[1]!, `${m[1]}-${opts.suffix}`);
  if (ids.size) {
    const map = (id: string) => ids.get(id) ?? id;
    out = out
      .replace(/(\sid=")([^"]+)(")/g, (_, a: string, id: string, b: string) => a + map(id) + b)
      .replace(
        /url\((['"]?)#([^'")]+)\1\)/g,
        (_, q: string, id: string) => `url(${q}#${map(id)}${q})`,
      )
      .replace(
        /(\s(?:xlink:)?href=")#([^"]+)(")/g,
        (_, a: string, id: string, b: string) => `${a}#${map(id)}${b}`,
      )
      .replace(
        /(\saria-(?:labelledby|describedby)=")([^"]*)(")/g,
        (_, a: string, v: string, b: string) =>
          a + v.split(/\s+/).filter(Boolean).map(map).join(' ') + b,
      );
  }

  // 3. alt → <title>
  const alt = opts.alt?.trim();
  if (alt) {
    const t = /<title\b([^>]*)>[\s\S]*?<\/title>/i.exec(out);
    if (t) {
      out =
        out.slice(0, t.index) +
        `<title${t[1]}>${escText(alt)}</title>` +
        out.slice(t.index + t[0].length);
    } else {
      const start = /<svg\b[^>]*>/i.exec(out)!;
      const id = opts.fallbackTitleId;
      let tag = start[0];
      tag = /\saria-labelledby="/.test(tag)
        ? tag.replace(/(\saria-labelledby=")/, `$1${id} `)
        : tag.replace(/>$/, ` aria-labelledby="${id}">`);
      if (!/\srole="/.test(tag)) tag = tag.replace(/>$/, ' role="img">');
      out =
        out.slice(0, start.index) +
        tag +
        `<title id="${id}">${escText(alt)}</title>` +
        out.slice(start.index + start[0].length);
    }
  }
  return { svg: out, width };
}

const PLACEHOLDER_HOSTS = /(^|\.)(example\.(com|org|net)|localhost)$/i;

/** “在 draw.io 中打开”需要公开可访问的绝对 URL；Astro site 未配置或仍是示例域名时不显示。 */
function absoluteUrl(siteUrl: string | undefined, href: string): string | undefined {
  if (!siteUrl) return undefined;
  try {
    const u = new URL(href, siteUrl);
    if (PLACEHOLDER_HOSTS.test(u.hostname)) return undefined;
    return u.href;
  } catch {
    return undefined;
  }
}

function joinBase(base: string | undefined, path: string): string {
  const b = (base ?? '/').replace(/\/+$/, '');
  return `${b}/${path.replace(/^\/+/, '')}`;
}

/** 下载 URL：`<base>/diagrams/<key>`，每段做 URL 编码。 */
export function downloadHrefFor(key: string, base?: string): string {
  return joinBase(base, `diagrams/${key.split('/').map(encodeURIComponent).join('/')}`);
}

function resolveSource(ref: DiagramRef, root: string): { abs: string; page?: string } {
  const { path, page } = parseDiagramUrl(ref.src);
  let abs: string;
  if (isAbsolute(path) && existsSync(path)) abs = path;
  else if (path.startsWith('/'))
    abs = join(root, path); // 项目根相对：/src/content/...
  else if (path.startsWith('@/')) abs = join(root, 'src', path.slice(2));
  else {
    if (!ref.from) throw new DiagramProblem(`相对路径 ${ref.src} 需要知道引用它的文件（from）`);
    abs = resolve(dirname(ref.from), path);
  }
  return { abs, page: ref.page !== undefined ? String(ref.page) : page };
}

function placeholder(rel: string, problem: string, zh: boolean): string {
  return zh
    ? `<div class="wisp-diagram-missing" role="note">` +
        `<strong>图表未就绪</strong><span>${escText(rel)}：${escText(problem)}</span>` +
        `<span>运行 <code>pnpm diagram build</code> 生成 .wisp.svg 并更新 manifest。</span></div>`
    : `<div class="wisp-diagram-missing" role="note">` +
        `<strong>Diagram not ready</strong><span>${escText(rel)}: ${escText(problem)}</span>` +
        `<span>Run <code>pnpm diagram build</code> to generate .wisp.svg and update the manifest.</span></div>`;
}

export function renderDiagram(ref: DiagramRef, env: DiagramEnv, lang = 'zh-CN'): RenderedDiagram {
  const zh = /^zh\b/i.test(env.lang ?? lang);
  const root = env.root ?? REPO_ROOT;
  const manifestPath = env.manifestPath ?? manifestPathFor(root);
  let abs = '';
  let style: DiagramStyle = 'clean';
  try {
    const r = resolveSource(ref, root);
    abs = r.abs;
    style = styleOf(abs);
    const rel = toPosix(relative(root, abs));
    if (!existsSync(abs)) throw new DiagramProblem('源文件不存在');
    const manifest = manifestAt(manifestPath);
    const problem = manifestProblem(rel, manifest, root);
    if (problem) throw new DiagramProblem(problem);
    const entry = manifest.entries[rel]!;
    const pages = entry.pages?.length ? entry.pages : [''];
    if (style === 'hand' && r.page) throw new DiagramProblem('#page= 只适用于 draw.io 文件');
    const pageIndex = style === 'clean' ? selectPage(pages, r.page) : 0;
    const svgPath = outputPathFor(abs, pageIndex);
    if (!existsSync(svgPath))
      throw new DiagramProblem(`缺少产物 ${toPosix(relative(root, svgPath))}`);

    const stem = stemOf(abs).replace(/[^\w-]+/g, '-');
    const { svg, width } = prepareSvg(readFileSync(svgPath, 'utf8'), {
      suffix: String(ref.seq),
      alt: ref.alt,
      fallbackTitleId: `${stem}-title-${ref.seq}`,
    });

    const key = downloadKeyFor(abs, root);
    const showDl = (env.downloads ?? true) && ref.download !== false && key !== undefined;
    const href = key !== undefined ? downloadHrefFor(key, env.base) : undefined;
    const file = basename(abs);
    const links: string[] = [];
    // 动作（桌面端悬浮在图右上角，窄屏与触屏回退在题注下方）：可见文字取短词（「源文件」/「Source」「draw.io」），完整含义放在 aria-label / title
    if (showDl && href) {
      const dlLabel = zh
        ? `下载源文件 ${file}（${KIND_NAME[style]}）`
        : `Download source ${file} (${KIND_NAME[style]})`;
      const dlTitle = zh ? `下载源文件 ${file}` : `Download source ${file}`;
      const dlText = zh ? '源文件' : 'Source';
      links.push(
        `<a class="wisp-diagram-dl" href="${escAttr(href)}" download="${escAttr(file)}" type="${escAttr(contentTypeFor(file).split(';')[0]!)}"` +
          ` aria-label="${escAttr(dlLabel)}" title="${escAttr(dlTitle)}">${iconSvg('file-down')}${dlText}</a>`,
      );
      const absHref = style === 'clean' ? absoluteUrl(env.siteUrl, href) : undefined;
      if (absHref) {
        const openLabel = zh ? '在 draw.io 中打开（新窗口）' : 'Open in draw.io (new tab)';
        const openTitle = zh ? '在 draw.io 中打开' : 'Open in draw.io';
        links.push(
          `<a class="wisp-diagram-open" href="${escAttr(`https://app.diagrams.net/#U${encodeURIComponent(absHref)}`)}"` +
            ` target="_blank" rel="noopener noreferrer" aria-label="${escAttr(openLabel)}" title="${escAttr(openTitle)}">${iconSvg('external-link')}draw.io</a>`,
        );
      }
    }

    const seq = String(ref.seq);
    const caption = ref.caption?.trim();
    const actions = links.length ? `<span class="wisp-fig-actions">${links.join('')}</span>` : '';
    // figure 内同时存在动作链接时，显式绑定 aria-labelledby 只取题注文字作为可访问名称
    const captionId = caption && actions ? `${stem}-caption-${seq}` : '';
    const figCaption = caption
      ? `<figcaption${captionId ? ` id="${escAttr(captionId)}"` : ''}>${figureCaptionHtml(caption)}</figcaption>`
      : '';
    const cls = ['wisp-figure', 'wisp-diagram', ...(ref.wide ? ['wisp-wide'] : [])].join(' ');
    const pageAttr =
      style === 'clean' && pages[pageIndex] ? ` data-page="${escAttr(pages[pageIndex]!)}"` : '';
    const labelledBy = captionId ? ` aria-labelledby="${escAttr(captionId)}"` : '';
    const figStyle = width ? ` style="--wd-w:${Math.round(width * 100) / 100}px"` : '';
    const fallbackLabel = zh ? '图表' : 'Diagram';
    const html =
      `<figure class="${cls}" data-style="${style}"${pageAttr}${labelledBy}${figStyle}>` +
      // 窄屏下可横向滚动：容器需可键盘聚焦（WCAG scrollable-region-focusable）
      `<div class="wisp-diagram-body" tabindex="0" role="group" aria-label="${escAttr(ref.alt?.trim() || fallbackLabel)}">${svg}</div>` +
      figCaption +
      actions +
      `</figure>`;
    return { html, ok: true, style, source: abs, downloadHref: showDl ? href : undefined };
  } catch (err) {
    if (!(err instanceof DiagramProblem)) throw err;
    const rel = abs ? toPosix(relative(root, abs)) : ref.src;
    const where = ref.from ? ` (${toPosix(relative(root, ref.from))})` : '';
    const msg = `[wisp] 图表 ${rel}${where}：${err.message}。运行 \`pnpm diagram build\` 后重试。`;
    if (!env.dev) throw new Error(msg, { cause: err });
    console.warn(msg);
    return {
      html: placeholder(rel, err.message, zh),
      ok: false,
      style,
      source: abs,
      problem: err.message,
    };
  }
}
