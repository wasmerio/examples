/** Subpath smoke variant config: the starter config with one key changed.
 *
 *  `fontAwesome` is the only URL the theme writes that the base guard could
 *  not see before, because leaving the key unset renders no <link> at all.
 *  It shipped unprefixed in the package model for exactly that long. Setting
 *  it here puts it back under the guard's grep.
 *
 *  A local export shadows the star re-export of the same name, so this is the
 *  starter config with SITE replaced and everything else passed through. */
export * from './popular.config';
import { SITE as STARTER_SITE } from './popular.config';

export const SITE = {
  ...STARTER_SITE,
  fontAwesome: '/fontawesome/css/all.min.css',
};
