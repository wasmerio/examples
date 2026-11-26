/** A person's initials: the first letters of the first and last words, or the first two letters of one word, upper case. */
export function initials(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	return (words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? "").slice(0, 2)).toUpperCase();
}
