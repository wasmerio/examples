/* Preview-mode smoke variant: the same site with SITE.previewMode set, the way
   a generator would set it on a throwaway build. Proves the banner renders and,
   by its absence everywhere else, that it cannot reach a real site. */
import { SITE as BASE_SITE } from './popular.config';
export * from './popular.config';
export const SITE = { ...BASE_SITE, previewMode: { note: 'Expires in 60 minutes.' } };
