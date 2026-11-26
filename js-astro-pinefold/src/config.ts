// The one file to edit to make this theme yours. Posts live separately
// in src/content/writing/ since they're markdown, not config data.

export const site = {
  name: "Erika Mustermann",
  url: "https://example.github.io",
  palette: "emerald" as "emerald" | "warm" | "slate" | "mono" | "ink" | "forest",
};

type NavItem = {
  href: string;
  label: string;
};

export const nav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/building", label: "Building" },
  { href: "/writing", label: "Writing" },
];

export const hero = {
  eyebrow: "Product engineer",
  headlineLine1: "BUILDS",
  headlineLine2: "THINGS",
  lede: "One or two sentences about what you build and what you're looking for.",
  initials: "EM",
  avatarImage: "/avatar.png",
  buildingTileText: "A short summary of your projects",
  writingTileText: "A short summary of your writing",
};

export const focusAreas: string[] = ["Focus area one", "Focus area two", "Focus area three"];

export type Tool = {
  name: string;
  kind: string;
  description: string;
  tags: string[];
  links: { href: string; label: string }[];
};

export const tools: Tool[] = [
  {
    name: "sample-project",
    kind: "npm",
    description: "Replace this with a real project. Description shows up on the Building page as a card.",
    tags: ["example", "placeholder"],
    links: [{ label: "GitHub", href: "https://github.com/example/sample-project" }],
  },
  {
    name: "another-project",
    kind: "CLI",
    description: "A second example, showing how the grid looks with more than one card. Tags, links, and kind all work the same way.",
    tags: ["example", "cli"],
    links: [
      { label: "GitHub", href: "https://github.com/example/another-project" },
      { label: "Web", href: "https://example.com" },
    ],
  },
];

export type InProgressItem = {
  name: string;
  kind: string;
  description: string;
  href?: string;
};

export const inProgress: InProgressItem[] = [
  {
    name: "sample-in-progress",
    kind: "Browser extension",
    description: "Something you're actively building but haven't shipped yet. Shows up in a quieter, unbordered list below the main project grid.",
    href: "https://github.com/example/sample-in-progress",
  },
  {
    name: "another-wip",
    kind: "Internal tool",
    description: "A second example — this one has no link yet, showing what the section looks like for something with nothing public to point to.",
  },
];

export type FooterLink = { label: string; href: string };

export const footerLinks: FooterLink[] = [
  { label: "GitHub", href: "https://github.com/example" },
  { label: "Email", href: "mailto:you@example.com" },
  { label: "Resume", href: "/resume.pdf" },
];

export type TimelineEntry = { date: string; title: string };

export const timeline: TimelineEntry[] = [
  { date: "20XX", title: "First milestone" },
  { date: "20XX", title: "Second milestone" },
  { date: "20XX", title: "Third milestone" },
  { date: "20XX", title: "Fourth milestone" },
  { date: "20XX", title: "Fifth milestone" },
];