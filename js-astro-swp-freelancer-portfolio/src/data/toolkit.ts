import type { ToolkitItem } from '~/types';

export const toolkit: ToolkitItem[] = [
  { icon: 'pen', title: 'Art direction', detail: 'One visual language, held across every surface.' },
  { icon: 'type', title: 'Typography', detail: 'Scales, pairings and a self-hosted font setup.' },
  { icon: 'motion', title: 'Motion', detail: 'Transitions with a reason, and a reduced-motion path.' },
  { icon: 'device', title: 'Responsive', detail: 'Every layout checked from 320px through 1920px.' },
  { icon: 'code', title: 'Front end', detail: 'Semantic markup and CSS your engineers can read.' },
  { icon: 'spark', title: 'Colour', detail: 'Palettes checked for contrast before they get pretty.' },
  { icon: 'layers', title: 'Systems', detail: 'Naming that survives the next rebrand.' },
  { icon: 'flag', title: 'Accessibility', detail: 'Contrast, focus order and keyboard paths, tested.' },
];

export const toolkitHeading = {
  eyebrow: 'How I work',
  title: 'Nothing exotic in the box.',
  intro:
    'Tools your team already has, files your team can open, and a handover that does not depend on me answering messages six months from now.',
};
