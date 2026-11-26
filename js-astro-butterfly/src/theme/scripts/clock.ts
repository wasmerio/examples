import { load, save } from './store';
import { useFallbackFont } from './fallback-font';

/**
 * Aside clock + weather (successor of hexo-butterfly-clock).
 * The card is `transition:persist`ed, so this runs once per card element:
 * the clock keeps ticking across navigations.
 *
 * Location = the visitor's own public IP, looked up from their browser, through
 * the providers in `data-ip-lookup` (config `clock.ipLookup`), first hit wins:
 *   amap  → mainland China only, gives a Chinese city name directly
 *   ipwho → worldwide (ipwho.is)          ipsb → worldwide (api.ip.sb)
 * Non-Amap coordinates are named by QWeather GeoAPI (日本·东京). Weather is
 * QWeather "now" by coordinates, which covers the whole world.
 * Cached: location 6 h (`clock-location`), weather `cacheMinutes` (`clock-weather`).
 */

export type Now = { icon: string; text: string; temp: string; humidity: string; windDir: string; windScale: string };
type Place = { city: string; location: string; ipName?: string };
type IpPlace = { country?: string; country_code?: string; region?: string; city?: string };
type Weather = { now: Now };

const WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const pad = (n: number) => String(n).padStart(2, '0');
const TIMEOUT = 4000;

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

const coord = (lon: number, lat: number) => `${lon.toFixed(4)},${lat.toFixed(4)}`;

function chineseName(...names: unknown[]) {
  return names
    .map((name) => (typeof name === 'string' ? name.trim() : ''))
    .find((name) => /\p{Script=Han}/u.test(name) && !/[^\p{Script=Han}\p{N}\p{P}\s]/u.test(name)) ?? '';
}

function placeLabel(country: string, city: string) {
  if (country === '中国') return city || country;
  return [country, city === country ? '' : city].filter(Boolean).join('·');
}

function ipName(place: IpPlace) {
  const code = typeof place.country_code === 'string' ? place.country_code.toUpperCase() : '';
  const country =
    chineseName(place.country) ||
    (code && /^[A-Z]{2}$/.test(code) && typeof Intl.DisplayNames === 'function'
      ? chineseName(new Intl.DisplayNames('zh-CN', { type: 'region', fallback: 'none' }).of(code))
      : '');
  return placeLabel(country, chineseName(place.city, place.region));
}

/** Each provider resolves to a place (city may be empty → named by GeoAPI) or throws. */
const providers: Record<string, (el: HTMLElement) => Promise<Place>> = {
  async amap(el) {
    const d = await getJSON<{ city?: string | []; rectangle?: string | [] }>(
      `https://restapi.amap.com/v3/ip?key=${el.dataset.amapKey}`,
    );
    // non-Chinese IPs come back as empty arrays
    if (typeof d.rectangle !== 'string' || !d.rectangle) throw new Error('amap: not a CN IP');
    const [[x1, y1], [x2, y2]] = d.rectangle.split(';').map((p) => p.split(',').map(Number));
    return { city: chineseName(d.city), ipName: '中国', location: coord((x1 + x2) / 2, (y1 + y2) / 2) };
  },
  async ipwho() {
    const d = await getJSON<IpPlace & { success: boolean; latitude: number; longitude: number }>(
      'https://ipwho.is/?fields=success,latitude,longitude,country,country_code,region,city&lang=zh',
    );
    if (!d.success) throw new Error('ipwho: failed');
    return { city: '', ipName: ipName(d), location: coord(d.longitude, d.latitude) };
  },
  async ipsb() {
    const d = await getJSON<IpPlace & { latitude?: number; longitude?: number }>('https://api.ip.sb/geoip');
    if (d.latitude == null || d.longitude == null) throw new Error('ipsb: no coordinates');
    return { city: '', ipName: ipName(d), location: coord(d.longitude, d.latitude) };
  },
};

/** QWeather GeoAPI: 中国 → 杭州 (adm2), abroad → 日本·东京 (country·adm1). */
async function placeName(el: HTMLElement, location: string): Promise<string> {
  const d = await getJSON<{ code: string; location?: { name: string; adm1: string; adm2: string; country: string }[] }>(
    `https://${el.dataset.geoHost}/v2/city/lookup?location=${location}&key=${el.dataset.qweatherKey}&lang=zh&number=1`,
  );
  const p = d.location?.[0];
  if (d.code !== '200' || !p) throw new Error(`GeoAPI ${d.code}`);
  const country = chineseName(p.country);
  const city = country === '中国' ? chineseName(p.adm2, p.name, p.adm1) : chineseName(p.adm1, p.name, p.adm2);
  return placeLabel(country, city);
}

async function locate(el: HTMLElement): Promise<Place> {
  const cached = load<Place>('clock-location');
  if (cached?.location && chineseName(cached.city)) return cached;
  const fallback: Place = { city: chineseName(el.dataset.fallbackCity), location: el.dataset.fallbackLocation! };
  let place = fallback;
  if (!('fixed' in el.dataset)) {
    for (const name of (el.dataset.ipLookup ?? '').split(',')) {
      try {
        place = await providers[name.trim()](el);
        break;
      } catch {
        /* next provider */
      }
    }
  }
  if (!place.city) {
    try {
      place.city = await placeName(el, place.location);
    } catch {
      // IP lookup can still provide a usable name if GeoAPI fails.
    }
  }
  place.city ||= place.ipName || '未知地区';
  save('clock-location', place, 0.25);
  return place;
}

async function fetchWeather(el: HTMLElement, place: Place): Promise<Weather> {
  const cached = load<Weather & { location: string }>('clock-weather');
  if (cached?.now && cached.location === place.location) return cached;
  const d = await getJSON<{ code: string; now: Now }>(
    `https://${el.dataset.qweatherHost}/v7/weather/now?location=${place.location}&key=${el.dataset.qweatherKey}&lang=zh`,
  );
  if (d.code !== '200' || !d.now) throw new Error(`QWeather ${d.code}`);
  save('clock-weather', { now: d.now, location: place.location }, Number(el.dataset.cacheMinutes || 30) / 1440);
  return d;
}

/** QWeather icon code → [icon variable, colour] (colours from the original plugin). */
function weatherIcon(code: number): [string, string] {
  if (code === 100 || code === 900) return ['sun', '#fdbc2c'];
  if (code === 150) return ['moon', '#f5c451'];
  if (code >= 101 && code <= 103) return ['wx-cloud-sun', code === 101 ? '#fe6976' : '#fe7f5b'];
  if (code >= 151 && code <= 153) return ['wx-cloud-moon', '#8b9cf7'];
  if (code === 104 || (code >= 800 && code <= 807)) return ['wx-cloud', '#6b8cdb'];
  if (code >= 302 && code <= 304) return ['wx-thunder', '#f5b82e'];
  if ([307, 308, 310, 311, 312, 316, 317, 318].includes(code)) return ['wx-showers', '#3b9ae1'];
  if (code >= 300 && code < 400) return ['wx-rain', '#49b1f5'];
  if ((code >= 400 && code < 500) || code === 901) return ['wx-snow', '#8fb6d8'];
  if ([503, 504, 507, 508].includes(code)) return ['wx-wind', '#c2a46e'];
  if (code >= 500 && code < 600) return ['wx-fog', '#97acba'];
  return ['wx-cloud', '#97acba'];
}

function setCity(el: HTMLElement, city: string) {
  useFallbackFont(city); // any city name
  const chip = el.querySelector<HTMLElement>('[data-wx-city]')!;
  chip.querySelector('span')!.textContent = city;
  chip.title = city; // full name when the chip is cut off
}

function renderWeather(el: HTMLElement, w: Weather) {
  const [icon, color] = weatherIcon(Number(w.now.icon));
  const i = el.querySelector<HTMLElement>('[data-wx-icon]')!;
  i.style.setProperty('--wx-icon', `var(--icon-${icon})`);
  i.style.setProperty('--wx-color', color);
  el.querySelector('[data-wx-text]')!.textContent = w.now.text;
  el.querySelector('[data-wx-temp-value]')!.textContent = w.now.temp;
  el.querySelector<HTMLElement>('[data-wx-temp]')!.hidden = false;
  const wind = el.querySelector<HTMLElement>('[data-wx-wind]')!;
  wind.querySelector('span')!.textContent = w.now.windDir;
  wind.title = `${w.now.windDir} ${w.now.windScale}级`;
  wind.hidden = false;
  const hum = el.querySelector<HTMLElement>('[data-wx-humidity]')!;
  hum.querySelector('span')!.textContent = `${w.now.humidity}%`;
  hum.hidden = false;
}

function startClock(el: HTMLElement) {
  const time = el.querySelector<HTMLTimeElement>('[data-clock-time]')!;
  const date = el.querySelector('[data-clock-date]')!;
  const hm = el.querySelector('[data-clock-hm]')!;
  const sec = el.querySelector('[data-clock-sec]')!;
  const ampm = el.querySelector('[data-clock-ampm]')!;
  const tick = () => {
    if (!el.isConnected) return; // card left the page for good (e.g. a page without aside)
    const d = new Date();
    const ymd = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const hms = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    time.dateTime = `${ymd}T${hms}`;
    date.textContent = `${ymd} ${WEEK[d.getDay()]}`;
    hm.textContent = hms.slice(0, 5);
    sec.textContent = hms.slice(5);
    ampm.textContent = d.getHours() < 12 ? 'AM' : 'PM';
    // re-arm on the next whole second so the display never drifts
    setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  };
  tick();
}

export function initClock() {
  const el = document.querySelector<HTMLElement>('[data-clock]');
  if (!el || el.dataset.ready) return;
  el.dataset.ready = '1';
  startClock(el);
  const endpoint = el.dataset.weatherEndpoint;
  if (!endpoint && !el.dataset.qweatherKey) {
    el.querySelectorAll<HTMLElement>('[data-wx-weather], [data-wx-wind], [data-wx-humidity], [data-wx-city]').forEach((n) => (n.hidden = true));
    return;
  }

  const startWeather = async () => {
    try {
      if (endpoint) {
        const { fetchWorkerWeather } = await import('./weather-worker');
        const weather = await fetchWorkerWeather(endpoint, el);
        setCity(el, weather.city);
        renderWeather(el, weather);
      } else {
        const place = await locate(el);
        setCity(el, place.city);
        renderWeather(el, await fetchWeather(el, place));
      }
    } catch {
      if (endpoint) setCity(el, '未知地区');
      el.querySelector('[data-wx-text]')!.textContent = '天气暂不可用';
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          startWeather();
        }
      },
      { rootMargin: '300px 0px' },
    );
    // The card is transition:persist and initClock() won't run again for it, so
    // keep observing across navigations: on phones it is far down the page and
    // may only scroll into view on a later one.
    io.observe(el);
  } else {
    startWeather();
  }
}
