export interface PageSection {
  id: string;
  variant: string;
}

export interface PageSeo {
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface PageLayout {
  theme?: string;
  sectionPattern?: 'off' | 'repeat' | 'mesh' | 'noise';
}

export interface PageConfig {
  enabled?: boolean;
  devOnly?: boolean;
  seo?: PageSeo;
  heading?: string;
  layout?: PageLayout;
  sections: PageSection[];
}

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export interface HeaderConfig {
  items: NavLink[];
  cta: {
    label: string;
    href: string;
    hoverLabel?: string;
  };
  aria: {
    menuOpen: string;
    menuClose: string;
    menuExpand: string;
    navMain: string;
    drawer: string;
  };
}

export interface FooterConfig {
  about: string;
  columns: NavSection[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    consent: string;
  };
  legal: NavLink[];
}

export interface CompanyConfig {
  name: string;
  fullName: string;
  branding: {
    icon: string;
    font: string;
    tagline?: string;
    logoSuffix?: string;
    logoImage?: string;
    favicon?: string;
  };
  address: string;
  zipCode: string;
  city: string;
  phone: string;
  email: string;
  nip?: string;
  krs?: string;
  hours: string;
  siteUrl?: string;
  priceRange?: string;
  description?: string;
  geo?: {
    lat: number;
    lng: number;
  };
  socials: Record<string, string>;
}
