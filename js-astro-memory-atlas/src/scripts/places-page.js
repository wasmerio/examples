import { mountMemoryAtlas, memoriesFromIndex } from '../../places/map.js';
import { createMemoryImageViewer } from './memory-image-viewer.js';
import { atlasData } from '../../places/data.js';
import { text } from '../i18n/copy.js';
import { activeLanguage } from '../lib/i18n.js';

const root = document.querySelector('[data-memory-atlas]');
const imageViewer = createMemoryImageViewer();
const siteBase = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

try {
  const data = {
    ...atlasData,
    baseUrl: siteBase,
    memories: memoriesFromIndex(document, atlasData.memories),
  };
  const destroy = mountMemoryAtlas(root, data, window.L, {
    openPhoto: (memories, index, opener) => imageViewer.open(memories, index, opener),
  });
  window.addEventListener('pagehide', destroy, { once: true });
} catch {
  document.querySelector('#atlas-viewer').textContent = text('places.unavailable', activeLanguage());
}
