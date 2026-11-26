// Lighthouse CI. Every page below is demo content, so the list filters itself: delete a demo
// post and it drops out of the run instead of failing it with a confusing 404. Add your own
// pages here as you write them.
const { existsSync } = require('node:fs');

const DIST = 'dist';

// Home, list, a members issue (The Cut), a free issue with a table, an issue with a picture, the plans table, a plain page
const PAGES = [
  '/index.html',
  '/archive/',
  '/issues/why-a-box-from-busan-to-rotterdam-cost-this-week/',
  '/issues/rates-by-lane-with-the-asterisks-left-in/',
  '/issues/the-oldest-ship-on-the-loop/', // a picture right under the first paragraph
  '/subscribe/',
  '/about/',
  '/start-here/',
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
      numberOfRuns: 3, // mobile defaults: no preset
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
