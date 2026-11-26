/**
 * Markdown preprocessors ported from Runsli/Aonote parser.py
 */

const EMOTICON_EMOJI_MAP: Record<string, string> = {
  '8-)': '😎',
  ':-)': '🙂',
  ':)': '🙂',
  ':-(': '☹️',
  ':(': '☹️',
  ':-*': '😘',
  ':*': '😘',
  ':\\*': '😘',
  ';)': '😉',
};

const EMOTICON_RE =
  /(?<![\w/])(?<emoticon>8-\)|:-\)|:\)|:-\(|:\(|:-\*|:\*|:\\\*|;\))(?![\w])/g;

const FENCE_OPENING_RE = /^(\s*)(`{3,}|~{3,})([^\n]*)$/;

type FenceState = { inFence: boolean; marker: string; len: number };

function trackFenceLine(line: string, state: FenceState): void {
  const match = FENCE_OPENING_RE.exec(line);
  if (!match) return;

  const fence = match[2]!;
  const info = match[3]!.trim();
  const marker = fence[0]!;

  if (!state.inFence) {
    state.inFence = true;
    state.marker = marker;
    state.len = fence.length;
    return;
  }

  if (marker === state.marker && fence.length >= state.len && !info) {
    state.inFence = false;
    state.marker = '';
    state.len = 0;
  }
}

/** True when this line should not be rewritten by admonition preprocessors. */
function shouldSkipAdmonitionRewrite(line: string, insideFence: boolean): boolean {
  return insideFence || FENCE_OPENING_RE.test(line);
}

export function convertColonAdmonitions(markdown: string): string {
  const fenceRe = /^(\s*):{3,}\s*([A-Za-z0-9_-]+)?(?:\s+(.*?))?\s*$/;
  const closeRe = /^\s*:{3,}\s*$/;
  const lines = markdown.split('\n');
  const converted: string[] = [];
  const fence: FenceState = { inFence: false, marker: '', len: 0 };
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    const insideFence = fence.inFence;
    trackFenceLine(line, fence);
    if (shouldSkipAdmonitionRewrite(line, insideFence)) {
      converted.push(line);
      i += 1;
      continue;
    }

    const startMatch = fenceRe.exec(line);
    if (!startMatch || closeRe.test(line)) {
      converted.push(line);
      i += 1;
      continue;
    }

    const indent = startMatch[1] ?? '';
    const kind = (startMatch[2] ?? 'note').toLowerCase();
    const title = startMatch[3]?.trim();
    const body: string[] = [];
    i += 1;

    while (i < lines.length && !closeRe.test(lines[i]!)) {
      body.push(lines[i]!);
      i += 1;
    }

    if (i >= lines.length) {
      converted.push(startMatch[0]!);
      converted.push(...body);
      continue;
    }

    const admonitionTitle = title ? ` "${title}"` : '';
    converted.push(`${indent}!!! ${kind}${admonitionTitle}`);
    if (body.length) {
      for (const bodyLine of body) {
        converted.push(bodyLine.trim() ? `${indent}    ${bodyLine}` : '');
      }
    } else {
      converted.push('');
    }
    i += 1;
  }

  return converted.join('\n') + (markdown.endsWith('\n') ? '\n' : '');
}

export function convertAdmonitionsToDirectives(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];
  const fence: FenceState = { inFence: false, marker: '', len: 0 };
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    const insideFence = fence.inFence;
    trackFenceLine(line, fence);
    if (shouldSkipAdmonitionRewrite(line, insideFence)) {
      out.push(line);
      i += 1;
      continue;
    }

    const match = /^(\s*)!!!\s+([A-Za-z0-9_-]+)(?:\s+"([^"]*)")?\s*$/.exec(line);
    if (!match) {
      out.push(line);
      i += 1;
      continue;
    }

    const indent = match[1] ?? '';
    const kind = match[2]!.toLowerCase();
    const title = match[3];
    const body: string[] = [];
    i += 1;

    while (i < lines.length) {
      const bodyLine = lines[i]!;
      if (bodyLine.trim() === '') {
        body.push('');
        i += 1;
        if (i < lines.length && !/^\s+/.test(lines[i]!) && !lines[i]!.startsWith('!!!')) break;
        continue;
      }
      if (!bodyLine.startsWith(indent + '    ') && !bodyLine.startsWith(indent + '\t')) break;
      body.push(bodyLine.slice(indent.length + 4));
      i += 1;
    }

    const label = title ? `[${title}]` : '';
    out.push(`${indent}:::${kind}${label}`);
    out.push(...body.map((l) => (l ? `${indent}${l}` : '')));
    out.push(`${indent}:::`);
  }

  return out.join('\n') + (markdown.endsWith('\n') ? '\n' : '');
}

export function convertEmoticonShorthands(markdown: string): string {
  const fenceRe = /^\s*(`{3,}|~{3,})/;
  const inlineCodeRe = /(`+)(.*?)(?<!`)\1/g;
  const lines = markdown.split(/\n/);
  let inFence = false;
  let fenceMarker = '';

  const replacePlain = (text: string) =>
    text.replace(EMOTICON_RE, (m) => EMOTICON_EMOJI_MAP[m] ?? m);

  const replaceOutsideInline = (line: string) => {
    const parts: string[] = [];
    let last = 0;
    for (const match of line.matchAll(inlineCodeRe)) {
      const idx = match.index ?? 0;
      parts.push(replacePlain(line.slice(last, idx)));
      parts.push(match[0]);
      last = idx + match[0].length;
    }
    parts.push(replacePlain(line.slice(last)));
    return parts.join('');
  };

  const converted = lines.map((line) => {
    const fenceMatch = fenceRe.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1]![0]!;
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (marker === fenceMarker) {
        inFence = false;
        fenceMarker = '';
      }
      return line;
    }
    return inFence ? line : replaceOutsideInline(line);
  });

  return converted.join('\n');
}

export function normalizeFencedCodeAttributes(markdown: string): string {
  const openingRe = /^(\s*)(`{3,}|~{3,})([^\n]*)$/;
  const hlLinesRe = /hl_lines=(?:"([^"]*)"|'([^']*)'|([^\s}]+))/;

  const expandHlLines = (value: string) => {
    const expanded: string[] = [];
    for (const token of value.split(/[\s,]+/)) {
      if (!token) continue;
      const range = /^(\d+)-(\d+)$/.exec(token);
      if (range) {
        const start = Number(range[1]);
        const end = Number(range[2]);
        const step = start <= end ? 1 : -1;
        for (let n = start; step > 0 ? n <= end : n >= end; n += step) {
          expanded.push(String(n));
        }
      } else if (/^\d+$/.test(token)) {
        expanded.push(token);
      }
    }
    return `hl_lines="${[...new Set(expanded)].join(' ')}"`;
  };

  const lines = markdown.split('\n');
  let inFence = false;
  let fenceMarker = '';
  let fenceLen = 0;

  const out = lines.map((lineBody) => {
    const fenceMatch = openingRe.exec(lineBody);
    if (!fenceMatch) return lineBody;

    const fence = fenceMatch[2]!;
    let info = fenceMatch[3]!.trim();
    const marker = fence[0]!;

    if (!inFence) {
      inFence = true;
      fenceMarker = marker;
      fenceLen = fence.length;
      info = info.replace(hlLinesRe, (_, a, b, c) => expandHlLines(a ?? b ?? c ?? ''));

      // Keep `lang title="..." hl_lines="..."` meta for Astro/Shiki (do not use pymdown attr_list syntax).
      if (info.includes('title=')) {
        return lineBody;
      }
      return lineBody;
    }

    if (marker === fenceMarker && fence.length >= fenceLen && !info) {
      inFence = false;
      fenceMarker = '';
      fenceLen = 0;
    }
    return lineBody;
  });

  return out.join('\n');
}

export function preprocessMarkdown(markdown: string): string {
  let text = markdown;
  text = convertColonAdmonitions(text);
  text = convertAdmonitionsToDirectives(text);
  text = convertEmoticonShorthands(text);
  text = normalizeFencedCodeAttributes(text);
  return text;
}
