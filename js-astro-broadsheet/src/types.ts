export type Author = {
  NAME: string;
  INITIALS: string;
  ROLE: string;
  SLOGAN: string;
};

export type Site = {
  TITLE: string;
  WORDMARK: string;
  DESCRIPTION: string;
  TAGLINE: string;
  LOCALE: string;
  AUTHOR: Author;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type NavLink = {
  href: string;
  label: string;
};
