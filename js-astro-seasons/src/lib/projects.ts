import { getIcon, type IconSource } from '@/lib/icons';

export type ProjectLinkKind = 'github' | 'follow' | 'demo' | 'theme';

export interface ProjectLink {
  kind: ProjectLinkKind;
  url: string;
}

interface ProjectLinkDefinition {
  label: string;
  icon: IconSource;
  getAriaLabel: (projectName: string) => string;
}

export const PROJECT_LINK_DEFINITIONS: Record<ProjectLinkKind, ProjectLinkDefinition> = {
  github: {
    label: 'GitHub',
    icon: getIcon('brand-github'),
    getAriaLabel: (projectName: string): string => `View ${projectName} on GitHub`,
  },
  follow: {
    label: 'Follow',
    icon: getIcon('brand-github'),
    getAriaLabel: (projectName: string): string => `Follow for updates on ${projectName}`,
  },
  demo: {
    label: 'Demo',
    icon: getIcon('external-link'),
    getAriaLabel: (projectName: string): string => `View ${projectName} demo`,
  },
  theme: {
    label: 'Theme',
    icon: getIcon('palette'),
    getAriaLabel: (projectName: string): string => `View ${projectName} in the Astro themes library`,
  },
};
