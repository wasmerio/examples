export interface SearchItem {
    title: string;
    frontmatter: string;
    tags: string[];
    link: string;
    date: string;
    readTime: number;
}

export interface NavLink {
    label: string;
    href: string;
}

export interface SocialLinks {
    github: string;
    twitter: string;
    linkedin: string;
}

export interface UmamiConfig {
    websiteId: string;
    src: string;
}

export interface AnalyticsConfig {
    umami: UmamiConfig;
}

export interface RssConfig {
    title: string;
    description: string;
}

export interface AuthorConfig {
    name: string;
    bio: string;
}

export interface SiteConfig {
    title: string;
    description: string;
    siteUrl: string;
    author: AuthorConfig;
    nav: NavLink[];
    socials: SocialLinks;
    postsPerPage: number;
    analytics: AnalyticsConfig;
    rss: RssConfig;
}

export interface PostNavItem {
    id: string;
    title: string;
}
