export interface LocationMapConfig {
  latitude: number;
  longitude: number;
  label: string;
  shortLabel: string;
  zoom: number;
  districtZoom: number;
}

export interface TileCoordinate {
  x: number;
  y: number;
  zoom: number;
}

const TILE_SIZE = 256;
const MAX_MERCATOR_LATITUDE = 85.0511287798066;
const MAX_TILE_ZOOM = 19;
// Zachowują dotychczasowe kadrowanie osadzonej mapy przy zoomie 15.
const EMBED_VIEWPORT = { width: 466, height: 363 };

export function validateLocationMap(location: LocationMapConfig): LocationMapConfig {
  if (!Number.isFinite(location.latitude) || location.latitude < -90 || location.latitude > 90) {
    throw new RangeError('Map latitude must be a finite number from -90 to 90.');
  }
  if (!Number.isFinite(location.longitude) || location.longitude < -180 || location.longitude > 180) {
    throw new RangeError('Map longitude must be a finite number from -180 to 180.');
  }
  if (!location.label.trim() || !location.shortLabel.trim()) {
    throw new TypeError('Map labels must not be empty.');
  }
  validateZoom(location.zoom);
  validateZoom(location.districtZoom);
  return location;
}

function validateZoom(zoom: number): void {
  if (!Number.isInteger(zoom) || zoom < 0 || zoom > MAX_TILE_ZOOM) {
    throw new RangeError(`Map zoom must be an integer from 0 to ${MAX_TILE_ZOOM}.`);
  }
}

function projectToWorld(latitude: number, longitude: number, zoom: number): { x: number; y: number; scale: number } {
  validateZoom(zoom);
  const scale = TILE_SIZE * 2 ** zoom;
  const clampedLatitude = Math.max(-MAX_MERCATOR_LATITUDE, Math.min(MAX_MERCATOR_LATITUDE, latitude));
  const latitudeRadians = (clampedLatitude * Math.PI) / 180;

  return {
    x: ((longitude + 180) / 360) * scale,
    y: ((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) * scale,
    scale,
  };
}

function unprojectWorldY(y: number, scale: number): number {
  return (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / scale))) * 180) / Math.PI;
}

function roundedPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

export function getMapTileLayout(location: LocationMapConfig, zoom: number) {
  validateLocationMap(location);
  const world = projectToWorld(location.latitude, location.longitude, zoom);
  const centerX = Math.floor(world.x / TILE_SIZE);
  const centerY = Math.floor(world.y / TILE_SIZE);
  const tileCount = 2 ** zoom;
  const tiles: TileCoordinate[] = [];

  for (let row = -1; row <= 1; row += 1) {
    for (let column = -1; column <= 1; column += 1) {
      tiles.push({
        x: ((centerX + column) % tileCount + tileCount) % tileCount,
        y: Math.max(0, Math.min(tileCount - 1, centerY + row)),
        zoom,
      });
    }
  }

  return {
    tiles,
    marker: {
      x: roundedPercent(((world.x / TILE_SIZE - (centerX - 1)) / 3) * 100),
      y: roundedPercent(((world.y / TILE_SIZE - (centerY - 1)) / 3) * 100),
    },
  };
}

export function getMapTitle(location: LocationMapConfig, district = false): string {
  validateLocationMap(location);
  const area = district ? 'dzielnicy' : 'miasta';
  return `Mapa OpenStreetMap, ${location.label}, przybliżenie ${area}`;
}

export function getOpenStreetMapEmbedUrl(location: LocationMapConfig, zoom = location.zoom): string {
  validateLocationMap(location);
  const world = projectToWorld(location.latitude, location.longitude, zoom);
  const west = ((world.x - EMBED_VIEWPORT.width / 2) / world.scale) * 360 - 180;
  const east = ((world.x + EMBED_VIEWPORT.width / 2) / world.scale) * 360 - 180;
  const south = unprojectWorldY(world.y + EMBED_VIEWPORT.height / 2, world.scale);
  const north = unprojectWorldY(world.y - EMBED_VIEWPORT.height / 2, world.scale);
  const parameters = new URLSearchParams({
    bbox: [west, south, east, north].map((coordinate) => coordinate.toFixed(5)).join(','),
    layer: 'mapnik',
    marker: `${location.latitude},${location.longitude}`,
  });

  return `https://www.openstreetmap.org/export/embed.html?${parameters}`;
}

export function getOpenStreetMapUrl(location: LocationMapConfig, zoom = location.zoom): string {
  validateLocationMap(location);
  validateZoom(zoom);
  return `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=${zoom}/${location.latitude}/${location.longitude}`;
}

export function getGoogleMapsUrl(location: LocationMapConfig): string {
  validateLocationMap(location);
  const parameters = new URLSearchParams({ api: '1', query: `${location.latitude},${location.longitude}` });
  return `https://www.google.com/maps/search/?${parameters}`;
}
