const byLabel: Record<string, string> = {
  Behance: 'social-behance',
  Dribbble: 'social-dribbble',
  GitHub: 'social-github',
  Instagram: 'social-instagram',
  LinkedIn: 'social-linkedin',
  X: 'social-twitter-x',
};

export const socialIcon = (label: string) => byLabel[label] ?? 'arrow-up-right';
