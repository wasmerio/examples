// ────────────────────────────────────────────────────────────────────────────
//  Calendar gallery — one photo per month.
//
//  The Calendar page shows every entry that has a matching image in
//  src/assets/calendar/, newest first. Add an entry here and drop the image in
//  that folder. The caption is rendered as e.g. "June 2025, Lisbon, Portugal".
//
//  The entries below are EXAMPLES that match the bundled placeholder images
//  (2025-01.jpg … 2025-12.jpg). Replace the locations with real ones, and add
//  new months as you go. An entry whose image isn't present yet is skipped, so
//  you can stage future months without showing them.
// ────────────────────────────────────────────────────────────────────────────

export interface CalendarEntry {
  year: number;
  month: number; // 1–12
  location: string; // shown after the month, e.g. "Lisbon, Portugal"
  file: string; // filename in src/assets/calendar/
}

export const calendar: CalendarEntry[] = [
  { year: 2025, month: 1, location: "Snowy ridge", file: "2025-01.jpg" },
  { year: 2025, month: 2, location: "Frozen lake", file: "2025-02.jpg" },
  { year: 2025, month: 3, location: "First thaw", file: "2025-03.jpg" },
  { year: 2025, month: 4, location: "Spring meadow", file: "2025-04.jpg" },
  { year: 2025, month: 5, location: "Coastal trail", file: "2025-05.jpg" },
  { year: 2025, month: 6, location: "Harbor at dawn", file: "2025-06.jpg" },
  { year: 2025, month: 7, location: "Summer hills", file: "2025-07.jpg" },
  { year: 2025, month: 8, location: "Desert road", file: "2025-08.jpg" },
  { year: 2025, month: 9, location: "Old town", file: "2025-09.jpg" },
  { year: 2025, month: 10, location: "Autumn woods", file: "2025-10.jpg" },
  { year: 2025, month: 11, location: "River valley", file: "2025-11.jpg" },
  { year: 2025, month: 12, location: "Winter coast", file: "2025-12.jpg" },

  // Stage future months here — they appear once the image exists in the folder:
  // { year: 2026, month: 1, location: 'Somewhere new', file: '2026-01.jpg' },
];
