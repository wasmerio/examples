export function truncateTitle(title: string): string {
	return title.length > 50 ? `${title.slice(0, 50)}...` : title;
}