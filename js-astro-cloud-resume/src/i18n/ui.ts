/**
 * Interface labels. The resume content itself lives in `src/data/resume.yaml`;
 * this file only holds the words the theme adds around it.
 *
 * To add a language: copy the `en` block, translate the values, and set
 * `lang` in `src/config.ts`. TypeScript reports any missing key.
 */
const en = {
  skipToContent: 'Skip to content',
  sections: {
    summary: 'Profile',
    experiences: 'Experience',
    projects: 'Projects',
    certifications: 'Certifications',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    interests: 'Interests',
    contact: 'Contact',
  },
  present: 'Present',
  current: 'Current',
  issued: 'Issued',
  expires: 'Expires',
  expired: 'Expired',
  noExpiry: 'No expiration',
  active: 'Active',
  credentialId: 'Credential ID',
  verify: 'Verify',
  verifyLabel: (name: string) => `Verify ${name} (opens in a new tab)`,
  badgeAlt: (name: string) => `${name} badge`,
  email: 'Email',
  phone: 'Phone',
  website: 'Website',
  source: 'Source',
  level: (n: number) => `Level ${n} of 5`,
  years: (n: number) => (n === 1 ? '1 yr' : `${n} yrs`),
  months: (n: number) => (n === 1 ? '1 mo' : `${n} mos`),
  downloadPdf: 'Download PDF',
  print: 'Print',
  theme: {
    label: 'Colour theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    toggle: 'Switch colour theme',
  },
  opensInNewTab: '(opens in a new tab)',
  footer: 'Built with the cloud-resume theme',
  otherStyles: 'Other styles',
  notFoundTitle: 'Page not found',
  notFoundText: 'This page does not exist. The resume is on the home page.',
  backHome: 'Back to the resume',
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  skipToContent: 'Aller au contenu',
  sections: {
    summary: 'Profil',
    experiences: 'Expérience',
    projects: 'Projets',
    certifications: 'Certifications',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    interests: 'Centres d’intérêt',
    contact: 'Contact',
  },
  present: 'Aujourd’hui',
  current: 'En cours',
  issued: 'Obtenue',
  expires: 'Expire',
  expired: 'Expirée',
  noExpiry: 'Sans expiration',
  active: 'Active',
  credentialId: 'ID de certification',
  verify: 'Vérifier',
  verifyLabel: (name: string) => `Vérifier ${name} (nouvel onglet)`,
  badgeAlt: (name: string) => `Badge ${name}`,
  email: 'E-mail',
  phone: 'Téléphone',
  website: 'Site web',
  source: 'Code source',
  level: (n: number) => `Niveau ${n} sur 5`,
  years: (n: number) => (n === 1 ? '1 an' : `${n} ans`),
  months: (n: number) => `${n} mois`,
  downloadPdf: 'Télécharger le PDF',
  print: 'Imprimer',
  theme: {
    label: 'Thème de couleur',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    toggle: 'Changer le thème de couleur',
  },
  opensInNewTab: '(nouvel onglet)',
  footer: 'Réalisé avec le thème cloud-resume',
  otherStyles: 'Autres styles',
  notFoundTitle: 'Page introuvable',
  notFoundText: 'Cette page n’existe pas. Le CV se trouve sur la page d’accueil.',
  backHome: 'Retour au CV',
};

export const ui = { en, fr } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof ui;
export const locales = Object.keys(ui) as Locale[];
