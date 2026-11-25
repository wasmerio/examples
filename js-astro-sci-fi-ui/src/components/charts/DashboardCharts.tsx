import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

import { DEFAULT_MAP_CITIES, getCityById, type MapCityPreset } from "../../lib/map-cities";

type HourlyBlock = {
  time?: string[];
  temperature_2m?: number[];
  /** Mean sea-level pressure (hPa) — Open-Meteo hourly. */
  pressure_msl?: number[];
  /** Relative humidity at 2 m (%) — Open-Meteo hourly. */
  relative_humidity_2m?: number[];
};

type HourlyPayload = {
  hourly?: HourlyBlock;
  _source?: string;
  _fetchedAt?: string;
  _cityId?: string;
  _cityName?: string;
};

type Snapshot = {
  meta: { title: string; generated: string; notes?: string };
  openMeteo: HourlyPayload;
  moduleIngestTb: { labels: string[]; values: number[] };
  sparklineTemps: number[];
};

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hourlyToData(h: HourlyPayload): uPlot.AlignedData | null {
  const times = h.hourly?.time;
  const temps = h.hourly?.temperature_2m;
  if (!times?.length || !temps?.length || times.length !== temps.length) return null;
  const x = times.map((t) => new Date(t).getTime() / 1000);
  return [x, temps];
}

/** Daily max °C per calendar day + recent-hour slice for spark — same location as the line chart. */
function deriveBarsAndSparkFromHourly(h: HourlyPayload): {
  barLabels: string[];
  barValues: number[];
  spark: number[];
} | null {
  const times = h.hourly?.time;
  const temps = h.hourly?.temperature_2m;
  if (!times?.length || !temps?.length || times.length !== temps.length) return null;

  const dayToMax = new Map<string, number>();
  for (let i = 0; i < times.length; i++) {
    const dayKey = times[i]!.slice(0, 10);
    const v = temps[i]!;
    const prev = dayToMax.get(dayKey);
    if (prev === undefined || v > prev) dayToMax.set(dayKey, v);
  }
  const sortedDays = [...dayToMax.keys()].sort();
  if (sortedDays.length === 0) return null;

  const fmt = (isoDay: string) => {
    const [y, m, d] = isoDay.split("-").map(Number);
    if (!y || !m || !d) return isoDay;
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const barLabels = sortedDays.map((k) => fmt(k));
  const barValues = sortedDays.map((k) => dayToMax.get(k)!);

  const sparkLen = Math.min(48, Math.max(12, temps.length));
  const spark = temps.slice(-sparkLen);

  return { barLabels, barValues, spark };
}

type OverviewStats = {
  maxC: number | null;
  minC: number | null;
  meanC: number | null;
  /** Latest hour in the series (most recent forecast step). */
  pressureMslHpa: number | null;
  rhPct: number | null;
};

function overviewStatsFromHourly(h: HourlyPayload): OverviewStats {
  const temps = h.hourly?.temperature_2m;
  const p = h.hourly?.pressure_msl;
  const rh = h.hourly?.relative_humidity_2m;
  if (!temps?.length) {
    return { maxC: null, minC: null, meanC: null, pressureMslHpa: null, rhPct: null };
  }
  const maxC = Math.max(...temps);
  const minC = Math.min(...temps);
  const meanC = temps.reduce((a, b) => a + b, 0) / temps.length;
  const n = temps.length;
  const pressureMslHpa =
    p && p.length === n && Number.isFinite(p[n - 1]!) ? (p[n - 1] as number) : null;
  const rhPct =
    rh && rh.length === n && Number.isFinite(rh[n - 1]!) ? (rh[n - 1] as number) : null;
  return { maxC, minC, meanC, pressureMslHpa, rhPct };
}

function getDashboardSeries(hourly: HourlyPayload, snap: Snapshot) {
  const derived = deriveBarsAndSparkFromHourly(hourly);
  const useDerived = derived !== null && hourly._source === "open-meteo";
  return {
    lineData: hourlyToData(hourly),
    barLabels: useDerived ? derived!.barLabels : snap.moduleIngestTb.labels,
    barValues: useDerived ? derived!.barValues : snap.moduleIngestTb.values,
    sparkTemps: useDerived ? derived!.spark : snap.sparklineTemps,
    barValueLabel: useDerived ? "°C max" : "TB",
  };
}

type DashboardChartsProps = {
  snapshot: Snapshot;
  /** Preset id from `DEFAULT_MAP_CITIES` (same list as the map page). */
  initialCityId?: string;
};

function openMeteoDirectUrl(city: MapCityPreset): string {
  const [lng, lat] = city.center;
  const hourly = [
    "temperature_2m",
    "pressure_msl",
    "relative_humidity_2m",
  ].join(",");
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=${hourly}&past_days=4&forecast_days=2`;
}

function OverviewStatCard({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-deep)_72%,transparent)] px-3 py-2.5">
      <p className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--sf-text-dim)]">{label}</p>
      <p className="mt-1 font-sf-mono text-lg leading-none tracking-wide text-[var(--sf-text-primary)]">
        {value}
        {unit ? (
          <span className="ml-1 text-[0.7rem] font-normal tracking-normal text-[var(--sf-text-muted)]">{unit}</span>
        ) : null}
      </p>
      {hint ? <p className="mt-1 text-[0.58rem] leading-snug text-[var(--sf-text-dim)]">{hint}</p> : null}
    </div>
  );
}

const uLegendSlotClass =
  "min-h-[2.25rem] border-t border-[var(--sf-border-subtle)]/60 pt-2 font-sf-mono text-[0.68rem] leading-snug text-[var(--sf-text-muted)] [&_.u-legend]:block [&_.u-legend]:w-full [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_th]:pr-2 [&_th]:align-middle [&_th]:font-normal [&_th]:text-[var(--sf-text-dim)] [&_td]:align-middle [&_td]:text-[var(--sf-text-primary)]";

export default function DashboardCharts({ snapshot, initialCityId = "berlin" }: DashboardChartsProps) {
  const lineRoot = useRef<HTMLDivElement>(null);
  const barRoot = useRef<HTMLDivElement>(null);
  const sparkRoot = useRef<HTMLDivElement>(null);
  const lineLegendSlotRef = useRef<HTMLDivElement>(null);
  const barLegendSlotRef = useRef<HTMLDivElement>(null);
  const sparkLegendSlotRef = useRef<HTMLDivElement>(null);
  const plots = useRef<uPlot[]>([]);
  const [status, setStatus] = useState("Loading…");
  const [hourlyPayload, setHourlyPayload] = useState<HourlyPayload>(snapshot.openMeteo);
  const [selectedCityId, setSelectedCityId] = useState(() => {
    if (initialCityId && DEFAULT_MAP_CITIES.some((c) => c.id === initialCityId)) return initialCityId;
    return DEFAULT_MAP_CITIES[0]!.id;
  });

  const selectedCity = useMemo(() => getCityById(selectedCityId), [selectedCityId]);

  const chartCityLabel = useMemo(() => {
    if (hourlyPayload._source === "snapshot-fallback") return "Sample (offline)";
    return hourlyPayload._cityName ?? selectedCity.name;
  }, [hourlyPayload._source, hourlyPayload._cityName, selectedCity.name]);

  const dashSeries = useMemo(() => getDashboardSeries(hourlyPayload, snapshot), [hourlyPayload, snapshot]);
  const chartsTiedToLocation = dashSeries.barValueLabel === "°C max";

  /** Ignore stale responses when the user switches city quickly. */
  const meteoFetchSeq = useRef(0);
  const meteoAbortRef = useRef<AbortController | null>(null);

  const destroyPlots = useCallback(() => {
    plots.current.forEach((p) => p.destroy());
    plots.current = [];
    lineLegendSlotRef.current?.replaceChildren();
    barLegendSlotRef.current?.replaceChildren();
    sparkLegendSlotRef.current?.replaceChildren();
  }, []);

  const buildPlots = useCallback(
    (hourly: HourlyPayload) => {
      destroyPlots();
      const stroke = cssVar("--sf-color-primary", "#22d3ee");
      const stroke2 = cssVar("--sf-color-secondary", "#d946ef");
      const grid = cssVar("--sf-border-subtle", "#334155");
      const text = cssVar("--sf-text-muted", "#94a3b8");

      const { lineData, barLabels, barValues, sparkTemps, barValueLabel } = getDashboardSeries(hourly, snapshot);

      if (lineRoot.current && lineData) {
        const w = lineRoot.current.clientWidth || 400;
        const p = new uPlot(
          {
            width: Math.max(280, w),
            height: 200,
            scales: { x: { time: true }, y: { auto: true } },
            axes: [
              { stroke: text, grid: { stroke: grid } },
              { stroke: text, grid: { stroke: grid }, side: 3 },
            ],
            series: [{}, { stroke, width: 2, label: "°C" }],
            cursor: { drag: { x: true, y: false } },
            legend: {
              show: true,
              live: true,
              mount: (_u, el) => {
                lineLegendSlotRef.current?.appendChild(el);
              },
            },
          },
          lineData,
          lineRoot.current,
        );
        plots.current.push(p);
      }

      const xs = barLabels.map((_, i) => i);
      if (barRoot.current && barValues.length > 0) {
        const w = barRoot.current.clientWidth || 400;
        const p = new uPlot(
          {
            width: Math.max(280, w),
            height: 200,
            scales: {
              x: { distr: 2, time: false },
              y: { range: (u, min, max) => [0, (max ?? 1) * 1.15] },
            },
            axes: [
              {
                stroke: text,
                grid: { stroke: grid },
                values: (u, ticks) => ticks.map((i) => barLabels[i] ?? String(i)),
              },
              { stroke: text, grid: { stroke: grid }, side: 3 },
            ],
            series: [
              {},
              {
                label: barValueLabel,
                stroke: stroke2,
                fill: stroke2,
                paths: uPlot.paths.bars({ align: 0, gap: 4 }),
                width: 1,
              },
            ],
            legend: {
              show: true,
              live: true,
              mount: (_u, el) => {
                barLegendSlotRef.current?.appendChild(el);
              },
            },
            cursor: { show: true },
          },
          [xs, barValues],
          barRoot.current,
        );
        plots.current.push(p);
      }

      const sx = sparkTemps.map((_, i) => i);
      if (sparkRoot.current && sparkTemps.length > 0) {
        const w = sparkRoot.current.clientWidth || 200;
        const p = new uPlot(
          {
            width: Math.max(160, w),
            height: 72,
            scales: { x: { time: false }, y: { auto: true } },
            axes: [{ show: false }, { show: false }],
            series: [{}, { stroke, width: 2, points: { show: false }, label: "°C" }],
            cursor: { show: false },
            legend: {
              show: true,
              live: true,
              mount: (_u, el) => {
                sparkLegendSlotRef.current?.appendChild(el);
              },
            },
          },
          [sx, sparkTemps],
          sparkRoot.current,
        );
        plots.current.push(p);
      }
    },
    [destroyPlots, snapshot],
  );

  useEffect(() => {
    buildPlots(hourlyPayload);
    return destroyPlots;
  }, [hourlyPayload, buildPlots, destroyPlots]);

  useEffect(() => {
    const s = getDashboardSeries(hourlyPayload, snapshot);
    const attach = (el: HTMLDivElement | null, height: number, plotIndex: number) => {
      if (!el) return null;
      const ro = new ResizeObserver(() => {
        const p = plots.current[plotIndex];
        if (p) p.setSize({ width: Math.max(120, el.clientWidth), height });
      });
      ro.observe(el);
      return ro;
    };
    let idx = 0;
    const obs: (ResizeObserver | null)[] = [];
    if (lineRoot.current && s.lineData) {
      obs.push(attach(lineRoot.current, 200, idx));
      idx += 1;
    }
    if (barRoot.current && s.barValues.length > 0) {
      obs.push(attach(barRoot.current, 200, idx));
      idx += 1;
    }
    if (sparkRoot.current && s.sparkTemps.length > 0) {
      obs.push(attach(sparkRoot.current, 72, idx));
    }
    return () => obs.forEach((o) => o?.disconnect());
  }, [hourlyPayload, snapshot]);

  const fetchMeteoForCity = useCallback(
    async (city: MapCityPreset) => {
      meteoAbortRef.current?.abort();
      const ac = new AbortController();
      meteoAbortRef.current = ac;

      const seq = ++meteoFetchSeq.current;
      setStatus("Fetching…");

      try {
        const r = await fetch(openMeteoDirectUrl(city), { signal: ac.signal });
        if (!r.ok) throw new Error(String(r.status));
        const j2 = (await r.json()) as HourlyPayload;
        if (!j2.hourly?.temperature_2m?.length) throw new Error("empty");
        if (seq !== meteoFetchSeq.current) return;
        setHourlyPayload({
          ...j2,
          _source: "open-meteo",
          _fetchedAt: new Date().toISOString(),
          _cityId: city.id,
          _cityName: city.name,
        });
        setStatus(`Open-Meteo · ${city.name} · ${new Date().toISOString()}`);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (seq !== meteoFetchSeq.current) return;
        setHourlyPayload({
          ...snapshot.openMeteo,
          _source: "snapshot-fallback",
          _fetchedAt: snapshot.meta.generated,
        });
        setStatus("Snapshot only (network or API error) — hourly series is sample data");
      }
    },
    [snapshot.meta.generated, snapshot.openMeteo],
  );

  useEffect(() => {
    void fetchMeteoForCity(selectedCity);
  }, [selectedCity, fetchMeteoForCity]);

  useEffect(() => {
    return () => {
      meteoAbortRef.current?.abort();
    };
  }, []);

  const last = hourlyPayload.hourly?.temperature_2m?.at(-1);
  const mean =
    hourlyPayload.hourly?.temperature_2m?.reduce((a, b) => a + b, 0) /
    (hourlyPayload.hourly?.temperature_2m?.length || 1);

  const overview = useMemo(() => overviewStatsFromHourly(hourlyPayload), [hourlyPayload]);
  const fmt1 = (n: number | null) => (n != null && Number.isFinite(n) ? n.toFixed(1) : "—");
  const fmt0 = (n: number | null) => (n != null && Number.isFinite(n) ? String(Math.round(n)) : "—");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex min-h-[2.75rem] flex-wrap items-end justify-between gap-3">
        <p
          className="max-w-xl min-w-0 flex-1 text-xs uppercase leading-snug tracking-[0.16em] text-[var(--sf-text-dim)]"
          aria-live="polite"
          aria-atomic="true"
        >
          {status}
        </p>
        <button
          type="button"
          className="rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-deep)_70%,transparent)] px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)] transition hover:border-[var(--sf-border-strong)] hover:text-[var(--sf-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sf-color-primary)]"
          data-sf-sound-click
          data-sf-sound-hover
          onClick={() => void fetchMeteoForCity(selectedCity)}
        >
          Refresh data
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">Weather preset</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="City for hourly temperature">
          {DEFAULT_MAP_CITIES.map((c) => (
            <button
              key={c.id}
              type="button"
              data-sf-sound-hover
              data-sf-sound-click
              onClick={() => setSelectedCityId(c.id)}
              className={`rounded-sm border px-2.5 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sf-color-primary)] ${
                c.id === selectedCityId
                  ? "border-[var(--sf-border-strong)] bg-[color-mix(in_oklab,var(--sf-color-primary)_14%,transparent)] text-[var(--sf-text-primary)] shadow-[0_0_14px_var(--sf-glow-primary)]"
                  : "border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-elevated)_88%,transparent)] text-[var(--sf-text-muted)] hover:border-[var(--sf-border-strong)] hover:text-[var(--sf-text-primary)]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <section
        className="rounded-sm border border-[var(--sf-border-subtle)]/80 bg-[color-mix(in_oklab,var(--sf-bg-elevated)_55%,transparent)] p-3 sm:p-4"
        aria-label="Weather overview for the loaded hourly window"
      >
        <p className="mb-3 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">
          Station readouts · {chartCityLabel}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <OverviewStatCard label="High (window)" value={fmt1(overview.maxC)} unit="°C" />
          <OverviewStatCard label="Low (window)" value={fmt1(overview.minC)} unit="°C" />
          <OverviewStatCard label="Mean temp" value={fmt1(overview.meanC)} unit="°C" />
          <OverviewStatCard
            label="Pressure (MSL)"
            value={fmt0(overview.pressureMslHpa)}
            unit="hPa"
            hint="Latest hour in series"
          />
          <OverviewStatCard
            label="Rel. humidity"
            value={fmt0(overview.rhPct)}
            unit="%"
            hint="Latest hour in series"
          />
        </div>
        {hourlyPayload._source !== "open-meteo" ? (
          <p className="mt-2 text-[0.6rem] leading-relaxed text-[var(--sf-text-dim)]">
            Snapshot mode: only temperature is in the committed file — pressure and humidity show “—” until a live Open-Meteo response
            loads.
          </p>
        ) : (
          <p className="mt-2 text-[0.6rem] leading-relaxed text-[var(--sf-text-dim)]">
            Min / max / mean use every hourly step in the chart window. Pressure and humidity use the most recent timestep in that
            window.
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">
            {chartCityLabel} hourly · air temperature (2 m)
          </p>
          <div className="rounded-sm border border-[var(--sf-border-subtle)]/70 bg-[color-mix(in_oklab,var(--sf-bg-deep)_55%,transparent)] p-2 sm:p-3">
            <div ref={lineRoot} className="h-[200px] w-full min-w-0 shrink-0" />
            <div ref={lineLegendSlotRef} className={uLegendSlotClass} aria-label="Line chart legend" />
          </div>
          <p className="font-sf-mono text-xs text-[var(--sf-text-dim)]" aria-live="polite">
            Last: {last != null ? `${last.toFixed(1)} °C` : "—"} · mean:{" "}
            {Number.isFinite(mean) ? `${mean.toFixed(1)} °C` : "—"}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">
            {chartsTiedToLocation
              ? `${chartCityLabel} · daily high (°C per day)`
              : "Module ingest (example TB / week) · snapshot"}
          </p>
          <div className="rounded-sm border border-[var(--sf-border-subtle)]/70 bg-[color-mix(in_oklab,var(--sf-bg-deep)_55%,transparent)] p-2 sm:p-3">
            <div ref={barRoot} className="h-[200px] w-full min-w-0 shrink-0" />
            <div ref={barLegendSlotRef} className={uLegendSlotClass} aria-label="Bar chart legend" />
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--sf-text-dim)]">
            {chartsTiedToLocation
              ? "Daily maximum °C per calendar day from the same hourly series as the line chart."
              : snapshot.meta.notes}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-deep)_70%,transparent)] p-3">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">
            {chartsTiedToLocation ? "Recent hours · °C" : "Sparkline · snapshot"}
          </p>
          <div className="mt-2 rounded-sm border border-[var(--sf-border-subtle)]/50 bg-[color-mix(in_oklab,var(--sf-bg-deep)_45%,transparent)] p-2">
            <div ref={sparkRoot} className="h-[72px] w-full shrink-0" />
            <div ref={sparkLegendSlotRef} className={`${uLegendSlotClass} mt-2 min-h-[1.75rem]`} aria-label="Spark legend" />
          </div>
        </div>
        <div className="rounded-sm border border-[var(--sf-border-subtle)] bg-[color-mix(in_oklab,var(--sf-bg-deep)_70%,transparent)] p-3 sm:col-span-2">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sf-text-muted)]">Snapshot meta</p>
          <p className="mt-2 font-sf-mono text-sm text-[var(--sf-text-primary)]">{snapshot.meta.title}</p>
          <p className="mt-1 text-xs text-[var(--sf-text-dim)]">Generated: {snapshot.meta.generated}</p>
        </div>
      </div>
    </div>
  );
}
