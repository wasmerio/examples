// Every string the theme prints itself. Page copy -- about, the legal pages, a note, a
// product -- is content, not UI, and stays in the page or in src/content/. {n}, {name},
// {title}, {q} are filled by fmt(); a { one, other } pair is picked by count().
import type { Plural } from './t';

export default {
  // shell
  skipToContent: 'Skip to content',
  mainNav: 'Main',
  language: 'Language',
  untranslated: 'not translated',
  thisPage: 'this page',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',

  // the two halves of the site, as headings and back links
  work: 'Work',
  notes: 'Notes',
  allWork: 'All work',
  allNotes: 'All notes',

  // a product's status, as it prints; the values in content.config.ts stay English
  status: { live: 'live', building: 'building', archived: 'archived' },

  // counts, in the mono line under a page title
  products: { one: '{n} product', other: '{n} products' } as Plural,
  noteCount: { one: '{n} note', other: '{n} notes' } as Plural,
  tagCount: { one: '{n} tag', other: '{n} tags' } as Plural,
  minutes: '{n} min',

  // /work
  workDescription: 'Everything on the shelf, and what is still being built.',
  archived: 'Archived',
  filterShelf: 'Filter the shelf',
  filterStatus: 'Showing',
  filterCategory: 'Of kind',
  filterAll: 'all',
  shownOf: '{shown} of {total} products',

  // a product
  since: 'since {year}',
  source: 'source',
  notesOn: 'Notes on {title}',
  nextProduct: 'Next product: {title}',
  whatChanged: 'What changed in {title}',

  // /notes
  notesDescription: 'Everything written down while building the things on this site.',
  notesPage: 'Notes, page {n}',
  categories: 'Categories',
  byYear: 'Everything, by year',
  pagination: 'Pagination',
  newer: 'Newer',
  older: 'Older',

  // a note
  updated: 'updated',
  contents: 'Contents',
  filedUnder: 'Filed under',
  tagged: 'Tagged',
  related: 'Related',
  sameProduct: 'same product',
  sharesTag: 'tagged {tag}',
  sameCategory: 'same category',
  thisNote: 'this note',
  comments: 'Comments',
  moreNotes: 'More notes',
  copy: 'copy',
  copied: 'copied',
  copyFailed: 'copy it yourself',
  copyLabel: 'Copy code to clipboard',

  // a category
  feed: 'feed',

  // tags, archive, authors
  tag: 'tag',
  product: 'product',
  tagTitle: 'Tagged {name}',
  tagDescription: 'Everything on this site tagged {name}.',
  everyTag: 'Every tag',
  archive: 'Archive',
  archiveDescription: 'Everything here in the order it happened, and every tag it was filed under.',
  tags: 'Tags',
  notesBy: 'Notes by {name}.',

  // search
  search: 'Search',
  searchDescription: 'Look for a product, a note, or a phrase you half remember.',
  searchLabel: 'Words to look for',
  searchIdle: 'Full text, including the parts of a page that never appear in a list.',
  searchNoIndex: 'No index here yet. Build the site, then serve it: pnpm build && pnpm preview.',
  searchResults: { one: '{n} page for “{q}”', other: '{n} pages for “{q}”' } as Plural,
  searchClosest: ', closest {n}',
  searchNothing: 'Nothing for “{q}”.',

  // contact, newsletter
  contact: 'Contact',
  contactDescription: 'Get in touch with {name}.',
  yourName: 'Your name',
  yourEmail: 'Your email',
  message: 'Message',
  send: 'Send',
  email: 'Email',
  subscribe: 'Subscribe',

  // the letter (Pro): /letter, the two pages Buttondown sends a reader back to, the row
  // at the foot of a note
  letter: 'The letter',
  letterNav: 'Letter',
  pastLetters: 'Past letters',
  letterSent: 'Check your inbox',
  letterSentBody:
    'An email is on its way with a link in it. Nothing is sent until you press that link.',
  letterConfirmed: 'You are on the list',
  letterConfirmedBody:
    'The next letter goes out when something ships. Until then, the notes are here.',
  stepOf: '{n} of {total}',

  // 404
  notFound: 'Page not found',
  notFoundBody:
    'Nothing is filed under that address. It may have been renamed, or it may never have existed.',
  elsewhere: 'Elsewhere',
  home: 'Home',
};
