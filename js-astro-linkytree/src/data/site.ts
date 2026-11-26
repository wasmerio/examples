export type SiteSocialLink = {
  href: string;
  ariaLabel: string;
  icon: string;
};

export type SiteLinkCard = {
  href: string;
  title: string;
  subtitle: string;
  icon: string;
  trailingIcon: string;
  style: string;
};

export const site = {
  seo: {
    title: 'John Doe @johndoe',
    ogTitle: 'John Doe',
    twitterTitle: 'John Doe',
    description:
      'Full Stack Developer, creando soluciones web desde 2015. Apasionado por React, Node.js y la tecnología open source ��',
    url: 'https://links.johndoe.dev',
    image: 'https://example.com/avatar-john-doe.png',
    siteName: 'John Doe',
    locale: 'en_US',
    twitterSite: '@johndoe',
    twitterCreator: '@johndoe',
  },

  featuredLink: {
    href: 'https://johndoe.dev/consulting',
    title: '1:1 Consulting',
    subtitle: 'Schedule a personalized session with me',
  },

  profile: {
    avatarSrc: 'https://s3.us-east-1.amazonaws.com/gndx.dev/linkytree-avatar.png',
    name: 'John Doe',
    handle: '@johndoe',
    bio: 'Full Stack Developer specializing in React and Node.js. Building modern and scalable web applications since 2015 🚀',
  },

  socialLinks: [
    {
      href: 'https://twitter.com/johndoe',
      ariaLabel: 'Twitter',
      icon: 'twitter',
    },
    {
      href: 'https://github.com/johndoe',
      ariaLabel: 'GitHub',
      icon: 'github',
    },
    {
      href: 'https://linkedin.com/in/johndoe',
      ariaLabel: 'LinkedIn',
      icon: 'linkedin',
    },
    {
      href: 'https://instagram.com/johndoe',
      ariaLabel: 'Instagram',
      icon: 'instagram',
    },
    {
      href: 'https://youtube.com/@johndoe',
      ariaLabel: 'YouTube',
      icon: 'youtube',
    },
  ] satisfies SiteSocialLink[],

  linkCards: [
    {
      href: 'https://johndoe.dev/blog',
      title: 'Blog',
      subtitle: 'Articles and tutorials about web development',
      icon: '📖',
      trailingIcon: '📖',
      style: 'background-color: rgba(250, 204, 21, 0.125); color: rgb(250, 204, 21);',
    },
    {
      href: 'https://johndoe.dev/podcast/',
      title: 'Podcast',
      subtitle: 'Conversations about technology and development',
      icon: '🎙️',
      trailingIcon: '🎙️',
      style: 'background-color: rgba(59, 130, 246, 0.125); color: rgb(59, 130, 246);',
    },
    {
      href: 'https://johndoe.dev/cursos',
      title: 'Courses',
      subtitle: 'Learn React and Node.js step by step',
      icon: '🎒',
      trailingIcon: '🎒',
      style: 'background-color: rgba(132, 204, 22, 0.125); color: rgb(132, 204, 22);',
    },
    {
      href: 'https://johndoe.dev/mediakit/',
      title: 'Sponsors (Media Kit)',
      subtitle: 'Collaborations and opportunities',
      icon: '🚀',
      trailingIcon: '🚀',
      style: 'background-color: rgba(244, 63, 94, 0.125); color: rgb(244, 63, 94);',
    },
  ] satisfies SiteLinkCard[],
} as const;
