export function formatExperience(startDate: Date, endDate: Date) {
  let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
  const monthDelta = endDate.getUTCMonth() - startDate.getUTCMonth();

  if (
    monthDelta < 0 ||
    (monthDelta === 0 && endDate.getUTCDate() < startDate.getUTCDate())
  ) {
    years -= 1;
  }

  return `${Math.max(years, 0)}+`;
}
