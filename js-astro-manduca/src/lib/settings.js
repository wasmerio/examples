import settingsData from '../settings.json';

let cachedSettings = null;

export function getSettings() {
  if (!cachedSettings) {
    cachedSettings = settingsData;
  }
  return cachedSettings;
}