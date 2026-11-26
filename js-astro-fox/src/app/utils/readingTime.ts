export default function readingTime(content: string): string {
  const wordsPerMinute = 200;

  const words = content.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return minutes === 1 ? "1 min read" : `${minutes} mins read`;
}
