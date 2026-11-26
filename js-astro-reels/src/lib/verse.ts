export interface VerseLine { text: string; indent: boolean }

const INDENT = /^[\u2003\u2002 \t]{2,}/;

/**
 * A poem's Markdown body as stanzas of lines. Lines that start with two or more em spaces (the
 * importer's couplet marker) or spaces are indented; blank lines separate stanzas.
 */
export function stanzas(body: string): VerseLine[][] {
  const result: VerseLine[][] = [];
  let current: VerseLine[] = [];
  for (const raw of body.split('\n')) {
    if (!raw.trim()) {
      if (current.length) result.push(current);
      current = [];
      continue;
    }
    current.push({ text: raw.trim(), indent: INDENT.test(raw) });
  }
  if (current.length) result.push(current);
  return result;
}

/** A piece's first line, the way a poem without a title is known; nothing for an empty body. */
export function firstLine(body: string): string | undefined {
  return stanzas(body)[0]?.[0]?.text;
}
