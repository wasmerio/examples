import { type CollectionEntry, getCollection } from 'astro:content';
import type { GalleryCategorySlug } from '~/content.config';

export interface GalleryCategoryMeta {
	slug: GalleryCategorySlug;
	title: string;
	subtitle: string;
	description: string;
}

export type GalleryEntry = CollectionEntry<'gallery'>;

export const galleryCategories: GalleryCategoryMeta[] = [
	{
		slug: 'illustration',
		title: 'Illustration',
		subtitle: 'Art samples',
		description: 'A sample wall for commissions, character sheets, and spotlight interactions that can be customized per entry.',
	},
	{
		slug: 'life',
		title: 'Life',
		subtitle: 'Everyday moments',
		description: 'A flexible category for notes, snapshots, and soft editorial storytelling anchored by markdown content.',
	},
	{
		slug: 'view',
		title: 'View',
		subtitle: 'Places and light',
		description: 'A lightweight gallery lane for scenery, travel references, and visual pauses between longer posts.',
	},
];

const collator = new Intl.Collator(['en', 'zh-Hans-u-co-pinyin', 'zh'], {
	numeric: true,
	sensitivity: 'base',
});

const bySortOrder = (left: GalleryEntry, right: GalleryEntry) =>
	left.data.sortOrder - right.data.sortOrder ||
	collator.compare(left.data.title, right.data.title);

export const getGalleryCategory = (slug: string) =>
	galleryCategories.find((category) => category.slug === slug);

export const getGalleryEntries = async () => {
	const entries = await getCollection('gallery');
	return [...entries].sort(bySortOrder);
};

export const getGalleryItemsByCategory = async (
	slug: GalleryCategorySlug | string,
) => {
	const entries = await getGalleryEntries();
	return entries.filter((entry) => entry.data.category === slug);
};

export const getGalleryItem = async (
	category: GalleryCategorySlug | string,
	slug: string,
) => {
	const entries = await getGalleryItemsByCategory(category);
	return entries.find((entry) => entry.data.slug === slug);
};