// "2026-11-06" -> "Nov 6, 2026". Parsed as UTC so the day never shifts with the build machine's timezone.
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
