// Turns an author slug like "john-doe" into "John Doe"
export const formattedAuthorName = (author: string) =>
	author
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')

// Returns a subtitle with the author link and date, or just the date if no author.
export const postSubtitle = (author: any, dateStr: any) => {
	const date = dateStr
		? new Date(dateStr).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		: ''

	if (author && date) {
		const formattedName = formattedAuthorName(author)
		return `<a href="/blog/author/${author}" class="transition-colors delay-300">${formattedName}, ${date}</a>`
	}

	if (author) {
		const formattedName = formattedAuthorName(author)
		return `<a href="/blog/author/${author}" class="transition-colors delay-300">${formattedName}</a>`
	}

	if (date) return date

	return ''
}
