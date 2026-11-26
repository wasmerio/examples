export function getReadingTimeMinutes(text: string, wordsPerMinute = 200): number {
	const words = text.trim().split(/\s+/).filter(Boolean);
	return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}
