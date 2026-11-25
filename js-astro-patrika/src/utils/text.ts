export function getSeason(date: Date): 'Spring' | 'Summer' | 'Monsoon' | 'Winter' {
  const m = date.getMonth() + 1;
  if (m === 3 || m === 4) return 'Spring';
  if (m === 5 || m === 6) return 'Summer';
  if (m >= 7 && m <= 9)  return 'Monsoon';
  return 'Winter';
}

export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export function formatSeriesTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function formatDate(date?: Date): string {
  if (!date) return '';
  return date.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

export function formatMonthYear(date?: Date): string {
  if (!date) return '';
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    year:  'numeric',
  })
}

/**
 * Convert a string into a URL-safe slug.
 *
 * Example:
 * "Tokyo Beyond Places" -> "tokyo-beyond-places"
 */

export function slugify(str?: string): string {
  if (!str) return "";

  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Humanize a string (convert slugs/underscores to readable text)
 */
export function humanize(content: string): string {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/[-\s]+/g, ' ')
    .replace(/^[a-z]/, (m) => m.toUpperCase());
}


/**
 * Title case a string (capitalize first letter of each word)
 */
export function titleify(content: string): string {
  const humanized = humanize(content);
  return humanized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ── Reading time ───────────────────────────────────────────────────────────────

export interface ReadingTime {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

export function calculateReadingTime(
  content: string,
  wordsPerMinute = 200
): ReadingTime {
  if (!content || typeof content !== "string") {
    return { text: "1 min read", minutes: 1, time: 60000, words: 0 };
  }

  const plainText = content
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "$1")
    .replace(/`{1,3}.*?`{1,3}/gs, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  const words     = plainText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const minutes   = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return {
    text: `${minutes} min read`,
    minutes,
    time: minutes * 60 * 1000,
    words: wordCount,
  };
}