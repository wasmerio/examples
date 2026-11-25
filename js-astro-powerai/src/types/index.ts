export type RegularPage = {
  frontmatter: {
    title: string;
    image?: string;
    description?: string;
    meta_title?: string;
    layout?: string;
    draft?: boolean;
    page_header: PageHeaderType;
    gallery?: GalleryType;
    open_positions?: {
      enable: boolean;
      badge: string;
      title: string;
    };
  };
  content: string;
  slug?: string;
};

export type Post = {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    image?: string;
    category: string;
    author: {
      name: string;
      avatar: string;
      designation?: string;
    };
    date?: string;
    draft?: boolean;
    featured?: boolean;
  };
  slug?: string;
  content?: string;
};

export type CaseStudy = {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    image?: string;
    logo?: string;
    date?: string;
    draft?: boolean;
    featured?: boolean;
    review_video?: string;
  };
  slug?: string;
  content?: string;
};

export type Career = {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    date?: string;
    draft?: boolean;
    job_info: {
      employ_type: string;
      experience: string;
      salary_range: string;
      location: string;
      department: string;
      deadline?: string;
    };
  };
  slug?: string;
  content?: string;
};

export type CallToAction = {
  enable?: boolean;
  title: string;
  description: string;
  button: Button;
};

export type Button = {
  enable: boolean;
  label: string;
  link: string;
};

export type LogoMarqueeType = {
  enable: boolean;
  title: string;
  items: {
    name: string;
    logo: string;
    link?: string;
  }[];
};

export type FAQType = {
  question: string;
  answer: string;
};

export type PageHeaderType = {
  enable?: boolean;
  title: string;
  subtitle?: string;
  badge: string;
  button_primary?: Button;
  button_secondary?: Button;
};

export type PricingType = {
  name: string;
  content?: string;
  highlighted?: boolean;
  price?: {
    monthly: {
      number: number;
      prefix?: string;
      suffix?: string;
    };
    yearly: {
      number: number;
      prefix?: string;
      suffix?: string;
    };
  };
  features?: {
    value: string;
    include?: boolean;
  }[];
  button?: Button;
};

export type IntegrationType = {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    image?: string;
    draft?: boolean;
    category: string;
    icon: string;
    page_header: PageHeaderType;
  };
  slug?: string;
  content?: string;
};

export type ChangelogItemType = {
  version: string;
  date: string;
  title: string;
  description: string;
  author: string;
  time: string;
  categories: {
    name: string;
    items: {
      icon: string;
      text: string;
    }[];
  }[];
};

export type GalleryType = {
  enable: boolean;
  badge: string;
  title: string;
  images: string[];
};
