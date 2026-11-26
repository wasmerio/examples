import type { Now } from './clock';
import { load, save } from './store';

type WorkerWeather = { city: string; location: string; now: Now };
const fields: (keyof Now)[] = ['icon', 'text', 'temp', 'humidity', 'windDir', 'windScale'];

function valid(weather: WorkerWeather | undefined): weather is WorkerWeather {
  return typeof weather?.city === 'string' && !!weather.city.trim() &&
    typeof weather.location === 'string' && !!weather.location && !!weather.now &&
    fields.every((field) => typeof weather.now[field] === 'string' && !!weather.now[field].trim()) &&
    Number.isFinite(Number(weather.now.temp)) && Number(weather.now.humidity) >= 0 && Number(weather.now.humidity) <= 100;
}

export async function fetchWorkerWeather(endpoint: string, el: HTMLElement): Promise<WorkerWeather> {
  const url = new URL(endpoint, document.baseURI);
  let location = '';
  if ('fixed' in el.dataset) {
    const coords = (el.dataset.fallbackLocation ?? '').split(',');
    const [lon, lat] = coords.map(Number);
    if (coords.length !== 2 || coords.some((s) => !s.trim()) ||
        !Number.isFinite(lon) || Math.abs(lon) > 180 || !Number.isFinite(lat) || Math.abs(lat) > 90) {
      throw new Error('Invalid fixed location');
    }
    const round = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
    location = [round(lon), round(lat)].join(',');
    url.searchParams.set('lon', round(lon));
    url.searchParams.set('lat', round(lat));
  }

  const key = 'clock-weather-worker:' + url.href;
  const cached = load<WorkerWeather>(key);
  if (valid(cached) && (!location || cached.location === location)) return cached;

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Weather unavailable');
  const weather = await response.json() as WorkerWeather;
  if (!valid(weather) || (location && weather.location !== location)) throw new Error('Invalid weather response');
  if (location && weather.city === '未知地区') weather.city = el.dataset.fallbackCity || weather.city;
  const fetchedAt = Number(response.headers.get('X-Weather-Fetched-At')) || Date.now();
  const maxAge = response.headers.get('X-Weather-Cache') === 'STALE' ? 3_600_000 : 600_000;
  const ttl = Math.min(600_000, fetchedAt + maxAge - Date.now());
  if (ttl > 0) save(key, weather, ttl / 86_400_000);
  return weather;
}
