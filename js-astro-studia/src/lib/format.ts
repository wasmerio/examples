/** Formatting in SITE.locale, owned by no feature: the hero stats row formats
    a count whether or not lib/citations.ts (and its feature) is still here. */
import { SITE } from '../consts.ts';

export const formatCount = (n: number) => new Intl.NumberFormat(SITE.locale).format(n);
