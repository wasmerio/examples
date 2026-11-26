export type NavItem = {
  title: string;
  href: string;        // "/about/" etc
  inMenu?: boolean;    // like nav-menu: true
  isHome?: boolean;    // like layout == "home"
};

export const navItems: NavItem[] = [
  { title: "Home", href: "/", isHome: true, inMenu: true },
  { title: "Landing", href: "/landing", inMenu: true },
   { title: "Projects", href: "/projects", inMenu: true },
  { title: "About", href: "/about", inMenu: true },
  // add more…
];
