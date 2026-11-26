/** Starter config, plus one banner that exists only on the published demo.
 *
 *  The starter is two things at once: the neutral skeleton `npm create
 *  popular-site@latest` writes, and the root of the deployed demo tree, which
 *  is the URL submitted to the Astro theme catalogue. A visitor landing there
 *  sees a deliberately empty site and has no way to discover the four
 *  flavored demos, so they judge the theme on the skeleton alone.
 *
 *  This adds a notice pointing at the gallery. It lives here rather than in
 *  `popular.config.ts` because that file *is* the scaffolder's template
 *  (create-popular-site/scripts/collect-templates.mjs copies it verbatim), and
 *  a real community's site must never carry a link to this project's demos.
 *  Only scripts/build-sites.mjs uses this file, via astro.deploy.config.mjs.
 *
 *  A local export shadows the star re-export of the same name, so this is the
 *  starter config with SITE replaced and everything else passed through. */
export * from './popular.config';
import { SITE as STARTER_SITE } from './popular.config';

export const SITE = {
  ...STARTER_SITE,
  notice: {
    text: 'This is the neutral starter, exactly what `npm create popular-site@latest` writes. Four complete demo sites share the same theme code.',
    url: '/demos/',
  },
};
