// Lighthouse CI. Every page below is demo content, so the list filters itself: delete a demo
// post and it drops out of the run instead of failing it with a confusing 404. Add your own
// pages here as you write them.
const { existsSync } = require('node:fs');

const DIST = 'dist';

const PAGES = [
  '/index.html',
  '/catalogue/',
  // An entry with a note, and one without: the label grid changes shape between them.
  '/catalogue/riesener-mechanical-table-1778/',
  '/catalogue/augsburg-toilet-set/',
  '/collections/',
  '/collections/silver/',
  '/colophon/',
];

const file = (p) => `${DIST}${p.endsWith('.html') ? p : p.replace(/\/?$/, '/') + 'index.html'}`;
const built = PAGES.filter((p) => existsSync(file(p)));
// Never hand Lighthouse an empty list; the home page is always there.
const url = (built.length ? built : ['/']).map((p) => `http://localhost${p}`);

module.exports = {
  ci: {
    collect: {
      staticDistDir: DIST,
      url,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': [
          'error',
          {
            minScore: 0.95,
          },
        ],
        'categories:accessibility': [
          'error',
          {
            minScore: 0.95,
          },
        ],
        'categories:best-practices': [
          'error',
          {
            minScore: 0.95,
          },
        ],
        'categories:seo': [
          'error',
          {
            minScore: 0.95,
          },
        ],
      },
    },
  },
};
