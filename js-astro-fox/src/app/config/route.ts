type Link = {
  title: "Home" | "About" | "Blog" | "Projects";
  href: string;
};

export const LINKS: Link[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "About",
    href: "/about",
  },
];
