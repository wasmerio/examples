import type { Icon } from '@type/icon';
import type { CopyrightOptions } from '@type/copyright';

export interface Link {
  text?: string;
  url?: string;
  href?: string;
  icon?: Icon;
  target?: string;
  ariaLabel?: string;
  iconOnly?: boolean;
}

export interface Config {
  // Site title
  title: string;
  // Author name
  author: string;
  // Author avatar
  avatar: string;
  // Brief author description
  description?: string;
  // Site URL
  site_url?: string;
  // Website start/launch date for running time calculation (e.g. '2024-01-01')
  since?: string | Date;

  // Theme name in src/assets/styles/themes/ without .css extension (e.g. 'nayuta-aqua')
  theme?: string;

  // Positive integer; shared by post and tag archives (defaults to 10).
  postsPerPage?: number;

  // Post copyright card; disabled unless explicitly enabled.
  copyright?: CopyrightOptions;

  // Profile Card links
  links?: Link[];
}
