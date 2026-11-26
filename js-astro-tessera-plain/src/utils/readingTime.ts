const wordsPerMinute = 220;

export function readingTime(text: string): number {
  const words = text.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function readingTimeLabel(text: string): string {
  return `${readingTime(text)} min read`;
}
