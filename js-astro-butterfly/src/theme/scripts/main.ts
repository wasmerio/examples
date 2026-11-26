/**
 * Client entry. Module scripts run once per full page load; everything that
 * depends on the current page re-runs on `astro:page-load` (fires on first load
 * and after every View Transition navigation).
 */
import { initPersistStyles } from './persist-styles';
import { initPreferences } from './preferences';
import { initScroll, onPageScroll } from './scroll';
import { initToc } from './toc';
import { initContent } from './content';
import { initSearch } from './search';
import { initSidebar } from './sidebar';
import { initNavMenu } from './nav-menu';
import { initMusic } from './music';
import { initComments } from './comments';
import { initClock } from './clock';
import { initPowerMode } from './power-mode';
import { initLoadBar } from './load-bar';
import { initTranslate } from './translate';
import { initStats } from './stats';
import { initMermaid } from './mermaid';
import { initBodyFont } from './fallback-font';

initPersistStyles(); // must run before any library injects CSS
initLoadBar(); // first, so a slow first load shows progress as early as possible
initBodyFont();
initPreferences();
initScroll();
initSearch();
initSidebar();
initNavMenu();
initPowerMode();
initTranslate(); // registers its own astro:page-load handler

// One task per feature, so a long page never blocks input for all of them at once.
// A navigation during the gaps cancels the rest: its own page-load runs them all again.
const pageInits = [onPageScroll, initToc, initContent, initMermaid, initMusic, initClock, initComments, initStats];
let pageLoads = 0;
document.addEventListener('astro:page-load', async () => {
  const current = ++pageLoads;
  for (const init of pageInits) {
    init();
    await new Promise((resolve) => setTimeout(resolve));
    if (current !== pageLoads) return;
  }
});
