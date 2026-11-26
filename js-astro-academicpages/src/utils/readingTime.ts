/**
 * Calculates estimated reading time in minutes based on text content
 */
export function calculateReadingTime(
  content?: string,
  wordsPerMinute = 200
): string {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return `${minutes} min read`;
}
