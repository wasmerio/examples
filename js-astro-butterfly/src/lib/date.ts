import { site } from '@/config';

const SHANGHAI_OFFSET_MS = 8 * 60 * 60 * 1000;

/**
 * Hexo front matter dates (`2024-01-02 23:34:30`) are local Asia/Shanghai time,
 * but YAML parses them as UTC. Shift them back to the real instant.
 */
export function fromHexoDate(value: unknown): Date | undefined {
  if (value == null || value === '') return undefined;
  if (value instanceof Date) return new Date(value.getTime() - SHANGHAI_OFFSET_MS);
  const s = String(value).trim();
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : `${s.replace(' ', 'T')}+08:00`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const parts = (d: Date) => {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: site.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(d);
  return Object.fromEntries(p.map((x) => [x.type, x.value])) as Record<string, string>;
};

/** YYYY-MM-DD in site timezone */
export const formatDate = (d: Date) => { const p = parts(d); return `${p.year}-${p.month}-${p.day}`; };
/** YYYY-MM-DD HH:mm:ss in site timezone */
export const formatDateTime = (d: Date) => { const p = parts(d); return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`; };
export const yearOf = (d: Date) => parts(d).year;
export const monthOf = (d: Date) => parts(d).month;
