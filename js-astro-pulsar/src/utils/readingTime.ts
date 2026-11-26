const WORDS_PER_MINUTE = 200;

/** Estimated reading time in whole minutes (minimum 1). */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
