// Pure helpers behind The Cut and the issue numbers. No astro: imports, so
// `node --experimental-strip-types src/lib/cut.check.ts` runs them directly.

export const CUT = '<!-- cut -->';
const WORDS_PER_MINUTE = 230;

/** Words in Markdown source, ignoring markup, link targets, comments and code fences. */
export function countWords(md: string): number {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ') // MDX comments, including {/* cut */}
    .replace(/<[^>]+>/g, ' ') // inline or imported HTML: count the text, not the tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // pictures: alt text is not prose a reader reads
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // keep link text, drop the URL
    .replace(/\[\^[^\]]+\]:?/g, ' '); // footnote markers; lone markup tokens (-, #, |) have no letters and drop below
  // Chinese and Japanese are written without spaces: each character counts as a word and reads
  // faster than one. Korean separates words with spaces and counts like English.
  const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;

  const cjk = text.match(CJK)?.length ?? 0;
  return (
    cjk +
    text
      .replace(CJK, ' ')
      .split(/\s+/)
      .filter((w) => /[\p{L}\p{N}]/u.test(w)).length
  );
}

export interface CutStats {
  members: boolean;
  free: string; // Markdown before the cut (the whole body for a free issue)
  freeWords: number;
  totalWords: number;
  membersWords: number;
  membersMinutes: number;
  freeShare: number; // 0–100, whole percent; 100 for a free issue
}

// A marker counts only on a line of its own, as cutPlugin only takes a root-level block. A marker
// quoted in inline code (`<!-- cut -->`) earlier in the issue is not the cut.
// A marker alone on a line inside a code fence still matches; nothing in the samples does that.
export const CUT_LINE = /^[ \t]*(?:<!-- cut -->|\{\/\* cut \*\/\})[ \t]*$/m;

export function splitAtCut(body: string): CutStats {
  const at = body.search(CUT_LINE);
  const free = at === -1 ? body : body.slice(0, at);
  const totalWords = countWords(body);
  const freeWords = at === -1 ? totalWords : countWords(free);
  const membersWords = totalWords - freeWords;
  return {
    members: at !== -1,
    free,
    freeWords,
    totalWords,
    membersWords,
    membersMinutes: Math.max(1, Math.round(membersWords / WORDS_PER_MINUTE)),
    freeShare: totalWords ? Math.round((freeWords / totalWords) * 100) : 100,
  };
}

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / WORDS_PER_MINUTE));

/** ISO 8601 week label, e.g. 2026.41. UTC, so the label never shifts with the build machine's zone. */
export function isoWeekLabel(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day); // Thursday of this week decides the year
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}.${String(week).padStart(2, '0')}`;
}
