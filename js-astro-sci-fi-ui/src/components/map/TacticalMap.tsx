import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { DEFAULT_MAP_CITIES, type MapCityPreset } from "../../lib/map-cities";

export { DEFAULT_MAP_CITIES, type MapCityPreset };

export type MapViewModePreset = {
  id: string;
  label: string;
  /** Short hint under the control row */
  hint?: string;
  tiles: string[];
  attribution: string;
  /** Native max zoom for this tileset (OpenTopoMap stops at 17) */
  maxzoom?: number;
};

function buildRasterStyle(mode: MapViewModePreset): StyleSpecification {
  const max = mode.maxzoom ?? 19;
  return {
    version: 8,
    sources: {
      basemap: {
        type: "raster",
        tiles: mode.tiles,
        tileSize: 256,
        attribution: mode.attribution,
        maxzoom: max,
      },
    },
    layers: [{ id: "basemap", type: "raster", source: "basemap", minzoom: 0, maxzoom: max }],
  };
}

/** Raster basemap options (third-party tiles — check each provider’s terms for production). */
export const DEFAULT_MAP_VIEW_MODES: MapViewModePreset[] = [
  {
    id: "osm",
    label: "Standard",
    hint: "OpenStreetMap default style",
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: "carto-dark",
    label: "Tactical dark",
    hint: "Carto Dark Matter — high contrast",
    tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "carto-light",
    label: "Briefing light",
    hint: "Carto Positron — minimal light",
    tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "carto-voyager",
    label: "Voyager",
    hint: "Carto Voyager — balanced color",
    tiles: ["https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "opentopomap",
    label: "Topo",
    hint: "OpenTopoMap — terrain & contours",
    tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
    maxzoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
];

function nearestCityId(center: [number, number], cities: MapCityPreset[]): string {
  let best = cities[0]!;
  let bestD = Infinity;
  for (const c of cities) {
    const d = (c.center[0] - center[0]) ** 2 + (c.center[1] - center[1]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best.id;
}

function resolveViewMode(
  id: string | undefined,
  modes: MapViewModePreset[],
): MapViewModePreset {
  if (id && modes.some((m) => m.id === id)) {
    return modes.find((m) => m.id === id)!;
  }
  return modes[0]!;
}

export type TacticalMapProps = {
  /** [lng, lat] — used on first map mount */
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
  cities?: MapCityPreset[];
  /** If set, selects matching preset when map loads */
  initialCityId?: string;
  viewModes?: MapViewModePreset[];
  /** Basemap style when the map first loads */
  initialViewModeId?: string;
};

export default function TacticalMap({
  initialCenter = [13.405, 52.52],
  initialZoom = 11,
  className = "",
  cities = DEFAULT_MAP_CITIES,
  initialCityId,
  viewModes = DEFAULT_MAP_VIEW_MODES,
  initialViewModeId,
}: TacticalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [lng, setLng] = useState(initialCenter[0]);
  const [lat, setLat] = useState(initialCenter[1]);
  const [zoom, setZoom] = useState(initialZoom);
  const [activeCityId, setActiveCityId] = useState(() => {
    if (initialCityId && cities.some((c) => c.id === initialCityId)) return initialCityId;
    return nearestCityId(initialCenter, cities);
  });
  const [activeViewModeId, setActiveViewModeId] = useState(() =>
    resolveViewMode(initialViewModeId, viewModes).id,
  );

  const syncFromMap = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const c = map.getCenter();
    setLng(Number(c.lng.toFixed(5)));
    setLat(Number(c.lat.toFixed(5)));
    setZoom(Number(map.getZoom().toFixed(2)));
  }, []);

  const applyViewMode = useCallback(
    (id: string) => {
      if (id === activeViewModeId) return;
      const mode = resolveViewMode(id, viewModes);
      const map = mapRef.current;
      if (!map) return;
      setActiveViewModeId(mode.id);
      map.setStyle(buildRasterStyle(mode));
      map.once("style.load", () => {
        const maxZ = mode.maxzoom ?? 19;
        map.setMaxZoom(maxZ);
        if (map.getZoom() > maxZ) map.setZoom(maxZ);
        map.resize();
        syncFromMap();
      });
    },
    [activeViewModeId, viewModes, syncFromMap],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const start = cities.find((c) => c.id === activeCityId);
    const center = start?.center ?? initialCenter;
    const z = start?.zoom ?? initialZoom;
    const initialStyleMode = resolveViewMode(activeViewModeId, viewModes);
    const initialStyle = buildRasterStyle(initialStyleMode);

    const map = new maplibregl.Map({
      container: el,
      style: initialStyle,
      center,
      zoom: z,
      attributionControl: true,
      maxZoom: initialStyleMode.maxzoom ?? 19,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    mapRef.current = map;

    map.on("moveend", syncFromMap);
    map.on("load", syncFromMap);

    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyToCity = useCallback(
    (city: MapCityPreset) => {
      const map = mapRef.current;
      if (!map) return;
      setActiveCityId(city.id);
      map.flyTo({
        center: city.center,
        zoom: city.zoom ?? 11,
        duration: 1600,
        essential: true,
      });
    },
    [],
  );

  const activeMode = resolveViewMode(activeViewModeId, viewModes);

  return (
    <div className={`flex min-h-0 w-full flex-col gap-4 ${className}`}>
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">Basemap</p>
        <div className="flex flex-wrap gap-2">
          {viewModes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => applyViewMode(m.id)}
              data-sf-sound-hover
              data-sf-sound-click
              className={`rounded-sm border px-2.5 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] transition ${
                m.id === activeViewModeId
                  ? "border-[var(--sf-border-strong)] bg-[color-mix(in_oklab,var(--sf-color-secondary)_16%,transparent)] text-sf-text shadow-[0_0_14px_var(--sf-glow-secondary)]"
                  : "border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-elevated)_88%,transparent)] text-sf-muted hover:border-[var(--sf-border-strong)] hover:text-sf-text"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {activeMode.hint ? (
          <p className="text-[0.65rem] leading-relaxed text-[var(--sf-text-dim)]">{activeMode.hint}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">Waypoint presets</p>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => flyToCity(c)}
              data-sf-sound-hover
              data-sf-sound-click
              className={`rounded-sm border px-2.5 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] transition ${
                c.id === activeCityId
                  ? "border-[var(--sf-border-strong)] bg-[color-mix(in_oklab,var(--sf-color-primary)_14%,transparent)] text-sf-text shadow-[0_0_14px_var(--sf-glow-primary)]"
                  : "border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-elevated)_88%,transparent)] text-sf-muted hover:border-[var(--sf-border-strong)] hover:text-sf-text"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="min-h-[min(70vh,560px)] w-full min-w-0 flex-1 overflow-hidden rounded-sm border border-[var(--sf-border-subtle)] shadow-[0_0_24px_var(--sf-glow-primary)]"
        role="region"
        aria-label="Tactical map"
      />
      <div className="grid gap-3 font-sf-mono text-xs text-[var(--sf-text-muted)] sm:grid-cols-3">
        <div>
          <span className="text-[var(--sf-text-dim)]">LON </span>
          <span className="text-[var(--sf-color-primary)]">{lng}</span>
        </div>
        <div>
          <span className="text-[var(--sf-text-dim)]">LAT </span>
          <span className="text-[var(--sf-color-primary)]">{lat}</span>
        </div>
        <div>
          <span className="text-[var(--sf-text-dim)]">ZOOM </span>
          <span className="text-[var(--sf-color-secondary)]">{zoom}</span>
        </div>
      </div>
    </div>
  );
}
