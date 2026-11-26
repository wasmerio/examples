// Lighthouse CI. Every page below is demo content, so the list filters itself: delete a demo
// post and it drops out of the run instead of failing it with a confusing 404. Add your own
// pages here as you write them.
const { existsSync } = require('node:fs');

const DIST = './dist';

const PAGES = ['/', '/about/', '/issues/', '/issues/4/', '/issues/4/bread-before-dawn/'];

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
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
