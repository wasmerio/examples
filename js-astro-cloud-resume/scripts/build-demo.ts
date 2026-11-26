/**
 * Builds the public demo: the same theme in every brand, in one folder.
 *
 *   dist/            aws        (BASE_PATH)
 *   dist/azure/      azure      (BASE_PATH/azure)
 *   dist/gcp/        gcp        (BASE_PATH/gcp)
 *   dist/openstack/  openstack  (BASE_PATH/openstack)
 *
 * Each build uses its example from src/data/examples/ and DEMO_LINKS=true, which
 * adds the "Other styles" links in the footer. A normal `npm run build` never does.
 *
 *   SITE=https://<user>.github.io BASE_PATH=/cloud-resume npm run build:demo
 */
import { execFileSync } from 'node:child_process';
import { brands } from '../src/brands.ts';

const root = (process.env.BASE_PATH ?? '/cloud-resume').replace(/\/+$/, '');
const outDir = process.env.DEMO_OUT_DIR || 'dist';

// `aws` first: it owns the output root, and Astro empties its outDir before building.
for (const brand of brands) {
  const sub = brand === 'aws' ? '' : `/${brand}`;
  console.log(`\n▶ ${brand} → ${outDir}${sub}/ (base ${root || ''}${sub}/)`);
  execFileSync('npx', ['astro', 'build', '--outDir', `${outDir}${sub}`], {
    stdio: 'inherit',
    env: {
      ...process.env,
      BRAND: brand,
      RESUME_DATA: `src/data/examples/${brand}.yaml`,
      BASE_PATH: `${root}${sub}` || '/',
      DEMO_LINKS: 'true',
    },
  });
}
