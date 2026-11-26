/** Groups consecutive entries by their leading "YYYY" year: the first entry
 *  in a run of same-year entries gets that year back, repeats get "" so the
 *  caller can blank a redundant date label (Timeline/Highlights aside
 *  column). Moved out of AboutProfessional's old markYears/yearOf helpers —
 *  same logic, generalized to any dated array. */
const yearOf = (s: string) => (/^\d{4}/.test(s) ? s.slice(0, 4) : s);

export const markYears = <T>(items: T[], date: (item: T) => string) =>
  items.map((item, i) => ({
    item,
    year:
      i === 0 || yearOf(date(items[i - 1])) !== yearOf(date(item))
        ? yearOf(date(item))
        : "",
  }));
