export function isCalendarDate(value: unknown): value is string;
export function validateSlug(slug: string): string;
export function selectPublished<
  T extends { id: string; data: { date: string; draft?: boolean } },
>(posts: T[]): T[];
