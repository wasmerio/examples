/**
 * Estimate reading time for a text body.
 * Supports mixed English and Chinese content.
 * English: ~200 WPM, Chinese: ~400 CPM.
 */
export function estimateReadingTime(body: string): number {
  const plain = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/#+\s/g, '')
    .replace(/[*_~]+/g, '')
    .replace(/---/g, '')
    .replace(/>/g, '')
    .replace(/\|/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();

  const chineseChars = (plain.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishText = plain.replace(/[\u4e00-\u9fff]/g, ' ');
  const englishWords = englishText.split(/\s+/).filter(w => w.length > 0).length;

  const englishMinutes = englishWords / 200;
  const chineseMinutes = chineseChars / 400;

  return Math.max(1, Math.ceil(englishMinutes + chineseMinutes));
}
