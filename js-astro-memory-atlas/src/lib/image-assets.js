import { memories } from '../data/memories.js';
import { getAlbumImageOptions, isVectorImage, selectImagePreset } from './image-presets.js';

const demoImages = import.meta.glob('../assets/images/demo/*.{svg,jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' });

export { getAlbumImageOptions, isVectorImage, selectImagePreset };

export function resolveAlbumImage(source) {
  const filename = String(source).match(/(?:^|\/)(?:demo\/)?([^/]+\.(?:svg|jpe?g|png|webp|avif))$/i)?.[1];
  const image = demoImages[`../assets/images/demo/${filename}`];
  if (!image) throw new Error(`Sample illustration was not found: ${source}`);
  return image;
}

export function getTimelineImages() {
  return [...new Set(memories.map(({ image }) => image))].map((path) => ({ path, image: resolveAlbumImage(path) }));
}
