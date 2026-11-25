const KEY = 'fourfold-favorites';

function read(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch { return []; }
}

export function isFavorite(id: string) { return read().includes(id); }
export function toggleFavorite(id: string) {
  const items = read();
  const next = items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next.includes(id);
}
export function getFavorites() { return read(); }
export function clearFavorites() { localStorage.removeItem(KEY); }
