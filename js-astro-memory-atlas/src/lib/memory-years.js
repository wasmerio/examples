const YEAR_PATTERN = /(?:19|20)\d{2}/g;

export function getMemoryYears(dateText) {
  if (typeof dateText !== 'string') return [];
  const years = [...new Set((dateText.match(YEAR_PATTERN) ?? []).map(Number))];
  return years;
}
