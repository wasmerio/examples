export const labels = {
  "nav.bookshelf": "Bookshelf",
  "nav.home": "← Bookshelf",
  "chapter.label": "Chapter",
  "chapter.empty": "This chapter hasn't been written yet.",
  "shelf.books": "books",
  "shelf.chapters": "chapters",
  "404.title": "Page Not Found",
  "404.description": "The page you're looking for doesn't exist.",
  "404.home": "Back to Bookshelf",
} as const;

export type LabelKey = keyof typeof labels;

export function l(key: LabelKey): string {
  return labels[key];
}
