export function isCalendarDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)
  )
    return false;
  const [year, month, day] = value.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

export function validateSlug(slug) {
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid article slug: ${slug}`);
  }
  return slug;
}

export function selectPublished(posts) {
  const seen = new Set();
  for (const post of posts) {
    validateSlug(post.id);
    if (seen.has(post.id))
      throw new Error(`Duplicate article slug: ${post.id}`);
    seen.add(post.id);
    if (!isCalendarDate(post.data.date))
      throw new Error(`Invalid date in ${post.id}: ${post.data.date}`);
  }
  return posts
    .filter((post) => post.data.draft !== true)
    .sort(
      (a, b) =>
        b.data.date.localeCompare(a.data.date) ||
        a.id.localeCompare(b.id, "en"),
    );
}
