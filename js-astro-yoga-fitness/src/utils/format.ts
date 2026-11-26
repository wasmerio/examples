const WORDS_PER_MINUTE = 220;

/** Estimated reading time in minutes for a Markdown body. */
export function readingTime(text = ''): number {
  const words = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~\-[\]()!]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/** Splits a title on `\n` so components can insert `<br>` elements. */
export function lines(text: string): string[] {
  return text.split('\n');
}

/** Keeps a phone number on one line (non-breaking spaces and hyphens). */
export function phoneText(phone: string): string {
  return phone.replace(/ /g, '\u00a0').replace(/-/g, '\u2011');
}
