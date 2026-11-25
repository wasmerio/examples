/** Shared geographic presets for map fly-to and weather APIs. */

export type MapCityPreset = {
  id: string;
  name: string;
  /** [lng, lat] */
  center: [number, number];
  zoom?: number;
};

export const DEFAULT_MAP_CITIES: MapCityPreset[] = [
  { id: "berlin", name: "Berlin", center: [13.405, 52.52], zoom: 11 },
  { id: "tokyo", name: "Tokyo", center: [139.6917, 35.6895], zoom: 11 },
  { id: "nyc", name: "New York", center: [-74.006, 40.7128], zoom: 11 },
  { id: "london", name: "London", center: [-0.1276, 51.5074], zoom: 11 },
  { id: "paris", name: "Paris", center: [2.3522, 48.8566], zoom: 11 },
  { id: "sydney", name: "Sydney", center: [151.2093, -33.8688], zoom: 11 },
  { id: "cairo", name: "Cairo", center: [31.2357, 30.0444], zoom: 11 },
  { id: "mumbai", name: "Mumbai", center: [72.8777, 19.076], zoom: 11 },
  { id: "sao-paulo", name: "São Paulo", center: [-46.6333, -23.5505], zoom: 11 },
  { id: "mexico-city", name: "Mexico City", center: [-99.1332, 19.4326], zoom: 11 },
  { id: "singapore", name: "Singapore", center: [103.8198, 1.3521], zoom: 12 },
  { id: "cape-town", name: "Cape Town", center: [18.4241, -33.9249], zoom: 11 },
  { id: "nairobi", name: "Nairobi", center: [36.8219, -1.2921], zoom: 11 },
  { id: "vancouver", name: "Vancouver", center: [-123.1207, 49.2827], zoom: 11 },
];

export function getCityById(id: string | undefined): MapCityPreset {
  const found = DEFAULT_MAP_CITIES.find((c) => c.id === id);
  return found ?? DEFAULT_MAP_CITIES[0]!;
}
