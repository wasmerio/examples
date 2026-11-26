export const SITE_TITLE: string = "Eclipse Astro Template";
export const SITE_DESCRIPTION: string = "Explore the Eclipse Astro Template, a versatile theme crafted with Astro.js and Tailwind CSS, ideal for blogs and portfolios.";
export const X_ACCOUNT: string = "@zab_thomas";

export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};


export type SiteConfig = {
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
};

const siteConfig: SiteConfig = {
    title: 'Eclipse',
    subtitle: 'Minimal Astro.js theme',
    description: 'Explore the Eclipse Astro Template, a versatile theme crafted with Astro.js and Tailwind CSS, ideal for blogs and portfolios.',
    image: {
        src: '/ogp.png',
        alt: 'Eclipse - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Projects',
            href: '/works'
        },
        {
            text: 'Blog',
            href: '/posts'
        },
    ],
    footerNavLinks: [
        {
            text: 'Markdown style',
            href: '/markdown'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        },
        {
            text: 'Download theme',
            href: 'https://github.com/Thomas-Zabalo/astro-template'
        }
    ],
    socialLinks: [
       
    ],
    hero: {
        title: 'Showcasing My Work: A Journey in Web Development',
        text: "Hello, I'm Emily Johnson, a passionate web developer driven by creativity and a love for crafting exceptional digital experiences. My journey in web development is marked by a deep curiosity for cutting-edge technologies and a commitment to delivering innovative solutions. I thrive in dynamic environments where I merge creativity with technical expertise to build impactful websites and applications. With a sharp eye for detail and a dedication to user-centric design, I aim to enhance user experiences through intuitive interfaces and robust backend solutions.",
        image: {
            src: '/hero.jpg',
            alt: 'A person sitting at a desk in front of a computer at work',
            caption: '',
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
};

export default siteConfig;