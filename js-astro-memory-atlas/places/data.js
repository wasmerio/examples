import { memories } from '../src/data/memories.js';
import { places } from '../src/data/places.js';

export const atlasData = {
  scenes: [
    { id: 'world', image: 'places/scenes/world.svg', label: { zh: '示例地图', en: 'Sample map' }, viewBox: { width: 1200, height: 720 } },
    { id: 'district', image: 'places/scenes/district.svg', label: { zh: '示例城区', en: 'Sample district' }, viewBox: { width: 900, height: 900 } },
  ],
  places: places.map((place) => ({ ...place, detailSceneId: place.id === 'old-town' ? 'district' : undefined, scenePoints: place.id === 'old-town' ? { district: { x: 0.57, y: 0.39 } } : undefined })),
  memories: memories.map(({ id, placeIds }) => ({ id, placeIds })),
};
