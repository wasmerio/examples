import { describe, expect, it } from 'vitest';
import {
  getGoogleMapsUrl,
  getMapTitle,
  getMapTileLayout,
  getOpenStreetMapEmbedUrl,
  getOpenStreetMapUrl,
  validateLocationMap,
} from './location-map';

const location = {
  latitude: 50.06143,
  longitude: 19.93658,
  label: 'Rynek Główny, Kraków',
  shortLabel: 'Rynek Główny',
  zoom: 15,
  districtZoom: 16,
};

describe('location map configuration', () => {
  it('projects the location into the existing three by three tile frame', () => {
    const city = getMapTileLayout(location, location.zoom);
    const district = getMapTileLayout(location, location.districtZoom);

    expect(city.tiles).toHaveLength(9);
    expect(city.tiles[4]).toEqual({ x: 18198, y: 11104, zoom: 15 });
    expect(city.marker).toEqual({ x: 55.7, y: 46.4 });
    expect(district.tiles[4]).toEqual({ x: 36397, y: 22208, zoom: 16 });
    expect(district.marker).toEqual({ x: 44.8, y: 59.4 });
  });

  it('builds map links and an embed bbox from the configured location', () => {
    expect(getOpenStreetMapUrl(location)).toBe(
      'https://www.openstreetmap.org/?mlat=50.06143&mlon=19.93658#map=15/50.06143/19.93658',
    );
    expect(getOpenStreetMapEmbedUrl(location)).toBe(
      'https://www.openstreetmap.org/export/embed.html?bbox=19.92658%2C50.05643%2C19.94658%2C50.06643&layer=mapnik&marker=50.06143%2C19.93658',
    );
    expect(getGoogleMapsUrl(location)).toBe(
      'https://www.google.com/maps/search/?api=1&query=50.06143%2C19.93658',
    );
    expect(getMapTitle(location)).toBe('Mapa OpenStreetMap, Rynek Główny, Kraków, przybliżenie miasta');
    expect(getMapTitle(location, true)).toBe('Mapa OpenStreetMap, Rynek Główny, Kraków, przybliżenie dzielnicy');
  });

  it('rejects invalid coordinates and zoom levels', () => {
    expect(validateLocationMap(location)).toEqual(location);
    expect(() => validateLocationMap({ ...location, latitude: 91 })).toThrow(/latitude/i);
    expect(() => validateLocationMap({ ...location, longitude: -181 })).toThrow(/longitude/i);
    expect(() => validateLocationMap({ ...location, zoom: 20 })).toThrow(/zoom/i);
    expect(() => validateLocationMap({ ...location, districtZoom: 1.5 })).toThrow(/zoom/i);
  });
});
