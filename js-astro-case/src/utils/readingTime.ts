/**
 * Reading Time Utility
 * 
 * Calculates estimated reading time based on word count for technical content.
 * Uses a conservative reading speed of 200 words per minute, which accounts for
 * the more careful reading typically required for technical and engineering content.
 * 
 * Features:
 * - Removes code blocks before counting (they're processed separately)
 * - Counts actual words (filters empty strings)
 * - Enforces minimum of 1 minute reading time
 * - Provides formatted output for display
 * 
 * Reading Speed:
 * - 200 WPM for technical/engineering content (more careful reading)
 * - Standard reading is typically 200-250 WPM
 * 
 * @module readingTime
 */

/**
 * Average words per minute for technical content
 * 
 * Set to 200 WPM to account for the slower, more careful reading
 * typically required for technical documentation and engineering articles.
 */
const WORDS_PER_MINUTE = 200;

/**
 * Calculates reading time in minutes from text content
 * 
 * Removes code blocks before counting words, as code requires different
 * reading patterns. Counts only non-empty words and rounds up to ensure
 * the estimate is realistic. Enforces a minimum of 1 minute.
 * 
 * @param content - The text content to analyze (markdown or plain text)
 * @returns Estimated reading time in minutes (minimum 1)
 * 
 * @example
 * const minutes = calculateReadingTime("Your article content here...");
 * // returns: 5
 */
export function calculateReadingTime(content: string): number {
  // Remove code blocks (they take longer to read, but we count them separately)
  const textWithoutCode = content.replace(/```[\s\S]*?```/g, '');
  
  // Count words
  const words = textWithoutCode.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Calculate minutes, minimum 1 minute
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  
  return minutes;
}

/**
 * Formats reading time for display
 * 
 * Converts a numeric minute value into a human-readable string
 * suitable for displaying in article headers or card metadata.
 * 
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 * 
 * @example
 * const formatted = formatReadingTime(5);
 * // returns: "5 min read"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

/**
 * Calculates and formats reading time from content in one step
 * 
 * Convenience function that combines calculateReadingTime and formatReadingTime.
 * Useful when you need the formatted output directly without intermediate values.
 * 
 * @param content - The text content to analyze (markdown or plain text)
 * @returns Formatted reading time string (e.g., "5 min read")
 * 
 * @example
 * const readingTime = getReadingTime(article.body);
 * // returns: "5 min read"
 */
export function getReadingTime(content: string): string {
  const minutes = calculateReadingTime(content);
  return formatReadingTime(minutes);
}
