import { BLOG } from "../config";

const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿]/g;
/** Fenced code, inline code and MDX import lines skew the count badly. */
const NOISE = /```[\s\S]*?```|`[^`]*`|^import .*$|^export .*$/gm;

/** Characters per minute for Japanese text, roughly the usual estimate. */
const CJK_PER_MINUTE = 500;

/**
 * Minutes to read a post body.
 *
 * Latin text is counted in words and Japanese in characters, so mixed posts
 * land somewhere sensible instead of being reported as a handful of words.
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;

  const text = body.replace(NOISE, " ");
  const cjkCount = text.match(CJK)?.length ?? 0;
  const words = text
    .replace(CJK, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = words / BLOG.wordsPerMinute + cjkCount / CJK_PER_MINUTE;
  return Math.max(1, Math.round(minutes));
}
