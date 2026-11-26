import type { Feature } from '../types';

/** Checklist in the "How it holds up" platform section. */
export const features: Feature[] = [
  { title: 'Runs in your cloud', description: 'Deployed into your account, or fully on premise for regulated work.' },
  { title: 'Spend capped per run', description: 'A hard budget per task. Past it, the work goes to a human queue instead.' },
  { title: 'Model-agnostic routing', description: 'Whichever model wins on your test set, re-checked every quarter.' },
  { title: '400-day replay', description: 'Reconstruct any decision step by step, long after the invoice cleared.' },
];
