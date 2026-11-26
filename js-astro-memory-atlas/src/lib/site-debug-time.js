export const SITE_DEBUG_TIME_KEY = 'anniversary-debug-time';

function browserSessionStorage() {
  try {
    return globalThis.sessionStorage;
  } catch {
    return null;
  }
}

function getZonedParts(date, timeZone) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date).map(({ type, value }) => [type, value]));
}

export function parsePacificDateTime(value, timeZone = 'America/Los_Angeles') {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value || '');
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const [year, month, day, hour, minute] = [yearText, monthText, dayText, hourText, minuteText].map(Number);
  const target = Date.UTC(year, month - 1, day, hour, minute);
  const normalized = new Date(target);
  if (normalized.getUTCFullYear() !== year || normalized.getUTCMonth() !== month - 1
      || normalized.getUTCDate() !== day || hour > 23 || minute > 59) return null;

  let guess = target;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = getZonedParts(new Date(guess), timeZone);
    const shown = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    guess += target - shown;
  }

  const result = new Date(guess);
  const resolved = getZonedParts(result, timeZone);
  if (Number(resolved.year) !== year || Number(resolved.month) !== month || Number(resolved.day) !== day
      || Number(resolved.hour) !== hour || Number(resolved.minute) !== minute) return null;
  return result;
}

export function getSiteDebugDate(storage = browserSessionStorage()) {
  try {
    return storage?.getItem(SITE_DEBUG_TIME_KEY) || '';
  } catch {
    return '';
  }
}

export function setSiteDebugDate(value, storage = browserSessionStorage()) {
  try {
    if (!storage) return false;
    storage.setItem(SITE_DEBUG_TIME_KEY, value);
    return true;
  } catch {
    return false;
  }
}

export function clearSiteDebugDate(storage = browserSessionStorage()) {
  try {
    storage?.removeItem(SITE_DEBUG_TIME_KEY);
    return true;
  } catch {
    return false;
  }
}

export function formatPacificDateTime(date = new Date(), timeZone = 'America/Los_Angeles') {
  const parts = getZonedParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
