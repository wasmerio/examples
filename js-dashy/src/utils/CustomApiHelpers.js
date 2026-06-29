/* Field resolution and value formatting for the CustomApi widget */

/* Get a nested value from an object by dot-path, e.g. 'a.b.0.c'. Empty path returns the root */
export const resolveField = (obj, path) => {
  if (!path) return obj;
  return String(path).split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
};

/* Map a value's sign to an action colour, for `color: adaptive` fields. Non-numeric stays neutral */
export const adaptiveColor = (raw) => {
  const n = Number(raw);
  if (Number.isNaN(n)) return '';
  if (n > 0) return 'success';
  if (n < 0) return 'error';
  return 'info';
};

/* Largest-first periods, used to pick a unit for relative dates */
const RELATIVE_UNITS = [
  { unit: 'year', secs: 31557600 },
  { unit: 'month', secs: 2628000 },
  { unit: 'week', secs: 604800 },
  { unit: 'day', secs: 86400 },
  { unit: 'hour', secs: 3600 },
  { unit: 'minute', secs: 60 },
  { unit: 'second', secs: 1 },
];

/* Format a date as relative to now, e.g. '2 days ago' or 'in 3 hours' */
const formatRelativeDate = (raw, mapping, locale) => {
  const time = new Date(raw).getTime();
  if (Number.isNaN(time)) return String(raw);
  const diffSecs = (time - Date.now()) / 1000;
  const period = RELATIVE_UNITS.find((p) => Math.abs(diffSecs) >= p.secs)
    || RELATIVE_UNITS[RELATIVE_UNITS.length - 1];
  const rtf = new Intl.RelativeTimeFormat(locale, {
    style: mapping.style || 'long',
    numeric: mapping.numeric || 'always',
  });
  return rtf.format(Math.round(diffSecs / period.secs), period.unit);
};

/* Format a raw value per a mapping's `format`. `root` is the full response, used by `size` */
export const formatValue = (raw, mapping = {}, root) => {
  const format = mapping.format || 'text';
  const locale = mapping.locale || navigator.language;

  // `size` counts array elements / object keys (root when no field is given)
  if (format === 'size') {
    const target = mapping.field == null ? root : raw;
    if (Array.isArray(target)) return String(target.length);
    if (target && typeof target === 'object') return String(Object.keys(target).length);
    return target == null ? '' : String(target);
  }

  if (raw == null) return '';

  switch (format) {
    case 'number': {
      const n = Number(raw);
      return Number.isNaN(n) ? String(raw) : new Intl.NumberFormat(locale).format(n);
    }
    case 'percent': {
      const n = Number(raw);
      return Number.isNaN(n) ? String(raw)
        : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2 }).format(n / 100);
    }
    case 'date': {
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return String(raw);
      const opts = { dateStyle: mapping.dateStyle || 'long' };
      if (mapping.timeStyle) opts.timeStyle = mapping.timeStyle;
      return new Intl.DateTimeFormat(locale, opts).format(date);
    }
    case 'relativeDate':
      return formatRelativeDate(raw, mapping, locale);
    default:
      return String(raw);
  }
};
