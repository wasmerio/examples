export const siteMeta = {
	name: "Musi",
	title: "The Musi Programming Language",
	bookTitle: "Musi Book",
} as const;

export function pageTitle(title: string) {
	return `${title} | ${siteMeta.title}`;
}
