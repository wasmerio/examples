import type { Award } from '~/types';

export const awards: Award[] = [
  { year: '2026', title: 'Independent of the Year', detail: 'Design Council annual, art direction category', tag: 'Winner' },
  { year: '2025', title: 'Interface of the Month', detail: 'For the Petrichor reporting rebuild', tag: 'Feature' },
  { year: '2025', title: 'Accessibility Merit', detail: 'Undergrove checkout, WCAG 2.2 AA audit passed', tag: 'Merit' },
  { year: '2024', title: 'Rebrand of the Year', detail: 'Regional Brand Awards, shortlisted from 410 entries', tag: 'Finalist' },
  { year: '2023', title: 'Speaker, Type & Interface', detail: 'Talk: designing the states nobody screenshots', tag: 'Talk' },
];

export const awardsHeading = {
  eyebrow: 'The shelf',
  title: 'Occasionally somebody notices.',
};
