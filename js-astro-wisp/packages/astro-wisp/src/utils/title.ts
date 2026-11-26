/**
 * 文章标题按词与长标识子词断行：
 * - 中文标题在构建期通过 Intl.Segmenter 插入 <wbr>（同时遵守避头尾禁则）
 * - 长英文/代码标识（CamelCase / snake_case / dotted API / 斜杠路径）补充 <wbr>，
 *   让浏览器的自然换行优先在词 boundary / 语义子词 boundary 落行，避免整块提前折行留半行空白
 */
export function escapeHtml(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const NO_BREAK_AFTER = /[\s\p{Ps}\p{Pi}—-]$/u;
const NO_BREAK_BEFORE = /^[\s\p{Pe}\p{Pf}：:；;，,。.！!？?、…—·\-/]/u;
const LONG_IDENT_RE = /[A-Za-z0-9_.]{10,}/g;
const ALNUM_RE = /[A-Za-z0-9]/g;

function countAlnum(s: string): number {
  return s.match(ALNUM_RE)?.length ?? 0;
}

/**
 * Splits a text run into segments separated at safe wrapping boundaries
 * (`/` outside `//`, and internal `_` / `>=3`-letter `.` / CamelCase boundaries
 * inside `[A-Za-z0-9_.]{10,}` identifiers). Joining segments with `<wbr>`
 * never isolates surrounding plain text or punctuation.
 */
export function splitSubwordTokens(raw: string): string[] {
  if (!raw) return [raw];

  const splits = new Set<number>();

  // 1. Safe slash breaks (exclude `//` protocol markers and whitespace/punctuation neighbors)
  for (let i = 1; i < raw.length - 1; i += 1) {
    if (raw[i] !== '/') continue;
    if (raw[i - 1] === '/' || raw[i + 1] === '/') continue;
    if (/\s/.test(raw[i - 1]!)) continue;
    if (NO_BREAK_BEFORE.test(raw[i + 1]!)) continue;
    splits.add(i + 1);
  }

  // 2. Internal subword boundaries inside long identifiers (>= 10 chars, excluding `-`)
  LONG_IDENT_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LONG_IDENT_RE.exec(raw)) !== null) {
    const tok = match[0];
    const base = match.index;
    let segStart = 0;

    for (let j = 1; j < tok.length; j += 1) {
      const prev = tok[j - 1]!;
      const curr = tok[j]!;

      if (prev === '_') {
        if (curr === '_') continue;
        if (countAlnum(tok.slice(segStart, j - 1)) >= 2 && countAlnum(tok.slice(j)) >= 2) {
          splits.add(base + j);
          segStart = j;
        }
        continue;
      }

      if (prev === '.') {
        if (
          /[A-Za-z0-9]{2,}$/.test(tok.slice(segStart, j - 1)) &&
          /^[A-Za-z]{3,}/.test(tok.slice(j))
        ) {
          splits.add(base + j);
          segStart = j;
        }
        continue;
      }

      if (curr === '_' || curr === '.') continue;

      const next = tok[j + 1] ?? '';
      const isCamel =
        (/[a-z0-9]/.test(prev) && /[A-Z]/.test(curr)) ||
        (/[A-Z]/.test(prev) && /[A-Z]/.test(curr) && /[a-z]/.test(next));
      if (!isCamel) continue;

      const tailAlnum = tok.slice(j).match(/^[A-Za-z0-9]+/)?.[0].length ?? 0;
      if (j - segStart >= 2 && tailAlnum >= 2) {
        splits.add(base + j);
        segStart = j;
      }
    }
  }

  if (splits.size === 0) return [raw];

  const ordered = [...splits].sort((a, b) => a - b);
  const out: string[] = [];
  let cursor = 0;
  for (const idx of ordered) {
    if (idx > cursor) out.push(raw.slice(cursor, idx));
    cursor = idx;
  }
  if (cursor < raw.length) out.push(raw.slice(cursor));
  return out;
}

const CJK_ORPHAN_RE =
  /(\p{Script=Han})(?:<wbr>)?(\p{Script=Han}[\u3002\uff0c\uff1b\uff1a\uff01\uff1f\u3001\u2026\u201d\u2019\u300b\u300d\u300f\u3011\u3009\uff09\u3015\u3017]*)$/u;

const segmenterCache = new Map<string, Intl.Segmenter>();

function getSegmenter(lang: string): Intl.Segmenter {
  let segmenter = segmenterCache.get(lang);
  if (!segmenter) {
    segmenter = new Intl.Segmenter(lang, { granularity: 'word' });
    segmenterCache.set(lang, segmenter);
  }
  return segmenter;
}

/**
 * Prevents a single trailing Hanzi character (plus optional closing CJK punctuation)
 * from wrapping alone onto the final line by stripping a preceding `<wbr>` and
 * joining the last two adjacent Hanzi with `\u2060` (WORD JOINER).
 */
export function preventCjkOrphan(html: string): string {
  return html.replace(CJK_ORPHAN_RE, '$1\u2060$2');
}

function formatSegmentHtml(text: string): string {
  return splitSubwordTokens(text).map(escapeHtml).join('<wbr>');
}

/**
 * Escapes HTML and injects `<wbr>` at safe subword boundaries (for lists,
 * cards, prev/next links, TOC headings, and non-zh titles).
 */
export function formatTitleHtml(text: string): string {
  return preventCjkOrphan(formatSegmentHtml(text));
}

export function segmentTitleWords(
  titleText: string,
  lang: string | undefined,
): { html: string; segmented: boolean } {
  const zh = /^zh\b/i.test(lang ?? '');
  if (!zh || typeof Intl.Segmenter !== 'function') {
    return { html: formatTitleHtml(titleText), segmented: false };
  }
  const segmenter = getSegmenter(lang!);
  const parts = [...segmenter.segment(titleText)].map((x) => x.segment).filter(Boolean);
  if (parts.length === 0) {
    return { html: '', segmented: true };
  }
  let html = formatSegmentHtml(parts[0]!);
  for (let i = 1; i < parts.length; i += 1) {
    const prev = parts[i - 1]!;
    const next = parts[i]!;
    const afterDoubleSlash =
      /\/\/$/.test(prev) || (prev === '/' && i >= 2 && (parts[i - 2]?.endsWith('/') ?? false));
    if (!afterDoubleSlash && !NO_BREAK_AFTER.test(prev) && !NO_BREAK_BEFORE.test(next)) {
      html += '<wbr>';
    }
    html += formatSegmentHtml(next);
  }
  return { html: preventCjkOrphan(html), segmented: true };
}
