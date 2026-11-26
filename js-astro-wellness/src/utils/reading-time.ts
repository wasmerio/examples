const WORDS_PER_MINUTE = 200;

/** Rough reading time from raw markdown text, e.g. "4 min read". */
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
