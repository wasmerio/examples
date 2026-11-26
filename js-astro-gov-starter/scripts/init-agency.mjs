#!/usr/bin/env node
/**
 * Agency initialization wizard.
 * Run once after cloning the template to configure your agency's site.
 *
 * Usage: node scripts/init-agency.mjs
 *   Or:  pnpm init-agency
 */

import { createInterface } from 'readline';
import { writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

// ─── Prompt helper ────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultValue = '') {
  const hint = defaultValue ? ` [${defaultValue}]` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('');
console.log('╔══════════════════════════════════════════════════════╗');
console.log('║   astro-gov-starter — Agency Setup Wizard           ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log('');
console.log('This wizard updates src/config/site.ts with your agency');
console.log('information. You can re-run it any time to make changes.');
console.log('');

// ─── Gather inputs ────────────────────────────────────────────────────────────

const agencyName = await ask('Agency / site name', 'My Agency');
const domain = await ask('Agency domain (no https://)', 'myagency.gov');
const description = await ask(
  'Site description (meta description)',
  `${agencyName} — programs and services for eligible residents.`
);

console.log('');
console.log('── Required USA Identifier links (leave blank to keep placeholder) ──');
console.log('  All U.S. federal executive branch agencies must include these links.');
const aboutUrl = await ask('About URL', `/about/`);
const accessibilityUrl = await ask('Accessibility statement URL', `/accessibility/`);
const foia = await ask('FOIA URL', 'https://www.foia.gov/');
const noFear = await ask('No FEAR Act URL', 'https://www.eeoc.gov/no-fear-act-data');
const oig = await ask('Inspector General URL', 'https://www.oversight.gov/');
const budget = await ask('Budget & performance URL', `https://${domain}/performance/`);
const privacy = await ask('Privacy policy URL', `/privacy/`);
const shortName = await ask('Agency short name (abbreviation)', agencyName.split(' ').map(w => w[0]).join('').toUpperCase() || 'Agency');

// ─── Write site.ts ────────────────────────────────────────────────────────────

const siteConfigPath = join(ROOT, 'src/config/site.ts');
const newConfig = `export const siteConfig = {
  name: ${JSON.stringify(agencyName)},
  shortName: ${JSON.stringify(shortName)},
  domain: ${JSON.stringify(domain)},
  description: ${JSON.stringify(description)},
  locale: 'en-US',

  // Required USA Identifier links — all federal executive branch agencies must
  // include these links on every page.
  // https://designsystem.digital.gov/components/identifier/
  links: {
    about: ${JSON.stringify(aboutUrl)},
    accessibility: ${JSON.stringify(accessibilityUrl)},
    foia: ${JSON.stringify(foia)},
    noFear: ${JSON.stringify(noFear)},
    oig: ${JSON.stringify(oig)},
    budget: ${JSON.stringify(budget)},
    privacy: ${JSON.stringify(privacy)},
    usagov: 'https://www.usa.gov/',
  },
} as const;

export type SiteConfig = typeof siteConfig;
`;

writeFileSync(siteConfigPath, newConfig, 'utf-8');

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('');
console.log('✓ src/config/site.ts updated');
console.log('');
console.log('Next steps:');
console.log('  1. pnpm dev            — start the local dev server');
console.log('  2. Edit src/content/   — replace seed content with your programs');
console.log('  3. pnpm build          — verify the build passes');
console.log('  4. bash scripts/check.sh — run all quality gates');
console.log('');

rl.close();
