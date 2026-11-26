// The chrome, in English. These are the words the theme puts on a page that the writing did
// not: labels, counts, navigation. The standing prose on the colophon, the archive and the
// other index pages is not here on purpose -- that copy is yours to rewrite in the page it
// belongs to, and a magazine's about-page voice does not belong in a string table.
//
// Interpolated strings are functions so a translation can put the number where its own
// grammar wants it, and so plural rules stay with the language that has them.
export default {
  // Layout
  skip: 'Skip to content',
  desks: 'Desks', // the header nav, named for what is in it

  // Counts and datelines. `stories` is what a folio counts.
  by: 'By',
  minutes: (n: number) => `${n} min`,
  stories: (n: number) => `${n} ${n === 1 ? 'story' : 'stories'}`,

  // The article and its rail
  figures: 'By the numbers',
  moreFrom: (desk: string) => `More from ${desk}`,
  filedTo: 'Filed to',
  relatedReading: 'Related reading',

  // Fronts and paging
  photoEssay: 'Photo essay',
  pagination: 'Pagination',
  newer: '← Newer',
  older: 'Older →',
  pageOf: (n: number, total: number) => `Page ${n} of ${total}`,

  // 404
  notFound: 'Page not found',
  notFoundLine: 'The page you asked for is not here.',
  backHome: 'Back to the home page',
};
