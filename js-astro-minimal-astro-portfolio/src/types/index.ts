export interface SocialLink {
    platform: string;
    url: string;
}

export interface MetaData {
    title: string;
    description: string;
    image?: string;
    canonicalURL?: string;
}

export interface ContentFrontmatter {
    title: string;
    description: string;
    publishedAt: Date;
    draft?: boolean;
} 