export type Link = {
  label: string;
  href: string;
};

export type ProfileLink = Link & {
  username: string;
};

export type Profile = {
  name: string;
  givenName: string;
  familyName: string;
  domain: string;
  role: string;
  company: string;
  /** Shown in the hero and the llms.txt summary; leave out to hide it. */
  location?: string;
  email: string;
  focus: string;
  current: string;
  previous: string;
  /** One sentence about what the owner writes about; ends the author note under posts. */
  writing: string;
  links: ProfileLink[];
};

export type GithubProject = {
  name: string;
  description: string;
  href: string;
  /** Slug of a page in content/projects; the card links there instead of `href`. */
  page?: string;
  /** Leave out to hide the language badge. */
  language?: string;
  /** A date (2026-01-31) or a short label such as "Active"; leave out to hide it. */
  updated?: string;
  /** Leave out if you do not want a star count. */
  stars?: number | string;
  topics: string[];
  metrics?: {
    value: string;
    label: string;
    icon: "downloads" | "stars";
  }[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  stack: string[];
  summary: string;
  highlights: string[];
  links: Link[];
};

export type SelectedWork = {
  name: string;
  context: string;
  description: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  href?: string;
  hrefLabel?: string;
};

export type SkillGroup = {
  title: string;
  featured: string[];
  more: string[];
};

export type BlogPost = {
  title: string;
  description: string;
  slug: string;
  published: string;
  updated?: string;
  tags: string[];
  /** Names of githubProjects the post relates to. */
  projects: string[];
  /** Thumbnail path under content/public/, shown on the blog list card only. */
  cover?: string;
  /** Former slugs. /blog/<alias> redirects permanently to the post (see /_redirects). */
  aliases: string[];
  readingMinutes: number;
};

export type SkillSummary = {
  primary: string[];
  secondary: string[];
  total: number;
};
