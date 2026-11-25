'use client';

import { useEffect } from 'react';

/**
 * Mounts the site's behaviour: the same vanilla modules the Astro build runs
 * (src/scripts/fx), loaded after hydration. They read the DOM React rendered
 * and enhance it, so every page is complete before any of this runs.
 */
export default function Scripts() {
  useEffect(() => {
    import('@/scripts/entry.js');
  }, []);
  return null;
}
