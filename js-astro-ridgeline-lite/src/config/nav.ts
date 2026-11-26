/**
 * Navigation structure for header and footer.
 */

export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation (desktop header + mobile menu). */
export const mainNav: NavLink[] = [
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

/** Extra links shown in the mobile menu. */
export const secondaryNav: NavLink[] = [];

/** Footer "Company" column. */
export const footerCompanyNav: NavLink[] = [
  { label: 'About Us', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Get a Free Quote', href: '/quote/' },
];
