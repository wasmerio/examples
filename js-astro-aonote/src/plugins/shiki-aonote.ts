import type { ShikiTransformer } from 'shiki';
import { parseHlLinesMeta } from '../utils/hl-lines';

function parseMeta(raw?: string): { title?: string; hlLines: number[] } {
  if (!raw) return { hlLines: [] };
  const titleMatch = /title=(?:"([^"]*)"|'([^']*)'|([^\s]+))/.exec(raw);
  const title = titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3];
  return { title, hlLines: parseHlLinesMeta(raw) };
}

function addClassProp(
  existing: string | string[] | undefined,
  name: string,
): string | string[] {
  const base = Array.isArray(existing)
    ? existing.map(String)
    : typeof existing === 'string'
      ? existing.split(/\s+/).filter(Boolean)
      : [];
  if (base.includes(name)) return existing ?? base;
  return [...base, name];
}

/** Shiki transformer: code titles and hl_lines (Aonote CSS). */
export function transformerAonote(): ShikiTransformer {
  let hlLines: number[] = [];
  let codeTitle: string | undefined;

  return {
    name: 'aonote',
    preprocess(_code, options) {
      hlLines = [];
      codeTitle = undefined;
      const raw =
        typeof options.meta === 'object' && options.meta && '__raw' in options.meta
          ? String((options.meta as { __raw?: string }).__raw ?? '')
          : typeof options.meta === 'string'
            ? options.meta
            : '';
      const parsed = parseMeta(raw);
      codeTitle = parsed.title;
      hlLines = parsed.hlLines;
    },
    pre(pre) {
      if (codeTitle) {
        pre.properties['data-title'] = codeTitle;
      }
      if (hlLines.length) {
        pre.properties['data-hl-lines'] = hlLines.join(' ');
      }
    },
    line(line, lineNo) {
      if (typeof lineNo === 'number' && hlLines.includes(lineNo)) {
        line.properties.class = addClassProp(
          line.properties.class as string | string[] | undefined,
          'hll',
        );
      }

    },
  };
}
