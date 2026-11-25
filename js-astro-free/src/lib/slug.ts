export function slugifyTag(input: string): string {
  return encodeURIComponent(
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
  );
}


