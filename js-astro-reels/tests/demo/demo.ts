// The demo's own checks run only while the site is still the demo: once pieces.name in
// src/config.ts names something other than the sonnets, they skip. A fork can delete tests/demo/.
import { siteConfig } from '../../src/config.ts';

// Widened from the config's literal type, so the comparison still type-checks in a fork.
const name: string = siteConfig.pieces.name;

export const skip = name === 'sonnets' ? false : 'not the demo: pieces.name in src/config.ts is no longer "sonnets"';
