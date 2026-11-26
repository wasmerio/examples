export const journalCategories = {
  process: {
    label: "Process",
    description: "How a project actually moves, from the first call to the launch week.",
  },
  craft: {
    label: "Craft",
    description: "Practical notes on type, colour, motion and building things that last.",
  },
  studio: {
    label: "Studio",
    description: "News, new people and life inside the two studios.",
  },
} as const;

export type JournalCategory = keyof typeof journalCategories;
export const journalCategoryKeys = Object.keys(journalCategories) as [
  JournalCategory,
  ...JournalCategory[],
];

/** Entries per page on the journal and its category pages. */
export const journalPageSize = 9;
