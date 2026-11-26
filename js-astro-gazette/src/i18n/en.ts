// Every string the theme prints itself. Page copy (the masthead prose, an article) is content,
// not UI, and stays in the page or in src/content/. {n}, {name}, {q} are filled by fmt().
export default {
  // shell
  skipToContent: 'Skip to content',
  mainNav: 'Main',
  language: 'Language',
  editedBy: 'Edited by {name}',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',

  // the issue, printed wherever a number is shown
  issueNumber: 'Issue {n}',
  pieces: '{n} pieces',
  minRead: '{n} min read',
  by: 'by {name}',

  // home
  onTheCover: 'On the cover',
  inThisIssue: 'In this issue',
  fromTheEditor: 'From the editor',
  backIssues: 'Back issues',
  allIssues: 'All issues',

  // archive
  archive: 'Archive',
  archiveDescription: 'Every issue, newest first',
  pageOf: 'page {n} of {total}',
  archivePages: 'Archive pages',
  newerIssues: 'Newer issues',
  olderIssues: 'Older issues',

  // one issue
  contents: 'Contents',
  issuesNav: 'Issues',
  earliestIssue: 'Earliest issue',
  latestIssue: 'Latest issue',

  // one piece
  inThisPiece: 'In this piece',
  alsoInThisIssue: 'Also in this issue',
  fullContents: 'Full contents',
  elsewhereIn: 'Elsewhere in {name}',
  allIn: 'All {name}',

  // masthead, contributor, department
  masthead: 'Masthead',
  issuesPublished: '{n} issues published',
  aboutTheMagazine: 'About the magazine',
  contributors: 'Contributors',
  editorial: 'Editorial',
  contributor: 'Contributor',
  allContributors: 'All contributors',
  department: 'Department',
  piecesHeading: 'Pieces',

  // newsletter
  subscribe: 'Subscribe',
  subscribeLine: 'The next issue, in your inbox the morning it comes out.',
  subscribeEmail: 'Email address',
  subscribeNote: 'One email a week. Unsubscribe from the foot of any issue.',

  // comments
  comments: 'Letters',
  commentsLine: 'Replies are kept in the open, on GitHub Discussions.',

  // legal
  lastUpdated: 'Last updated {date}',

  // search
  search: 'Search',
  searchDescription: 'Search every piece in the archive.',
  searchLabel: 'Search this magazine',
  searchResults: '{n} results',
  searchResultsOne: '1 result',
  searchNoResults: 'Nothing matched “{q}”.',
  searchUnavailable: 'The index is written at the end of a production build. Run one to search.',

  // 404
  notFoundTitle: 'Page not found',
  notFoundBody: 'The page you asked for is not here.',
  backHome: 'Back to the home page',

  // The department enum, as it prints. The values in content.config.ts stay English.
  departments: {
    Feature: 'Feature',
    Essay: 'Essay',
    Report: 'Report',
    Interview: 'Interview',
    Dispatch: 'Dispatch',
  },
};
