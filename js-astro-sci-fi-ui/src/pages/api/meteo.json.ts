import type { APIRoute } from "astro";
import snapshot from "../../data/dashboard-snapshot.json";
import { getCityById } from "../../lib/map-cities";

function openMeteoUrl(latitude: number, longitude: number): string {
  const hourly = ["temperature_2m", "pressure_msl", "relative_humidity_2m"].join(",");
  return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${hourly}&past_days=4&forecast_days=2`;
}

export const GET: APIRoute = async ({ url }) => {
  const city = getCityById(url.searchParams.get("city") ?? undefined);
  const latitude = city.center[1];
  const longitude = city.center[0];

  try {
    const res = await fetch(openMeteoUrl(latitude, longitude));
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as Record<string, unknown>;
    return new Response(
      JSON.stringify({
        ...data,
        _source: "open-meteo",
        _fetchedAt: new Date().toISOString(),
        _cityId: city.id,
        _cityName: city.name,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({
        ...snapshot.openMeteo,
        hourly: snapshot.openMeteo.hourly,
        _source: "snapshot-fallback",
        _fetchedAt: snapshot.meta.generated,
        _cityId: city.id,
        _cityName: city.name,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }
};
