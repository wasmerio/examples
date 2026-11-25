export type SiteConfig = {
    title: string;
    subTitle: string;

    backgroundImage: {
        enabled: boolean;
        url: string;
    };

    mirrorSite?: {
        enabled: boolean;
        url: string;
        region?: string;
    }

    favicon: string;
}

export type ProfileConfig = {
    avatar: string;
    name: string;
    description: string;
    introPage?: string;
    links: {
        name: string;
        url: string;
        icon: string;
        color?: string;
    }[];
}

export type LabConfig = {
    name: string;
    description: string;
    url: string;
    icon: string;
    color?: string;
}[]