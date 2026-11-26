import { memories } from '../data/memories.js';
import { resolveAlbumImage } from '../lib/image-assets.js';
import { initializeHomeExperience } from './anniversary.js';
import { createMemoryImageViewer } from './memory-image-viewer.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const catalog = memories.map((memory) => {
  const image = resolveAlbumImage(memory.image);
  return { ...memory, src: image.src, msrc: image.src, width: image.width, height: image.height };
});
const imageViewer = createMemoryImageViewer();

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-story-memory]');
  if (!opener) return;
  const index = catalog.findIndex((memory) => memory.id === opener.dataset.storyMemory);
  if (index >= 0) imageViewer.open(catalog, index, opener);
});

initializeHomeExperience({ memories: catalog, reduceMotion });
