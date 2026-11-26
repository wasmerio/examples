const FENCED_CODE_BLOCK = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;
const INLINE_CODE = /`[^`\n]+`/g;

const MATH_PATTERNS: RegExp[] = [
	/(^|[^\\])\$\$[\s\S]+?(^|[^\\])\$\$/m, // $$...$$
	/(^|[^\\])\\\([\s\S]+?\\\)/m, // \(...\)
	/(^|[^\\])\\\[[\s\S]+?\\\]/m, // \[...\]
	/\\begin\{(?:equation|align|gather|multline|matrix|pmatrix|bmatrix|cases|split)\*?\}/,
	/(^|[^\\$])\$(?!\$)(?:\\.|[^$\n])+\$(?!\$)/m, // $...$
];

export function hasMathInMarkdown(markdown: string | undefined): boolean {
	if (!markdown) {
		return false;
	}

	// Remove obvious code regions to reduce false positives from examples.
	const stripped = markdown
		.replace(FENCED_CODE_BLOCK, "")
		.replace(INLINE_CODE, "");

	return MATH_PATTERNS.some((pattern) => pattern.test(stripped));
}
