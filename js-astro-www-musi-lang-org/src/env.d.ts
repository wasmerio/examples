/// <reference types="astro/client" />

export {};

declare module "*.md" {
	export const attributes: Record<string, string | number>;
	export const html: string;

	const document: {
		attributes: Record<string, string | number>;
		html: string;
	};

	export default document;
}

declare module "*.md?raw" {
	const content: string;
	export default content;
}
