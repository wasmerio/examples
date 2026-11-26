/** Caption line prefixes for `Table: …` / `表格：…` lines above GFM tables. */
export const TABLE_CAPTION_PREFIXES = [
  '表格：',
  '表：',
  'Table: ',
  'Table：',
  'Caption: ',
  'Caption：',
] as const;

/** Parse a caption line; returns caption text or undefined when not a caption line. */
export function parseTableCaptionLine(text: string): string | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  for (const prefix of TABLE_CAPTION_PREFIXES) {
    if (trimmed.startsWith(prefix)) {
      const caption = trimmed.slice(prefix.length).trim();
      return caption || undefined;
    }
  }
  return undefined;
}
