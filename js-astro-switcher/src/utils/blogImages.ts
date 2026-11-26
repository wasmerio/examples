// Import blog images
import image1 from '../assets/blog/1.jpg';
import image2 from '../assets/blog/2.jpg';
import image3 from '../assets/blog/3.jpg';
import image4 from '../assets/blog/4.jpg';
import image5 from '../assets/blog/5.jpg';
import image6 from '../assets/blog/6.jpg';
import type { ImageMetadata } from 'astro';

// Map image filenames to imported images
export const blogImages: Record<string, ImageMetadata> = {
	'1.jpg': image1,
	'2.jpg': image2,
	'3.jpg': image3,
	'4.jpg': image4,
	'5.jpg': image5,
	'6.jpg': image6,
};

// Helper function to get image by filename
export function getBlogImage(filename: string | undefined): ImageMetadata | undefined {
	if (!filename) return undefined;
	return blogImages[filename];
}
